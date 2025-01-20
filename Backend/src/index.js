// index.js
import express from "express";
import router from "./routes/auth.route.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import { connnectDB } from "./lib/db.js";
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import cloudinary from "cloudinary";

dotenv.config();

app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed


// app.use(express.json());
app.use(cookieparser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", router);
app.use("/api/messages", messageRoute);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINAME_API_KEY,
    api_secret: process.env.CLOUDINARY_SECERATE,
});

server.listen(5001, () => {
    console.log("Server is running on port 5001");
    connnectDB();
});