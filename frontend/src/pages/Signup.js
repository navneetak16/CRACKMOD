import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup", { email, username, password });
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <input type="email" placeholder="Email" className="border p-2 mb-2" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="Username" className="border p-2 mb-2" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 mb-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleSignup}>Sign Up</button>
      <p className="mt-2 text-sm">Already have an account? <a href="/" className="text-blue-600">Login</a></p>
    </div>
  );
};

export default Signup;