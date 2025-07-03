import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Inputs from "../../components/Inputs/Inputs";
import { ValidateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !ValidateEmail(email)) {
      if (!email && !password) {
        setError("Please enter both valid fields.");
        alert('hii')
      } else if (!email || !ValidateEmail(email)) {
        setError("Please enter a valid email address.");
        alert('hello')
      } else if (!password) {
        setError("Please enter a valid password.");
        alert('bye')
      }
      return;
    }

    setError(null);
    console.log({ email, password });


    //login api call
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
      email,
      password,
    });
    console.log(response);
    const {token,role}= response.data;
    if(token)
    {
      localStorage.setItem("token",token);
      updateUser(response.data);

      //Redirect Based on role
      if(role === "admin")
      {
        navigate("/admin/dashboard");
      }
      else
      {
        navigate("/user/dashboard");
      }
    }
  } catch (error) {
    if(error.response && error.response.data.message) {
      setError(error.response.data.message);
    }
    else
    {
      setError("Something went wrong. Please try again");
    }
  }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Please enter your details to log in
        </p>

        {error && (
          <div className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Inputs
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="pratham@example.com"
            type="email"
          />

          <Inputs
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="1232"
            type="password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold shadow-sm"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline ml-1"
            onClick={() => navigate("/signUp")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
