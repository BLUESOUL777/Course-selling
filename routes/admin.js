import { Router } from 'express';
import {adminModel, courseModel} from '../db.js';
import jwt from "jsonwebtoken";
import { JWT_ADMIN_PASSWORD } from '../config.js';
import bcrypt from "bcrypt";
const adminRouter = Router();
import {adminMiddleware} from "../middlewares/admin.js"

adminRouter.post("/signup", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        
        const admin = await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        
        return res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName
            }
        });
    } catch (error) {
        console.log(`Error is ${error}`);
        return res.status(500).json({
            message: `Signup Failed: ${error.message}`
        });
    }
});

adminRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });
        
        if (!admin) {
            return res.status(403).json({
                message: "Incorrect Credentials"
            });
        }
        
        const matchPassword = await bcrypt.compare(password, admin.password);
        
        if (matchPassword) {
            const token = jwt.sign({
                id: admin.id
            }, JWT_ADMIN_PASSWORD);
            
            return res.json({
                token,
                admin: {
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName
                }
            });
        } else {
            return res.status(403).json({
                message: "Incorrect Credentials"
            });
        }
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ 
            message: "Cannot Signin",
            error: error.message 
        });
    }
});

adminRouter.post("/course_create", adminMiddleware, async (req, res) => {
    try {
        const creatorId = req.userId;
        const { title, imageUrl, price, description } = req.body;

        const course = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId
        });
        
        return res.json({
            message: "Course Created",
            courseId: course._id
        });
    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            message: "Failed to create course",
            error: error.message
        });
    }
});

adminRouter.put("/course_update", adminMiddleware, async (req, res) => {
    try {
        const creatorId = req.userId;
        const { title, imageUrl, price, description, courseId } = req.body;

        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId
        }, {
            title:title, 
            description:description,
            imageUrl:imageUrl, 
            price:price
        });
        
        return res.json({
            message: "Course updated",
            course
        });
    } catch (error) {
        console.error("Error updating course:", error);
        return res.status(500).json({
            message: "Failed to update course",
            error: error.message
        });
    }
});

adminRouter.get("/bulk", adminMiddleware, async (req, res) => {
    try {
        const creatorId = req.userId;

        const courses = await courseModel.find({
            creatorId
        });

        return res.json({
            message: "Your courses are:",
            courses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
});

adminRouter.post("/course/create", (req, res) => {
    res.json({
        message: "Course created successfully"
    });
});

export { adminRouter };
