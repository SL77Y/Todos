import { Router } from "express";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";


const authRoutes = Router();

// JWT Secret (store it in .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your-secure-secret";

// Route for user authentication and JWT generation
authRoutes.post("/verify-signature", async (req, res) => {
  const { address, message, signature } = req.body;

  try {
    // Recover address from the signature
    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() === address.toLowerCase()) {
      // Generate a JWT
      const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: "1h" });

      res.json({
        success: true,
        message: "Authentication successful!",
        token, // Send the token to the client
      });
    } else {
      res.status(401).json({ success: false, message: "Authentication failed." });
    }
  } catch (error) {
    console.error("Error verifying signature:", error);
    res.status(500).json({ success: false, message: "Error verifying signature." });
  }
});

export default authRoutes;
