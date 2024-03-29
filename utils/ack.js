const mailer = require("nodemailer");
require("dotenv").config()

const transporter = mailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});


async function mail(sub, html, toMail) {
  const info = await transporter.sendMail({
    from: process.env.MAIL,
    to: toMail,
    subject: sub,
    html: html,
  });

  console.log("Message sent: %s", info);
}
module.exports = mail