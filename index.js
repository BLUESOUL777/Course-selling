import express from "express"
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

import { userRouter } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
app.use(express.json());
app.use("/edu/user" , userRouter);
app.use("/edu/course" , courseRouter);
app.use("/edu/admin" , adminRouter);



async function main(){
    mongoose.connect("");
    console.log("Connected to db");
    app.listen(3000);
}

main()