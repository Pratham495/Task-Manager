import React, { useState } from "react";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Inputs from "../../components/Inputs/Inputs";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !adminInviteToken) {
      setError("Please fill in all the required fields.");
      return;
    }

    setError(null);
    console.log({ fullName, email, password, adminInviteToken, profilePic });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-blue-50 p-8 md:w-1/2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Create your profile 🚀
          </h3>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>
        <div className="p-8 md:w-1/2">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Create an Account
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Join us today by entering your details below.
          </p>

          {error && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <Inputs
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Pratham"
              type="text"
            />

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
              placeholder="********"
              type="password"
            />

            <Inputs
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 digit code"
              type="text"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold shadow-sm"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?
            <span
              className="text-blue-600 cursor-pointer font-medium hover:underline ml-1"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
