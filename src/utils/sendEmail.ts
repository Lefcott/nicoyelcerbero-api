import nodemailer from "nodemailer";
import fs from "fs";
import Mail from "nodemailer/lib/mailer";
import path from "path";
import mustache from "mustache";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = (templateName: string, to: string, data) =>
  new Promise((resolve) => {
    const template = fs
      .readFileSync(
        path.join(__dirname, `../emailTemplates/${templateName}/template.html`)
      )
      .toString();
    const { subject } = JSON.parse(
      fs
        .readFileSync(
          path.join(__dirname, `../emailTemplates/${templateName}/data.json`)
        )
        .toString()
    );

    const mailOptions: Mail.Options = {
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: mustache.render(template, data),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
      resolve(true);
    });
  });
