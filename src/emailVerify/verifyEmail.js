import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

export const verifyEmail = async (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.mailUser,
            pass: process.env.mailPass
        }
    })

    const emailconfiguration = {
        from: process.env.mailUser,
        to: email,
        subject: "Email Verification",
        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://10.162.155.222:7001/api/v3/verify?token=${token}
           Thanks`
    }

    transporter.sendMail(emailconfiguration, function (error, info) {
        if (error) {
            console.error("Email Not Sent", error)
            throw new Error(error)
        }
        console.log("Email Sent Successfully")
        console.log(info)
    })
}

