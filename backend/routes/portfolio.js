const express = require("express");
const multer = require("multer");
const path = require("path");

const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ============================================
// MULTER STORAGE
// ============================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// ============================================
// GET MY PORTFOLIO
// ============================================

router.get(
    "/me",
    authMiddleware,
    async (req, res) => {

        try {

            const portfolio =
                await Portfolio.findOne({
                    user: req.userId
                });

            if (!portfolio) {

                return res.status(404).json({
                    success: false,
                    message: "Portfolio not found"
                });

            }

            return res.status(200).json({
                success: true,
                portfolio
            });

        } catch (error) {

            console.error(
                "Get Portfolio Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ============================================
// SAVE / UPDATE MY PORTFOLIO
// ============================================

router.post(
    "/save",
    authMiddleware,
    upload.single("profileImage"),

    async (req, res) => {

        try {

            // IMPORTANT:
            // User ID JWT token se aa rahi hai
            const userId = req.userId;


            if (!userId) {

                return res.status(401).json({
                    success: false,
                    message: "User authentication failed"
                });

            }


            const {
                name,
                profession,
                about,
                email,
                phone,
                location,
                skills,
                education,
                projects,
                socialLinks
            } = req.body;


            // ========================================
            // VALIDATION
            // ========================================

            if (!name || !name.trim()) {

                return res.status(400).json({
                    success: false,
                    message: "Name is required."
                });

            }


            // ========================================
            // SAFE JSON PARSER
            // ========================================

            const parseJSON = (value, fallback = []) => {

                if (!value) {
                    return fallback;
                }

                try {
                    return JSON.parse(value);
                } catch (error) {
                    return fallback;
                }
            };


            // ========================================
            // PORTFOLIO DATA
            // ========================================

            const portfolioData = {

                user: userId,

                name: name.trim(),

                profession:
                    profession?.trim() || "",

                about:
                    about?.trim() || "",

                email:
                    email?.trim() || "",

                phone:
                    phone?.trim() || "",

                location:
                    location?.trim() || "",

                skills:
                    parseJSON(skills),

                education:
                    parseJSON(education),

                projects:
                    parseJSON(projects),

                socialLinks:
                    parseJSON(socialLinks)

            };


            // ========================================
            // PROFILE IMAGE
            // ========================================

            if (req.file) {

                portfolioData.profileImage =
                    "/uploads/" +
                    req.file.filename;

            }


            // ========================================
            // SAVE / UPDATE
            // ========================================

            const portfolio =
                await Portfolio.findOneAndUpdate(

                    {
                        user: userId
                    },

                    portfolioData,

                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }

                );


            // ========================================
            // SUCCESS
            // ========================================

            return res.status(200).json({

                success: true,

                message:
                    "Portfolio saved successfully.",

                portfolio

            });


        } catch (error) {

            console.error(
                "Portfolio Save Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


module.exports = router;