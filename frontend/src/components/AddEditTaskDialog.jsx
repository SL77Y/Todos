import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { createTask, editTask, getTask } from "../utility/utils";

const AddEditTaskDialog = ({ open, onClose, taskId, onTaskUpdated }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "1", // Added priority field
    progress: 0, // Added progress field
    deadline: "", // Added deadline field
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTask = async () => {
    if (taskId) {
      try {
        const response = await getTask(taskId);
        setTask({
          title: response.title,
          description: response.description,
          priority: response.priority || "1", // Default to empty string if not provided
          progress: response.progress || 0, // Default to 0 if not provided
          deadline: response.deadline || "", // Default to empty string if not provided
        });
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTask();
    } else {
      setTask({
        title: "",
        description: "",
        priority: "1",
        progress: 0,
        deadline: "",
      });
    }
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]:
        name === "progress" ? Math.min(Math.max(Number(value), 0), 100) : value, // Clamp progress between 0 and 100
    }));
  };

  const handleSubmit = async () => {
    if (task.title.trim() === "") {
      setErrorMessage("Task title is required.");
      return;
    }

    setLoading(true);

    try {
      if (taskId) {
        const response = await editTask({
          taskId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          progress: task.progress,
          deadline: task.deadline,
        });
        onTaskUpdated(response.data);
        setSuccessMessage("Task updated successfully!");
      } else {
        const response = await createTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          progress: task.progress,
          deadline: task.deadline,
        });
        onTaskUpdated(response.data);
        setSuccessMessage("Task added successfully!");
      }
      onClose();
    } catch (error) {
      setErrorMessage("Failed to save the task. Please try again.");
      console.error("Error saving task:", error);
    }

    setLoading(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ paddingLeft: "40px", paddingTop: "20px" }}>
          {taskId ? "Edit Task" : "Add Task"}
        </DialogTitle>
        <DialogContent sx={{ padding: "40px", paddingTop: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={task.title}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline // Makes the TextField a TextArea
                rows={4} // Number of rows in the TextArea
                label="Description"
                name="description"
                value={task.description}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Priority"
                name="priority"
                value={task.priority}
                onChange={handleInputChange}
                disabled={loading}
              >
                <MenuItem value="1">Low</MenuItem>
                <MenuItem value="2">Medium</MenuItem>
                <MenuItem value="3">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Progress (%)"
                name="progress"
                type="number"
                value={task.progress}
                onChange={handleInputChange}
                disabled={loading}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="datetime-local"
                value={task.deadline}
                onChange={handleInputChange}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "30px", paddingRight: "40px" }}>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
            endIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {taskId ? "Save Changes" : "Add Task"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditTaskDialog;
