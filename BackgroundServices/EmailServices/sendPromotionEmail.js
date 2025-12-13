import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js"; // make sure this model exists

dotenv.config();

const sendPromotionEmail = async () => {
  try {
    const users = await User.find({ status: 1 }); // only active users
    const products = await Product.aggregate([
      { $sample: { size: 5 } } // pick 5 random products
    ]);

    for (let user of users) {
      const data = await ejs.renderFile(
        "templates/promotion.ejs", // create a promotion template
        {
          name: user.name,
          products, // send the sampled products
          supportLink: process.env.SUPPORT_LINK
        }
      );

      const messageOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Check out our latest promotions!",
        html: data,
      };

      await sendMail(messageOptions);
    }
  } catch (error) {
    console.log("Promotion email error:", error);
  }
};

export default sendPromotionEmail;
