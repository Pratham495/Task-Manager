import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../layouts/Modal';
import { LuUser, LuTrash } from 'react-icons/lu';
import AvatarGroup from '../layouts/AvatarGroup';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Fetch users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Sync with main selectedUsers
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Selected Avatars
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => ({ id: user._id, url: user.profileImageUrl }));

    console.log(selectedUserAvatars)
    console.log(selectedUsers)
  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {selectedUserAvatars.map((user) => (
          <div key={user.id} className="relative group">
            <img
              src={user.url}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <button
              onClick={() => setSelectedUsers((prev) => prev.filter((id) => id !== user.id))}
              className="absolute -top-1 -right-1 bg-white border border-gray-300 rounded-full p-0.5 hidden group-hover:block"
            >
              <LuTrash className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      <button
        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition"
        onClick={() => {
          setIsModalOpen(true);
          setTempSelectedUsers(selectedUsers);
        }}
      >
        <LuUser className="w-4 h-4" />
        Add Members
      </button>


      {selectedUserAvatars.length > 0 && (
        <div className=" cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3}/>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md transition"
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={handleAssign}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Assign Selected
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
