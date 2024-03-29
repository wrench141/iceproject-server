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


const sendCode = async(email, code) => {
    try {
      await transporter.sendMail({
        from: process.env.MAIL,
        to: email,
        subject: "Your Verification Token",
        html: `<h2>${code}</h2>`,
      });
      return true;
    } catch (error) {
      console.log(error)
      return false
    }
}

module.exports = sendCode