// app.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./components/TaskList";
import AddEditTaskDialog from "./components/AddEditTaskDialog";
import { getAllTasks, getPrioritizedTasks } from "./utility/utils";
import { requestNotificationPermission } from "./utility/notification";
import Header from "./components/Header";
import DashboardComponent from "./components/DashboardComponent";
import { renderAdvicePoints } from "./components/Task";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Fetch all tasks from the backend
  const fetchAllTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    requestNotificationPermission();
  }, []);

  const handleEditClick = (id) => {
    setEditingTaskId(id); // Set taskId to be edited
    setOpenDialog(true); // Open the dialog to edit the task
  };

  // Sidebar navigation items
  const drawer = (
    <div>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/tasks">
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button component={Link} to="/priority-tasks">
          <ListItemText primary="Check Priority Tasks" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <Router>
      <Box sx={{ width: "100%", display: "flex" }}>
        {/* Header */}
        <Header />

        {/* Sidebar */}
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              marginTop: "64px", // Move the sidebar down after the header
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginTop: "64px", // Move content below the header
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} />} />
            <Route
              path="/tasks"
              element={
                <Tasks
                  tasks={tasks}
                  onEditClick={handleEditClick}
                  setOpenDialog={setOpenDialog}
                  fetchAllTasks={fetchAllTasks}
                />
              }
            />
            <Route
              path="/priority-tasks"
              element={<PriorityTasks tasks={tasks} />}
            />
          </Routes>

          {/* Add/Edit Task Dialog */}
          <AddEditTaskDialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              setEditingTaskId(null); // Reset editing task ID
            }}
            taskId={editingTaskId}
            onTaskUpdated={fetchAllTasks} // Refresh tasks after add/edit
          />
        </Box>
      </Box>
    </Router>
  );
};

// Dashboard Component
const Dashboard = ({ tasks }) => {
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      <DashboardComponent tasks={tasks} />
    </div>
  );
};

// Tasks Component
const Tasks = ({ tasks, onEditClick, setOpenDialog, fetchAllTasks }) => {
  return (
    <Container sx={{ width: "100%" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tasks
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        {/* Add Task Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
        >
          Add Task
        </Button>
      </Box>

      <Box sx={{ width: "100%" }}>
        {/* Task List */}
        <TaskList
          tasks={tasks}
          onEditClick={onEditClick}
          fetchAllTasks={fetchAllTasks}
        />
      </Box>
    </Container>
  );
};

// Priority Tasks Component
const PriorityTasks = ({ tasks }) => {
  const [loading, setLoading] = useState(false);
  const [proritizedTasks, setProritizedTasks] = useState("");

  async function checkPriority() {
    try {
      setLoading(true);

      const response = await getPrioritizedTasks({ tasks });
      setProritizedTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkPriority();
  }, [tasks]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Priority Tasks
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={30} sx={{ mr: 2 }} />
          <Typography variant="body1" align="center">
            Please wait while we check the priority tasks...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2, pl: 2 }}>
          <Typography variant="subtitle1">Suggestions:</Typography>
          {renderAdvicePoints(proritizedTasks)}
        </Box>
      )}
    </Container>
  );
};

export default App;
