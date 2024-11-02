import mongoose from "mongoose";
import { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`)
const partSchema = new Schema({
    partName: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true }
});

const completionFormSchema = new Schema({
    parts: [partSchema],
    workedPerformed: { type: String, required: true },
    technicianName: { type: String, required: true },
    dateCompleted: { type: Date, required: true },
    totalHoursTaken: { type: Number, required: true },
    clientSignature: { type: String, required: true },
});

const CompletionForm = mongoose.model('CompletionForm', completionFormSchema);

export default CompletionForm;