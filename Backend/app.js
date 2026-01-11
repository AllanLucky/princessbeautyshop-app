import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoutes.js";
import bannerRoute from "./routes/bannerRoutes.js";
import usersRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
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
app.use(cors());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/stripe", stripeRoute);

// ERROR HANDLING MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

export default app;

