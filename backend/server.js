const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const rootPath = path.join(__dirname, "..");


app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


app.use(
    express.static(rootPath)
);


app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            rootPath,
            "index.html"
        )
    );

});


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/portfolio",
    portfolioRoutes
);


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB Connected Successfully ✅"
        );

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    })
    .catch(error => {

        console.error(
            "MongoDB Connection Failed ❌"
        );

        console.error(
            error.message
        );

    });