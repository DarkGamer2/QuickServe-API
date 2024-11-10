import express from "express";
import userController from "../controllers/userController";
import { Router } from "express";

const router = Router();

router.get('/profile/:id', userController.getUser);

export default router;