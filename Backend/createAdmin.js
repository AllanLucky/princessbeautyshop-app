import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import User from "./models/userModel.js";

dotenv.config();

const createAdmins = async () => {
  try {
    await dbConnection();
    console.log("✅ DB connected");

    // optional: clear existing admins
    await User.deleteMany({ role: "admin" });

    // Super Admin
    const superAdmin = await User.create({
      name: "Chief Admin",
      email: "chiefadmin@princessbeautyshop.com",
      password: "admin123", // plain text, schema will hash
      role: "admin",
      status: "active",
      isVerified: false
    });

    // Allan Admin
    const allanAdmin = await User.create({
      name: "director allan",
      email: "director.allan@princessbeautyshop.com",
      password: "35600879", // plain text, schema will hash
      role: "admin",
      status: "active",
      isVerified: false
    });

    console.log("🔥 ADMINS CREATED SUCCESS");
    console.log(superAdmin);
    console.log(allanAdmin);

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

createAdmins();
