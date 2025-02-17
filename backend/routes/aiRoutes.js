import express from "express";
import { getProductivityAdvice, prioritizeTasks } from "../ai/ai.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { editTask } from "../services/blockChain.js";

const aiRoutes = express.Router();

aiRoutes.post("/get-advice", authenticateToken, async (req, res) => {
  const { id, title, description, priority, progress, deadline, completed } =
    req.body;

  try {
    const aiAdvice = await getProductivityAdvice({
      title,
      description,
      priority,
      progress,
      deadline,
      completed,
    });

    editTask(id, title, description, priority, progress, aiAdvice, deadline);
    res.json(aiAdvice);
  } catch (error) {
    res.status(500).json({ error: "Error generating AI advice." });
  }
});

aiRoutes.post("/prioritize-task", authenticateToken, async (req, res) => {
  const { tasks } = req.body;

  try {
    const aiAdvice = await prioritizeTasks(tasks);
    res.json(aiAdvice);
  } catch (error) {
    res.status(500).json({ error: "Error generating AI advice." });
  }
});

export default aiRoutes;
