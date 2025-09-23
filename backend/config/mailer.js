import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (toMail, subject, body) => {
    const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toMail,
    subject: subject,
    html: body, 
    });
}
