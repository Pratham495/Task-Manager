const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name eamil");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Priority", key: "priority", width: 25 },
      { header: "Status", key: "status", width: 25 },
      { header: "Due Date", key: "dueDate", width: 25 },
      { header: "Assigned To", key: "assignedTo", width: 25 },
    ];

    tasks.forEach((tasks) => {
      const assignedTo = tasks.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: Task.dueDate.toISOString().splite("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="task_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting tasks", error: error.message });
  }
};

const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name eamil _id"
    );

    const userTaskmap = {};
    users,
      forEach((user) => {
        userTaskmap[user._id] = {
          name: user.name,
          email: user.email,
          taskCount: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
        };
      });

    userTasks.forEach((tasks) => {
      if (tasks.assignedTo) {
        tasks.assignedTo.forEach((assignedUser) => {
          if (userTaskmap[assignedUser._id]) {
            userTaskmap[assignedUser._id].taskCount += 1;
            if(tasks.status === "Pending")
            {
             userTaskmap[assignedUser._id].pendingTasks += 1;
            }else if(tasks.status === "In Progress")
            {
                userTaskmap[assignedUser._id].inProgressTasks += 1;
            }else if(tasks.status === "Completed")
            {
                userTaskmap[assignedUser._id].completedTasks += 1
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Uaer Task Report");

    worksheet.columns = [
        {header: "User Name", key:"name", width:30},
        {header: "Email", key:"email", width:40},
        {header: "Total Assigned Tasks", key:"taskCount", width:20},
        {header: "Pending Tasks", key:"pendingTasks", width:20},
        {header: "In Progress Tasks", key:"inProgressTasks", width:20},
        {header: "Completed Tasks", key:"completedTasks", width:20},
    ]

    Object.values(userTaskmap).forEach((user)=>{
        worksheet.addRow(user);
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      message: "Error exporting tasks",
      error: error.message,
    });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
