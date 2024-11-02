import { Schema } from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`)
const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    created_at: Date,
    updated_at: Date,
    skillSet: [String],
});

const User = mongoose.model('User', UserSchema);

export default User;