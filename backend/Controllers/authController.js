const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWTtoken

const generateToken = (userId) =>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

const registerUser = async (req, res) =>{
    try
    {
        const {name,email,password, profileImageUrl, adminInviteToken}=req.body;

        //check if user already exists
        const userExists = await User.findOne({email});
        if(userExists)
        {
            return  res.status(400).json({message:"User Already Exists"});
        }
        //determine user role admin if correct token is provided otherwise member
        let role = "member";
        if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN)
        {
            role = "admin";
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        

    }catch (error)
    {
        res.status(500).json({message:"server error" ,error: error.message});
    }
};
const loginUser = async(req, res)=>{
     try
    {
    }catch (error)
    {
        res.status(500).json({message:"server error" ,error: error.message});
    }
};
const getUserProfile = async(req, res)=>{
     try
    {
    }catch (error)
    {
        res.status(500).json({message:"server error" ,error: error.message});
    }
};
const updateUserProfile = async(req, res)=>{
     try
    {
    }catch (error)
    {
        res.status(500).json({message:"server error" ,error: error.message});
    }
};

module.exports = {registerUser,loginUser,getUserProfile,updateUserProfile};
