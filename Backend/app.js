import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoutes.js";
import bannerRoute from "./routes/bannerRoutes.js";
import usersRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import stripeRoute from "./routes/stripeRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// MIDDLEWARE

// Parse JSON body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: The origin ${origin} is not allowed`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies and auth headers
  })
);

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/v1/stripe", stripeRoute);

// ERROR HANDLING MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

export default app;
