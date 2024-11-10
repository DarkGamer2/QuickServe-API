import mongoose from "mongoose";

import { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`)
const JobSchema=new Schema({
    jobName:String,
    jobRequester:String,
    roomNumber:Number,
    phoneNumber:String,
    Unit:String,
    requesterEmail:String,
    jobLocation:String,
    productInformation:[
        {
            productManufacturer:String,
            productModelNumber:String,
            productSerialNumber:String,
        }
    ],
    jobDescription:String,
    jobRequestDate:Date,
    assignedBy:String,
    jobType:String,
    jobStatus:String,
})

const Job=mongoose.model("Job",JobSchema);

export default Job;