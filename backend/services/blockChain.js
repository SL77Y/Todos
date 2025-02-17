import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getProductivityAdvice } from "../ai/ai.js";

dotenv.config();

// ✅ Load contract ABI without assert { type: "json" }
const contractABI = JSON.parse(
  fs.readFileSync(path.resolve("./credentials/TaskContract.json"), "utf8")
);

// ✅ Check if required env variables exist
if (!process.env.RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
  throw new Error("Missing required environment variables! Check .env file.");
}

console.log("Connecting to network...", process.env.RPC_URL);
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI.abi,
  wallet
);

console.log("Connected to network:", process.env.RPC_URL);

// ✅ Format Task Helper
const formatTask = (task) => ({
  id: task.id.toString(),
  title: task.title,
  description: task.description,
  completed: task.completed,
  priority: task.priority.toString(),
  progress: task.progress.toString(),
  owner: task.owner,
  aiAdvice: task.aiAdvice,
  deadline: task.deadline,
});

// ✅ Helper for logging and error handling
const handleError = (error, functionName) => {
  console.error(`Error in ${functionName}:`, error);
  throw error;
};

// ✅ Create Task
export const createTask = async (
  title,
  description,
  priority,
  progress,
  deadline
) => {
  try {
    console.log("Creating task...", title, description, priority, progress, deadline);

    const aiAdvice = await getProductivityAdvice({ title, description, priority, progress, deadline });

    const tx = await contract.createTask(
      title,
      description,
      priority,
      progress,
      aiAdvice,
      deadline
    );

    console.log("Transaction submitted:", tx.hash);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Transaction confirmed:", receipt.transactionHash);
      return receipt;
    } else {
      console.error("Transaction failed:", receipt);
      return { error: "Transaction failed", receipt };
    }
  } catch (error) {
    handleError(error, "createTask");
  }
};

// ✅ Complete Task
export const completeTask = async (id) => {
  try {
    const tx = await contract.completeTask(id);
    console.log("Transaction submitted:", tx.hash);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Transaction confirmed:", receipt.transactionHash);
      return receipt;
    } else {
      console.error("Transaction failed:", receipt);
      return { error: "Transaction failed", receipt };
    }
  } catch (error) {
    handleError(error, "completeTask");
  }
};

// ✅ Get Task
export const getTask = async (id) => {
  try {
    const task = await contract.getTask(id);
    return formatTask(task);
  } catch (error) {
    handleError(error, "getTask");
  }
};

// ✅ Get All Tasks
export const getAllTasks = async () => {
  try {
    const tasks = await contract.getAllTasks();
    return tasks.map(formatTask);
  } catch (error) {
    handleError(error, "getAllTasks");
  }
};

// ✅ Get Task Count
export const getAllTaskCount = async () => {
  try {
    const taskCount = await contract.getTaskCount();
    console.log("Task count:", taskCount.toString());
    return taskCount.toNumber(); // Return as number
  } catch (error) {
    handleError(error, "getAllTaskCount");
  }
};

// ✅ Edit Task
export const editTask = async (
  id,
  title,
  description,
  priority,
  progress,
  aiAdvice,
  deadline
) => {
  try {
    const tx = await contract.editTask(
      id,
      title,
      description,
      priority,
      progress,
      aiAdvice,
      deadline
    );
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Transaction confirmed:", receipt.transactionHash);
      return receipt;
    } else {
      console.error("Transaction failed:", receipt);
      return { error: "Transaction failed", receipt };
    }
  } catch (error) {
    handleError(error, "editTask");
  }
};

// ✅ Delete Task
export const deleteTask = async (id) => {
  try {
    const tx = await contract.deleteTask(id);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Transaction confirmed:", receipt.transactionHash);
      return receipt;
    } else {
      console.error("Transaction failed:", receipt);
      return { error: "Transaction failed", receipt };
    }
  } catch (error) {
    handleError(error, "deleteTask");
  }
};
