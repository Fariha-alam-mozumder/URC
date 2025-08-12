import { supportedMimes } from "../config/filesystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// Validate only PDFs (maxSize in MB)
export const fileValidator = (maxSize, mimeType) => {
  if (mimeType !== 'application/pdf') {
    throw new Error('Only PDF files are allowed')
  }
  // For express-fileupload, size is in bytes
  // You'll need to pass the file object to get size in bytes
  return (file) => {
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      throw new Error(`File size must be less than ${maxSize}MB`)
    }
  }
}

// Upload PDF file, returns relative file path string
export const uploadFile = async (file, isFile = true, type = 'pdf') => {
  const ext = path.extname(file.name || '')
  const filename = `${uuidv4()}${ext}`
  const uploadDir = type === 'pdf' ? 'public/files' : 'public/images'

  await fs.promises.mkdir(uploadDir, { recursive: true })

  const uploadPath = path.join(uploadDir, filename)

  if (isFile) {
    await file.mv(uploadPath) // express-fileupload method
  } else {
    // handle other upload methods if needed
    await fs.promises.writeFile(uploadPath, file.data)
  }

  // return relative path (you can adjust to absolute URL if needed)
  return uploadPath
}

export const imageValidator = (size, mime) => {
  if (byteToMb(size) > 2) {
    return "Image size must be less than 2MB";
  } else if (!supportedMimes.includes(mime)) {
    return "IMAGE must be type of png, jpg, gif, jpeg, webp, svg...";
  }
  return null;
};


export const byteToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

//! Storing a profile image to avoid filename conflicts (ex: 2 different profile image with same name "a.jpg")
//! This ensures the filename is globally unique
export const generateRandomNum = () => {
  return uuidv4();
};

//* returning image url
export const getImageUrl = (imgName) => {
  if (!imgName) {
    // return dummy image from local public/images directory
    return `${process.env.APP_URL}/images/default.png`;
  }
  //return the whole image url
  return `${process.env.APP_URL}/images/${imgName}`;
};

//* To delete the previous image to update an image of a news
export const removeImage = (imageName) => {
  const path = process.cwd() + "/public/images/" + imageName;

  if (fs.existsSync(path)) {
    //! Checks if a file or directory exists at the given path.
    fs.unlinkSync(path); //! Deletes a file at the given path synchronously.
  }

  // This is blocking (synchronous). If you're deleting files in a high-traffic API, consider using the async version:
  // fs.unlink(path, (err) => {
  //   if (err) console.error(err);
  // });
};

//! upload new image
export const uploadImage = (image) => {
  const imgExt = image?.name.split(".");
  const imageName = generateRandomNum() + "." + imgExt[1];
  const uploadPath = process.cwd() + "/public/images/" + imageName; //! cwd: Current Path Directory

  image.mv(uploadPath, (err) => {
    if (err) throw err;
    //console.log("Image uploaded to:", uploadPath);
  });
  //* file uploaded

  return imageName;
};
