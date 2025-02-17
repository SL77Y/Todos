// auth.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import App from "./App";
import { checkAuthentication, connectWallet } from "./utility/auth";

const Auth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const authenticateUser = async () => {
    try {
      await checkAuthentication();
      setAuthenticated(true); // Token is valid, proceed with the app
    } catch (err) {
      setAuthenticated(false);
      setError("Authentication failed. Please connect your MetaMask wallet.");
    }
  };
  useEffect(() => {
    authenticateUser();
  }, []);

  async function connectWalletHandler() {
    const result = await connectWallet();
    if (result) {
      authenticateUser();
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      {authenticated ? (
        <App />
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={connectWalletHandler}
            >
              Connect MetaMask
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Auth;
