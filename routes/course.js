import { Router } from 'express';
const courseRouter = Router();


courseRouter.post("/purchase" , (req,res)=>{
    res.json({
        message:"Login endpoint"
    })
})


courseRouter.get("/preview" , (req,res)=>{
    res.json({
        message:"preview endpoint"
    })
})

export { courseRouter };