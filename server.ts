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

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET!,
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
    allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Origin'], // Allowed headers
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});