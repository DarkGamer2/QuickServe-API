import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';
import authRoutes from './src/routes/authenticationRoutes';
import jobRoutes from './src/routes/jobRoutes';
import userRoutes from "./src/routes/userRoutes";
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();
require ("./src/auth/passportConfig");

const app = express();

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'https://divine-illumination-production-e575.up.railway.app', // Allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicit methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
