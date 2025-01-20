// auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const checkAccess = async(req, res, next) => {
    try {
        // const token = req.cookies.jwt;
        const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) return res.status(401).json({ message: "Unauthoized person" });

        let decode;
        try {
            decode = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Token is invalid or expired" });
        }

        const user = await User.findById(decode.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User Not Found" });

        req.user = user;
        console.log("Authenticated User:", req.user); // Debugging log
        
        next();

    } catch (error) {
        console.log("Error in middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};