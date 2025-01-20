// auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

export const signup = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be more then 6 character" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User alredy Exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedpassword,
        });

        if (newUser) {
            await newUser.save();

            // Generate a JWT token
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, {
                expiresIn: "1d",
            });

            // Set the token as a cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilepic: newUser.profilepic,
                message: "User Signup Successfully",
            });
        } else {
            return res.status(400).json({ message: "Invalid User data" });
        }
    } catch (error) {
        console.log("Error in Signup controller", error);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

export const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Cradential" });
        }

        const Ispassword = await bcrypt.compare(password, user.password);
        if (!Ispassword) {
            return res.status(400).json({ message: "Invalid Crasiential" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
            expiresIn: "1d",
        });

        // Set the token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true, // Prevent access from client-side JavaScript
            secure: process.env.NODE_ENV === "production", // Send over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // Token valid for 1 day
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.log("Error", error);
        res.status(400).son({ message: "internal server Error" });
    }
};

export const logout = async(req, res) => {
    try {
        console.log("Logging out user...");
        res.cookie("jwt", "", { maxAge: 0 });
        console.log("JWT cookie cleared.");
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout:", error);
        res.status(400).json({ message: "Internal server Error" });
    }
};

export const updateProfile = async(req, res) => {
    try {
        const { profilepic } = req.body;
        const userId = req.user._id;

        // if (!profilepic) {
        //     return res.status(400).json("Profile pic is required");
        // }

        const uplodeResponce = await cloudinary.uploader.upload(profilepic);
        console.log("Cloudinary Upload Response:", uplodeResponce);

        const updateduser = await User.findByIdAndUpdate(
            userId, { profilepic: uplodeResponce.secure_url }, { new: true }
        );

        console.log("Updated User in DB:", updateduser);
        return res.status(200).json(updateduser);
    } catch (error) {
        console.log("error", error);
        res.status(400).json("Interna Server Error");
    }
};

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            // Handle case where req.user is not set
            return res.status(401).json({ message: "Not valid Logger" });
        }

        return res.status(200).json(req.user); // Send the authenticated user's data
    } catch (error) {
        console.error("Error in checkAuth:", error.message);
        return res.status(500).json({ message: "Internal Server Error" }); // Corrected status code and message
    }
};