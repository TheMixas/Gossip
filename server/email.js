
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",

    port:process.env.NODE_ENV === "production" ? 465 : 25,
    secure: process.env.NODE_ENV === "production",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
});

// async.await is not allowed in global scope, must use a wrapper
export default async function sendEmail(template) {
    // send mail with defined transport object
    console.log("sending email with template: ", template)
    const info = await transporter.sendMail(template);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

// main().catch(console.error);
