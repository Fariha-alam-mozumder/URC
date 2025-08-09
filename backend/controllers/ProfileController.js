import { imageValidator } from "../utils/helper.js";

class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user
            return res.json({
                status: 200, user
            })

        } catch (error) {
            return res.status(500).json({
                message: "Somthing went  wrong!"
            })
        }


    }
    static async store() {

    }
    static async show() {

    }
    static async update(req, res) {
        //! Implement a method that allows an authenticated user to update their own profile (or maybe others’ if authorized).

        try {
            const { id } = req.params;       // ID from the route, e.g., /profile/123
            const authUser = req.user;       // Decoded user data from JWT token

            // Optional: Allow only the logged-in user to update their own profile
            if (parseInt(id) !== authUser.id) {
                return res.status(403).json({ message: "Unauthorized to update this profile" });
            }

            //! validation for grtting profile correctly
            if (!req.files || Object.keys(req.files).length == 0) {

                return res.status(400).json({ status: 400, message: "Profile Image is required" });
            }

            const profile = req.files.profile //taking profile passed by user
            const message = imageValidator(profile?.size, profile.mimetype)
            if (message != null) { //if user did something wrong then imageValidator wont return NULL
                return res.status(400).json({
                    errors: {
                        profile: message,
                    },
                });
            }

            const imgExt = profile?.name.split(".")
            const imageName = generateRandomNum() + "." + imgExt[1];
            const uploadPath = process.cwd() + "/public/images/" + imageName //! cwd: Current Path Directory

            profile.mv(uploadPath, (err) => {
                if (err) throw err
            })

            await prisma.users.update({
                data: {
                    profile: imageName,
                },
                where: {
                    id: Number(id), //!typecasting to number
                }
            })

            return res.json({
                status: 200,
                message: "Profile updated successfully!"
            })

        } catch (error) {
            console.error("Update Error: ", error);
            return res.status(500).json({ error: "Something went wrong. Please try again!" });
        }
    }

    static async destroy() {

    }
}
export default ProfileController