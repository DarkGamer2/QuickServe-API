import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';
const app = express();
import authRoutes from './src/routes/authenticationRoutes';
import jobRoutes from './src/routes/jobRoutes';
import userRoutes from "./src/routes/userRoutes";
import reportRoutes  from "./src/routes/reportRoutes";
import passport from 'passport';
require ("./src/auth/passportConfig");
import cookieParser from 'cookie-parser';
import session from 'express-session';
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'https://divine-illumination-production-e575.up.railway.app', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
app.use(cors(corsOptions));

app.use("/api/auth",authRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users',userRoutes)
app.use('/api/reports',reportRoutes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});