import React, { use, useDebugValue, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTask = () => {
  
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  
  const navigate = useNavigate();

  const getAlltasks = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
        params: {
          status: filterStatus === "All" ? "" : filterStatus
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks: [])
      //Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};
      console.log(response)
      console.log(statusSummary)
    const statusArray = [
      {label: "All", count: statusSummary.all || 0},
      {label: "Pending", count: statusSummary.pendingTasks || 0},
      {label: "In Progress", count: statusSummary.inProgressTasks || 0 },
      {label: "Completed", count: statusSummary.completedTasks || 0}
    ]; 
    
    setTabs(statusArray);
  
  } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/tasks-details/:id ${taskId}`)
  };

    useEffect(()=> {
      getAlltasks(filterStatus);
      return() => {};
    },[filterStatus]);

console.log(tabs)
console.log(allTasks)

const example = allTasks.map((item) => item.dueDate)
const example1 = allTasks.map((item) => item.completedTodoCount)
console.log(example1)
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className=" my-5">
        <div className=" flex flex-col lg:flex-row lg:items-center justify-between">
            <h2 className="text-xl md:text-xl font-medium ">
              My Tasks
            </h2>


          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
              />  
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item,index) => (
            <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.progress}
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
            attachmentCount={item.attachements?.length || 0}
            completedTodoCount={item.completedCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() => {
              handleClick(item);
            }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTask;