// Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ width: "100%", zIndex: 1200 }}>
      <Toolbar>
        {/* Left Section: Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Decentralized To-Do App
          </Typography>
        </Box>

        {/* Right Section: Navigation Links */}
        {/* <Button color="inherit" component={Link} to="/" sx={{ marginRight: 2 }}>
          Dashboard
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/tasks"
          sx={{ marginRight: 2 }}
        >
          Tasks
        </Button>
        <Button color="inherit" component={Link} to="/priority-tasks">
          Priority Tasks
        </Button> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
