const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;


        // =========================================
        // CHECK AUTHORIZATION HEADER
        // =========================================

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required"

            });

        }


        // =========================================
        // GET TOKEN
        // =========================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Token missing"

            });

        }


        // =========================================
        // VERIFY JWT
        // =========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =========================================
        // SET USER ID
        // =========================================

        req.userId =
            decoded.userId;


        if (!req.userId) {

            return res.status(401).json({

                success: false,

                message:
                    "User ID not found in token"

            });

        }


        console.log(
            "Authenticated User ID:",
            req.userId
        );


        next();


    } catch (error) {

        console.error(
            "Auth Middleware Error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

}


module.exports =
    authMiddleware;