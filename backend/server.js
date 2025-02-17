import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/TaskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoute.js";
import aiRoutes from "./routes/aiRoutes.js";
import "./ai/backgroundJob.js";

config();

const app = express();
app.use(json());
app.use(cors());

app.use("/api/ai", aiRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
