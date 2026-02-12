import app from "./app.js";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js"

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to the database first
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });
