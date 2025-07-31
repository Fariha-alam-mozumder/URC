import prisma from "../DB/db.config.js";
import {Vine, errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import { error } from "console";
import bcrypt from "bcryptjs";

const vine = new Vine()
class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema)
            const playload = await validator.validate(body)

            //! Encrypt the password
            const salt = bcrypt.genSaltSync(10)
            playload.password = bcrypt.hashSync(playload.password, salt)

            return res.json({ playload });


        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                //console.log(error.messages)

                return res.status(400).json({
                    errors: error.messages
                });
            }
            //console.error('Register error:', error);  // <== Add this line
            return res.status(500).json({ error: "Internal server error" });

        }
    }

}

export default AuthController;