import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import fetch from "node-fetch";
import User from "../models/User.js";

const router = express.Router();

const validateSignup = [
    body("email").isEmail(),
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 6 }),
    body("recaptchaToken").notEmpty()
];

const validateLogin = [
    body("username").notEmpty(),
    body("password").notEmpty(),
    body("recaptchaToken").notEmpty()
];

router.post("/signup", validateSignup, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid inputs", errors: errors.array() });

    const { email, username, password, recaptchaToken } = req.body;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

    try {
        const captchaRes = await fetch(verifyURL, { method: "POST" });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) return res.status(400).json({ message: "Captcha failed" });

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", validateLogin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid inputs", errors: errors.array() });

    const { username, password, recaptchaToken } = req.body;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

    try {
        const captchaRes = await fetch(verifyURL, { method: "POST" });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) return res.status(400).json({ message: "Captcha failed" });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/users", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
});


export default router;