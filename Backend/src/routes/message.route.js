// message.route.js
import express from "express";
import { checkAccess } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", checkAccess, getUsersForSidebar);
router.get("/:id", checkAccess, getMessages);

router.post("/send/:id", checkAccess, sendMessage);

export default router;
