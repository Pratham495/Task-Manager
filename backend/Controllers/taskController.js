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

        const task = await Task.findById(req.params.id);
        console.log(task)
        if(!task) return res.status(404).json({message:"Task not found"});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachements = req.body.attachements || task.attachements;

        if(!req.body.assignedTo)
        {
            if(!Array.isArray(req.body.assignedTo))
            {
                return res
                .status(400)
                .json({message: "AssignedTo must be an array of user IDs"});
            }
            task.assignedTo = req.body.assignedTo;
        }
        const updateTask = await task.save();
        res.json({message: "Task updated Successfully", updateTask});

    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const deleteTask = async (req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "Task Not Found"});

        await task.deletOne();
        res.json({message: "Task Deleted Successfully"});
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const updateTaskStatus = async (req, res)=>{
    try{
       const task = await Task.findById(req.params.id);
       if(!task) return res.status(404).json({message: "Task not found"});

       const isAssigned = task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
       );

       if(!isAssigned && req.user.role !== "admin")
        {
            return res.status(403).json({message: "Not authorized"});
        }

        task.status = req.body.status || task.status;

        if(task.status === "Completed")
        {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }
        await task.save();
        res.json({message: "Task status updated", task});
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const updateTaskChecklist = async (req, res)=>{
    try{
        const {todoCheckList} = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message: "Task not found"});

        if(!task.assignedTo.includes(req.user.id) && req.user.role !== "admin")
        {
           return res.status(403).json({message: "Not authorized to update checklist"}); 
        }
        task.todoChecklist = todoCheckList //replace with updated checklist

        //Auto-update progress based on checklist completion
        const completedCount = task.todoChecklist.filter((item)=> item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round
        ((completedCount / totalItems) * 100):0;

        //Auto-mark task as completed if all items are checked

        if(task.progress === 100)
        {
            task.status = "Completed";
        }
        else if(task.progress > 0)
        {
            task.status = "In Progress";
        }
        else
        {
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.json({message: "Task checklist updated", task:updateTask});
    }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const getDashboardData = async(req, res)=>{
    try{
        //Fetch statstics
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status: "Pending"});
        const completedTasks = await Task.countDocuments({status:"Completed"});
        const overdueTasks = await Task.countDocuments({
            status: {$ne: "Completed"},
            dueDate: {$lt: newDate()},
        });

        //Ensure all possible statuses are included
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum:1},
                }
            }
        ]);
        const taskDistribution = taskStatuses.reduce ((acc, status)=>{
            const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
            acc[formattedKey] = taskDistributionRaw.find((item) => item._ud === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

        //Ensure all priority levels are included
        const taskPriorities = ["Low","Medium","High"];
        const taskPriorityLevelRaw = await Task.aggregate
        ({
            $group: {
                _id: "$priority",
                count: {$sum: 1},
            }
        });
        const taskPriorityLevels = taskPriorities.reduce ((acc, priority) =>{
            acc[priority]=
            taskPriorityLevelRaw.find((item)=>item._id === priority)?.count ||0;
            return acc; 
        },{});

        //Fetch recent 10 tasks
        const recentTask = await Task.find()
        .sort({createdAt: -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTask,
        })
     }
    catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

const getUserDashboardData = async (req, res)=>{
    try{
        const userId = req.user._id // only fetcb data for the logged in user

        //fetch statistics for user-specific tasks

        const totalTasks = await Task.countDocuments({assignedTo: userId});
        const pendingTasks = await Task.countDocuments({assignedTo: userId, status: "Pending"});
        const completedTasks = await Task.countDocuments({assignedTo: userId, status: "Completed"});
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: {$ne: "Completed"},
            dueDate:{$lt: new Date()},
        });

        //Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {$match: {assignedTo: userId}},
            {$group: {_id: "$staus", count :{$sum: 1}}},
        ])
        
        const taskDistribution = taskStatuses.reduce ((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,"");
            acc[formattedKey] = 
            taskDistributionRaw.find((item)=>item._id === status)?.count
            || 0;
            return acc;
        },{});
        taskDistribution["All"] =totalTasks;

        //Task distribution by priority
        const taskPriorities = ["Low", "Medium","High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            {$match: {assignedTo: userId}},
            {$group: {_id: "$priority", count: {$sum: 1}}},
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPriorityLevelRaw.find((item)=>item._id === priority)?.
            count ||0;
            return acc;
        },{})

        //Fetch recent  tasks for logged-in user
        const recentTask = await Task.find({assignedTo: userId})
        .sort({createdAt: -1})
        .limit(10)
        .select("title status priority dueData createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTask,
        })
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