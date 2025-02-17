import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Collapse,
} from "@mui/material";
import { deleteTask, getAiAdvice, markTaskCompleted } from "../utility/utils";

export const renderAdvicePoints = (adviceText) => {
  // Split the advice into points using numbers or bullets
  const points = adviceText
    ?.split(/\d\.\s|•/g) // Splitting by number bullets or other markers
    ?.filter((point) => point.trim() !== ""); // Remove empty points
  return (
    <ul>
      {points?.map((point, index) => (
        <li key={index}>
          <Typography variant="body2">{point.trim()}</Typography>
        </li>
      ))}
    </ul>
  );
};

const Task = ({ task, onEditClick, fetchAllTasks }) => {
  const [loading, setLoading] = React.useState(false);
  const [deleteLoader, setDeleteLoader] = React.useState(false);
  const [adviceLoader, setAdviceLoader] = React.useState(false);
  const [advice, setAdvice] = useState(""); // State for AI advice
  const [showMore, setShowMore] = useState(false); // State for toggling advice view

  useEffect(() => {
    if (task.aiAdvice) {
      setAdvice(task.aiAdvice);
    }
  }, [task]);

  const completeTaskHandler = async (id) => {
    setLoading(true);
    try {
      await markTaskCompleted(id);
      if (fetchAllTasks) fetchAllTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
    setLoading(false);
  };

  const deleteTaskHandler = async (id) => {
    setDeleteLoader(true);
    try {
      await deleteTask(id);
      if (fetchAllTasks) fetchAllTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setDeleteLoader(false);
  };

  const fetchAdviceHandler = async () => {
    setAdviceLoader(true);
    try {
      const response = await getAiAdvice({
        id: task.id,
        title: task.title,
        description: task.description,
        progress: task.progress,
        priority: task.priority,
        deadline: task.deadline,
        completed: task.completed,
      });
      setAdvice(response);
    } catch (error) {
      console.error("Error fetching AI advice:", error);
    }
    setAdviceLoader(false);
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Priority:</strong>{" "}
            {task.priority === "1"
              ? "Low"
              : task.priority === "2"
              ? "Medium"
              : "High"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Progress:</strong> {task.progress}%
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Deadline:</strong> {formatDeadline(task.deadline)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {advice && (
          <Button variant="text" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Hide Advice" : "Show Advice"}
          </Button>
        )}
        <Collapse in={showMore}>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="subtitle1">AI Advice:</Typography>
            {renderAdvicePoints(advice)}
          </Box>
        </Collapse>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant={task.completed ? "outlined" : "contained"}
          color={task.completed ? "secondary" : "primary"}
          onClick={() => completeTaskHandler(task.id)}
          sx={{ mr: 1 }}
          endIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
          disabled={loading}
        >
          {task.completed ? "Undo" : "Complete"}
        </Button>
        <Button
          variant="outlined"
          onClick={fetchAdviceHandler}
          sx={{ mr: 2 }}
          disabled={adviceLoader}
          endIcon={
            adviceLoader ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Get AI Advice
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onEditClick(task.id)}
          sx={{ mr: 1 }}
          disabled={task.completed}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => deleteTaskHandler(task.id)}
          endIcon={
            deleteLoader ? <CircularProgress size={20} color="inherit" /> : null
          }
          disabled={deleteLoader}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default Task;
