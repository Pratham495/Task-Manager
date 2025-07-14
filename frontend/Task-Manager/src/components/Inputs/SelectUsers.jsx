import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useEffect } from 'react';

const SelectUsers = ({selectedUsers,setSelectedUsers}) => {
    const [allUsers, setAllUsers] = useState([])
    const [isModalOpeb, setIsModalOpen] = useState(false);
    const [tempSelectedUser,setTempSelectedUser] = useState([]);

    const getAllUsers = async () => {
       try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        console.log(response)
        if(response,data?.length > 0)
        {
             setAllUsers(response.data);
        }
       } catch (error) {
        console.error("Error Fetching users:" ,error);
       } 
    }

    const toggleUserSelection = (userId) => {
        setTempSelectedUser ((prev) => {
            prev.includes(userId)
            ? prev.filter((id)=> id !== userId)
            : [...prev, userId]
        })
    }

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUser);
        setIsModalOpen(false);
    }

    const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

    useEffect(()=>{
        getAllUsers();
    },[]);

    useEffect(() => {
        if(selectedUsers.length === 0)
        {
            setTempSelectedUser([]);
        }
    },[selectedUsers])

  return (
    <div>SelectUsers</div>
  )
}

export default SelectUsers