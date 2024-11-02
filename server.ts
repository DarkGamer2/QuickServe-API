import express from "express";
import cors from "cors";
const app = express();
import authRoutes from './src/routes/authenticationRoutes';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth",authRoutes);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});