import React from 'react'
import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

const uploadImage = async(imagefile) => {
    const formData = new FormData();
    //Append image file to form data
    formData.append('image', imagefile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
            headers: {
                'Content-Type':'multipart/form-data', //set header for file upload
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default uploadImage