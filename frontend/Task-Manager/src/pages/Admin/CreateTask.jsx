import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation,useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import { useState } from 'react';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import axios from 'axios';


const CreateTask = () => {

  const location = useLocation();
  const {taskId} = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[]
  })
  const [currentTask, setCurrentTask] = useState(null);
  const[error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const[openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key,value) => {
    setTaskData((prevdata) => ({
      ...prevdata, [key]: value
    }))
  };

   const clearData = () => {
      setTaskData({
            title:"",
    description:"",
    priority:"Low",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[]
      })
    }

  console.log(taskData)
  //create task
  const CreateTask = async () =>{
    setLoading(true);

    try {
      const todoList =  taskData.todoChecklist?.map((item) => ({
        text:item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });
      toast.success("Task Created Successfully");
      clearData();
    } catch (error) {
      console.error("Error Creating task:", error);
      setLoading(false);
    }finally
    {
      setLoading(false);
    }

  };

  //update task
   const updateTask = async () =>{};

    const handleSubmit = async () => { 
      setError(null);

      //Input validation
      if(!taskData.title.trim())
      {
        setError('Title is Required.')
        return;
      }
       if(!taskData.description.trim())
      {
        setError('Description is Required.')
        return;
      }
       if(!taskData.dueDate)
      {
        setError('Due date is Required.')
        return;
      }
       if(taskData.assignedTo?.length === 0)
      {
        setError('Task not assogined to any member.')
        return;
      }
       if(taskData.todoChecklist?.length === 0)
      {
        setError('Add atlease one todo task')
        return;
      }

      if(taskId)
      {
        updateTask();
        return;
      }
      CreateTask(); 
    };

    //const Task info by ID
    const getTaskDetailsByID = async () => {};

    //Delete Task
    const deleteTask = async () => {};
  return (
    <DashboardLayout activeMenu="Create Task">
<div className="mt-6">
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8 border border-slate-100">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-800">
        {taskId ? "Update Task" : "Create Task"}
      </h2>
      {taskId && (
        <button
          onClick={() => setOpenDeleteAlert(true)}
          className="flex items-center gap-1.5 text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition"
        >
          <LuTrash2 className="text-base" />
          Delete
        </button>
      )}
    </div>

    {/* Task Title */}
    <div className="mt-6">
      <label className="text-xs font-medium text-slate-600 mb-1 block">
        Task Title
      </label>
      <input
        type="text"
        placeholder="Create App UI"
        className="form-input w-full"
        value={taskData.title}
        onChange={({ target }) => handleValueChange("title", target.value)}
      />
    </div>

    {/* Description */}
    <div className="mt-5">
      <label className="text-xs font-medium text-slate-600 mb-1 block">
        Description
      </label>
      <textarea
        rows={4}
        placeholder="Describe Task"
        className="form-input w-full"
        value={taskData.description}
        onChange={({ target }) => handleValueChange("description", target.value)}
      />
    </div>

    {/* Priority & Due Date */}
    <div className="mt-5 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <label className="text-xs font-medium text-slate-600 mb-1 block">
          Priority
        </label>
        <SelectDropdown
          options={PRIORITY_DATA}
          value={taskData.priority}
          onChange={(value) => handleValueChange("priority", value)}
          placeholder="Select Priority"
        />
      </div>

      <div className="w-full md:w-1/2">
        <label className="text-xs font-medium text-slate-600 mb-1 block">
          Due Date
        </label>
        <input
          type="date"
          className="form-input w-full"
          value={taskData.dueDate}
          onChange={({ target }) => handleValueChange("dueDate", target.value)}
        />
      </div>
    </div>

    {/* Assigned Users */}
    <div className="mt-5">
      <label className="text-xs font-medium text-slate-600 mb-1 block">
        Assign To
      </label>
      <SelectUsers
        selectedUsers={taskData.assignedTo}
        setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
      />
    </div>

    {/* Checklist */}
    <div className="mt-5">
      <label className="text-xs font-medium text-slate-600 mb-1 block">
        TODO CheckList
      </label>
      <TodoListInput
        todoList={taskData?.todoChecklist}
        setTodoList={(value) => handleValueChange("todoChecklist", value)}
      />
    </div>

    <div className="mt-3">
      <label className="text-xs font-medium text-slate-600">
        Add Attachments
      </label>

      <AddAttachmentsInput
      attachments={taskData?.attachments}
      setAttachments={(value)=>
        handleValueChange("attachments", value)
      }
      
      />
    </div>

    {error && (
      <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
    )}

    <div className="flex justify-end mt-7">
      <button 
      className="add-btn"
      onClick={handleSubmit}
      disabled={loading}
      >
        {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
      </button>
    </div>
  </div>
</div>


    </DashboardLayout>

  )
}

export default CreateTask