const Task = require("../models/Task");

const getTasks = async (req, res) =>{
    try{

        const {status} = req.query;
        let filter = {};

        if(status)
        {
            filter.status = status;
        }
        let tasks;
        if(req.user.role === "admin")
        {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }
        else
        {
            tasks = await Task.find({...filter, assignedTo: req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }

        //Ass completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async(task)=>{
                const completedCount = task.todoChecklist.filter(
                    (item)=>item.completed
                ).length;
                return {...task._doc, completedCount: completedCount}
            })
        );

        //status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : {assignedTo: req.user._id}
        );

        const pendingTasks = await Task.countDocuments ({
            ...filter,
            status:"Pending",
            ...(req.user.role !== "admin" && {assignedTo: req.user.id}),
        });

        const isProgressTask = await Task.countDocuments ({
            ...filter,
            status:"In Progress",
             ...(req.user.role !== "admin" && {assignedTo: req.user.id}),
        });

        const completedTasks = await Task.countDocuments ({
            ...filter,
            status:"In Progress",
             ...(req.user.role !== "admin" && {assignedTo: req.user.id}),
        });

        res.json({
            tasks,
            statusSummary:{
                all:allTasks,
                pendingTasks,
                isProgressTask,
                completedTasks
            }
        });
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
}

const getTaskById = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task)
            return res.statusjson({message: "Task not found"});

        res.status(200).json(task)
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }   
};

const createTask = async(req,res)=>{
  try{
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        } = req.body;

        if(!Array.isArray(assignedTo)) {
            return res
            .status(400)
            .json({message: "assignedTo must be an array of user IDs"});
        }
        const task =  await Task.create ({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            attachments,
            todoCheckList,
        });

        res.status(201).json({message: "Task created successfully", task});
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }  
};

const updateTask = async (req,res)=>{
    try{ 

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const deleteTask = async (req,res)=>{
    try{

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const updateTaskStatus = async (req, res)=>{
    try{

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const updateTaskChecklist = async (req, res)=>{
    try{

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const getDashboardData = async(req, res)=>{
    try{

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const getUserDashboardData = async (req, res)=>{
    try{

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};


module.exports= {
   getTasks,
    getTaskById,
   createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
}