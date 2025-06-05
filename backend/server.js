require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
// const { default: authRoutes } = require("./routes/authRoutes");
// const { default: userRoutes } = require("./routes/userRoutes");
// const { default: taskRoutes } = require("./routes/taskRoutes");
// const { default: reportRoutes } = require("./routes/reportRoutes");

const app = express();

//middleware to handle cors

app.use(
    cors({
        origin:process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
    })
);

//middleware
app.use(express.json());

// //Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/tasks", taskRoutes)
// app.use("/api/reports", reportRoutes)

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
