const express = require("express");
const {protect, adminOnly} = require("../middlewares/authMiddleware");
const { getDashboardData, getTasks, getUserDashboardData, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getTaskById } = require("../Controllers/taskController");

const router = express.Router();

//Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); //Get all tasks (Admin:all, User:assigned)
router.get("/:id", protect, getTaskById); //Get task by ID
router.post("/",protect,adminOnly,createTask); //Create a task (Admin only)
router.put("/:id", protect, updateTask); //Update task details
router.delete("/:id", protect,adminOnly,deleteTask); //Delete a Task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); //Update task status
router.put("/:id/todo", protect, updateTaskChecklist); //Update task CheckList

module.exports = router;