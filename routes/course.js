import { Router } from 'express';
const courseRouter = Router();
import { courseModel, purchaseModel } from '../db.js';
import { userMiddleware } from '../middlewares/user.js';


courseRouter.post("/purchase" , userMiddleware , async (req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    const course = await courseModel.create({
        courseId,
    })
    await purchaseModel.create({
        userId,
        courseId
    })
    
    res.json({
        message:`You have purchased the course for ${course.description}`
    })
})


courseRouter.get("/preview" , async (req,res)=>{
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})

export { courseRouter };