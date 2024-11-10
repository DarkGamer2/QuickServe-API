import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';
const app = express();
import authRoutes from './src/routes/authenticationRoutes';
import jobRoutes from './src/routes/jobRoutes';
import userRoutes from "./src/routes/userRoutes";
import passport from 'passport';
require ("./src/auth/passportConfig");
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://divine-illumination-production-e575.up.railway.app', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies and credentials
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use("/api/auth",authRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users',userRoutes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});