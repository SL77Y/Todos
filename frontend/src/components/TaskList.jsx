import React from "react";
import { Box } from "@mui/material";
import Task from "./Task";

const TaskList = ({ tasks, fetchAllTasks, onEditClick }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {tasks?.map((task) => (
        <Task
          key={task.id}
          task={task}
          fetchAllTasks={fetchAllTasks}
          onEditClick={onEditClick}
        />
      ))}
    </Box>
  );
};

export default TaskList;
