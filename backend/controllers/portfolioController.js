const Portfolio = require("../models/Portfolio");

exports.createPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.create(req.body);

        res.status(201).json({
            success: true,
            message: "Portfolio created successfully",
            data: portfolio
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            data: portfolios
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found"
            });
        }

        res.json({
            success: true,
            data: portfolio
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.updatePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found"
            });
        }

        res.json({
            success: true,
            message: "Portfolio updated successfully",
            data: portfolio
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndDelete(
            req.params.id
        );

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found"
            });
        }

        res.json({
            success: true,
            message: "Portfolio deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};