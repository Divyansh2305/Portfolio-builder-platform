const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        profession: {
            type: String,
            default: ""
        },

        about: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        profileImage: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        education: {
            type: Array,
            default: []
        },

        projects: {
            type: Array,
            default: []
        },

        socialLinks: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Portfolio",
    portfolioSchema
);