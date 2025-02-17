import { Router } from "express";
import {
  completeTask,
  createTask,
  deleteTask,
  editTask,
  getAllTask,
  getAllTaskCount,
  getTask,
} from "../services/blockChain.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getProductivityAdvice } from "../ai/ai.js";

const taskRoutes = Router();

// Get all tasks
taskRoutes.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await getAllTask();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task count
taskRoutes.get("/count", authenticateToken, async (req, res) => {
  try {
    console.log("Getting task count");
    const count = await getAllTaskCount();
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
taskRoutes.post("/create", authenticateToken, async (req, res) => {
  const { title, description, priority, progress, deadline } = req.body;

  console.log(
    "Creating task api...",
    title,
    description,
    priority,
    progress,
    deadline
  );
  try {
    const receipt = await createTask(
      title,
      description,
      priority,
      progress,
      deadline
    );
    res.json({ message: "Task created", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a task
taskRoutes.put("/:id", authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, description, priority, progress, deadline } = req.body;

  console.log(
    "Editing task...",
    taskId,
    title,
    description,
    priority,
    progress,
    deadline
  );
  try {
    const aiAdvice = await getProductivityAdvice({
      title,
      description,
      priority,
      progress,
      deadline,
    });

    const receipt = await editTask(
      taskId,
      title,
      description,
      priority,
      progress,
      aiAdvice,
      deadline
    );
    res.json({ message: "Task edited", receipt });
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ error: error.message });
  }
});

// Complete a task
taskRoutes.patch("/:id/complete", authenticateToken, async (req, res) => {
  const { id } = req.params;

  console.log("Completing task...", id);
  try {
    const receipt = await completeTask(id);
    res.json({ message: "Task status updated", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific task
taskRoutes.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  console.log("Fetching task...", id);
  try {
    const task = await getTask(id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
taskRoutes.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  console.log("Deleting task...", id);
  try {
    const receipt = await deleteTask(id);
    res.json({ message: "Task deleted", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default taskRoutes;
