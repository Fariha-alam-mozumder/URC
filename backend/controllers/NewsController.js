import {
  generateRandomNum,
  imageValidator,
  removeImage,
  uploadImage,
} from "../utils/helper.js";
import { newsSchema } from "../validations/newsValidation.js";
import { Vine, errors } from "@vinejs/vine";
import { PrismaClient } from "@prisma/client";
import NewsApiTransform from "../transform/newApiTransform.js";
import { error } from "console";
import redisCache from "../DB/redis.config.js";
import logger from "../config/logger.js";

const prisma = new PrismaClient();
const vine = new Vine();

class NewsController {
  static async index(req, res) {
    //! pagination logic
    //! This reads from the URL. If not given, defaults to 1.
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    //* to get news
    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    }); //findmany() returns array
    //! When we have less data (20-100), we can use transform function
    const newsTransform = news?.map((item) => NewsApiTransform.transform(item));

    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);

    return res.json({
      status: 200,
      news: newsTransform,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  }
  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      //* This block of code checks if an image file was uploaded with the request (req).
      //* If no file is found, it returns a 400 Bad Request with an error message.
      if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json({
          errors: {
            image: "image field is required",
          },
        });
      }

      //* as image is coming, it is stored
      const image = req.files?.image;

      // * image custom validator
      const message = imageValidator(image?.size, image.mimetype);
      if (message != null) {
        //if user did something wrong then imageValidator wont return NULL
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      //* to upload image
      const imageName = uploadImage(image);
      //! file uploaded

      //adding more key&value to the "payload" which already passed the validation
      payload.image = imageName;
      payload.user_id = user.id;

      //* store in DB
      const news = await prisma.news.create({
        data: payload,
      });

      //! remove cache
      redisCache.del("/api/news", (err) => {
        if(err) throw err;
      });

      //* returning success msg alongwith the news created
      return res.json({
        status: 200,
        message: "News stored successfully!",
        news,
      });
      //if it is succeed that another image will be add in folder "public/images"
    } catch (error) {
      //console.error("ERROR in NewsController.store:", error); 
      //* we will use Logger
      logger.error(error?.message);

      if (error instanceof errors.E_VALIDATION_ERROR) {
        //console.log(error.messages)
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          status: 500,
          error: "Something went wrong. Please try again.",
        });
      }
    }
  }
  static async show(req, res) {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
      const transFormNews = news ? NewsApiTransform.transform(news) : null;
      return res.json({ status: 200, news: transFormNews });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again" });
    }
  }
  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (user.id != news.user_id) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      //validate body
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      //! if the user wants to update the image too
      const image = req?.files?.image;

      //defining imageName
      let updatedImageName = undefined;

      //! Then, we have to delete the previous image
      if (image) {
        //* check validation before deleting
        const message = imageValidator(image?.size, image?.mimetype);
        if (message != null) {
          return res.status(400).json({
            errors: {
              image: message,
            },
          });
        }

        //* to upload image
        //const imageName = uploadImage(image); "const" na likhe upor a define kore likhte pari like:
        updatedImageName = uploadImage(image);
        //! file uploaded

        //! delete old image
        removeImage(news.image);
      }

      payload.image = updatedImageName ?? news.image;

      await prisma.news.update({
        data: payload,
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        message: "News updated successfully!",
      });
    } catch (error) {
      console.error("ERROR in NewsController.update:", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        //console.log(error.messages)
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          status: 500,
          error: "Something went wrong. Please try again.",
        });
      }
    }
  }
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id != news.user_id) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      //!Delete image from the system
      removeImage(news.image);

      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });
      return res.json({
        message: "News deleted successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: "Something went wrong. Please try again.",
      });
    }
  }
}

export default NewsController;
