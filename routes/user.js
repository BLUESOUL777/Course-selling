import { Router } from "express";
import bcrypt from "bcrypt";
import { courseModel, purchaseModel, userModel } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "../config.js";
import { userMiddleware } from "../middlewares/user.js";

const userRouter = Router();

userRouter.post("/signup" , async (req,res)=>{
    const { email,password,firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password,5);

    try{
        const user = await userModel.create({
            email,
            password:hashedPassword,
            firstName,
            lastName
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Signup failed"
        })
    }
})

userRouter.post("/signin" ,async (req,res)=>{

try{
    const {email,password} = req.body;

    const user = await userModel.findOne({
        email:email
    });

    const matchPassword = bcrypt.compare(password,user.password);

    if(matchPassword){
        const token = jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);  
        res.json({
            token,
            user:{
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName
            }
        })
    }else{
        res.status(403).json({
            message:`Incorrect Credentials`
        });
    }
}catch(error){
    console.log(`Error ${error}`);
    return res.status(500).json({message:"Login endpoint"});
    }  
});

userRouter.get("/purchases" , userMiddleware ,async (req,res)=>{
    const userId = req.userId;
    const purchased = await purchaseModel.find({
        userId,
    })

    const courseData = await courseModel.find({
        _id: { $in: purchased.map(purchase => purchase.courseId) }
    });

    res.json({
        message:"Ur purchaes are:-",
        purchased,
        courseData
    })
})

export { userRouter };