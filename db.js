import mongoose from "mongoose";
import { number, z } from "zod";

const userSchema = new mongoose.Schema({
    email: {type : String, required: true, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const adminSchema = new mongoose.Schema({
    email: {type : String, required: true, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: mongoose.Schema.Types.ObjectId
})

const purchaseSchema = new mongoose.Schema({
    courseId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
})

const userModel = mongoose.model("user" , userSchema);
const courseModel = mongoose.model("course" , courseSchema);
const purchaseModel = mongoose.model("purchase" , purchaseSchema);
const adminModel = mongoose.model("admin" , adminSchema);

export {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}