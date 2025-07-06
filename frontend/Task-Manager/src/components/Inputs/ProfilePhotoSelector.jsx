import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      console.log(preview)
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  setImage(null);
  setPreviewUrl(null);
  if (inputRef.current) {
    inputRef.current.value = '';
  }
};

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          className="w-24 h-24 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer transition-transform hover:scale-105"
          onClick={onChooseFile}
        >
          <LuUser className="text-4xl text-blue-600" />
          <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full absolute -bottom-1 -right-1 shadow hover:bg-blue-700 transition-colors">
            <LuUpload className="text-sm" />
          </div>
        </div>
      ) : (
        <div className="relative w-24 h-24">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-2 border-blue-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 shadow hover:bg-red-600 transition-colors"
          >
            <LuTrash className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
