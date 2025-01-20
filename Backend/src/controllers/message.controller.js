// message.controller.js
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getRecevierSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        if (!loggedInUserId) {
            return res.status(400).json({ message: "Logged-in user ID not found" });
        }
        console.log("Logged-in User ID:", loggedInUserId);

        const filteredUser = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");

        if (!filteredUser.length) {
            console.log("No other users found.");
            return res.status(404).json({ message: "No other users found" });
        }

        console.log("Filtered Users:", filteredUser);

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

export const getMessages = async(req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id.toString();

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error", error);
        res
            .status(500)
            .json({ message: `Internal Server Error: ${error.message}` });
    }
};

export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // receiverId from params
        const senderId = req.user._id.toString(); // senderId from the logged-in user

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); // Correct method name
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        // REALTIME FUNCTIONALITY FOR CHAT
        const receiverSocketId = getRecevierSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ newMessage });
    } catch (error) {
        console.log("Error", error.message);
        res
            .status(500)
            .json({ message: `Internal Server Error: ${error.message}` });
    }
};