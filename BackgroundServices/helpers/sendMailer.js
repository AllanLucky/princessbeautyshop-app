import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function createTransporter(config) {
  const transporter = nodemailer.createTransport(config);
  return transporter;
}
let configurations = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  requireTls: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const sendMail = async (messageoption) => {
  console.log("Creating transporter...", configurations, messageoption);
  const transporter = await createTransporter(configurations);
  console.log("Verifying transporter...");
  await transporter.verify();
  console.log("Transporter verified. Sending email...");
  await transporter.sendMail(messageoption, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Email sent: " + info.response);
    console.log(info.response);
  });
};

export default sendMail;
