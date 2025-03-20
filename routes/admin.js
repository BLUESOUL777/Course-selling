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
        const matchPassword = bcrypt.compare(password, admin.password);
        if (matchPassword) {
            const token = jwt.sign({
                id: admin.id
            }, JWT_ADMIN_PASSWORD);
            res.json({
                token,
                admin: {
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName
                }
            });
        } else {
            res.status(403).json({
                message: `Incorrect Credentials`
            });
        }
    } catch (error) {
        console.log(`Error ${error}`);
        return res.status(500).json({ message: "Login endpoint" });
    }
});

adminRouter.post("/course",adminMiddleware ,async (req,res)=>{
    const creatorId = req.userId;

    const {title , imageUrl , price , description } = req.body;

    const course = await courseModel.create({
        title,description,imageUrl,price,creatorId
    })
    res.json({
        message: `COurse Created`,
        courseId : course._id
    })
})

adminRouter.put("/" , (req,res)=>{
    
})

adminRouter.get("/bulk" , (req,res)=>{
    res.json({
        message:"Login endpoint"
    })
})

adminRouter.post("/course/create", (req, res) => {
    res.json({
        message: "Course created successfully"
    });
});

export { adminRouter };
