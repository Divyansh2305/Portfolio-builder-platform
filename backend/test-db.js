const mongoose = require("mongoose");
require("dotenv").config();

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MONGODB CONNECTED");
        process.exit(0);
    })
    .catch((error) => {
        console.log("❌ MONGODB FAILED");
        console.log("Error:", error.message);
        process.exit(1);
    });