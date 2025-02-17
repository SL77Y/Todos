// utility/utils.js

import { verifySignature } from "./utils";

export const isTokenExpired = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decodedToken.exp < currentTime; // Check if the token is expired
};

const verifySignatureHandler = async (userAddress, message, signature) => {
  try {
    const response = await verifySignature({
      userAddress,
      message,
      signature,
    });
    await localStorage.setItem("token", response); // Store the token in local storage
    return response;
  } catch (err) {
    console.error("Error verifying signature:", err);
  }
};

const signMessage = async (userAddress) => {
  if (window.ethereum) {
    try {
      const message = `Please sign this message to authenticate: ${new Date().toISOString()}`;
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, userAddress],
      });
      console.log("Signed message:", signature);
      return await verifySignatureHandler(userAddress, message, signature); // Send this message and signature to the backend for verification
    } catch (err) {
      console.error("Error signing message:", err);
    }
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts", // Request the user to connect
      });
      const userAddress = accounts[0]; // Get the first account (the active account in MetaMask)
      return await signMessage(userAddress);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      console.log("Please connect your MetaMask wallet.");
    }
  } else {
    console.log("Please install MetaMask.");
  }
};

export const checkAuthentication = async () => {
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    return true; // Token is valid, user is authenticated
  } else {
    throw new Error("Authentication failed");
  }
};
