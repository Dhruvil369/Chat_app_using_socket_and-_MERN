// auth.route.js
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { checkAccess } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/", (req, res) => {
    res.send("Route Main");
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/Logout", logout);
router.put("/updateProfile", checkAccess, updateProfile);
router.get("/check", checkAccess, checkAuth);

export default router;