import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "../config.js";

export function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            message: "Authentication token missing"
        });
    }
    
    try {
        const tokenString =token;
        
        const decoded = jwt.verify(tokenString, JWT_USER_PASSWORD);
        
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        } else {
            return res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(403).json({
            message: "Authentication failed",
            error: error.message
        });;
    }
}