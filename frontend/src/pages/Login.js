import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl mb-4">Login</h1>
      <input type="text" placeholder="Username" className="border p-2 mb-2" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 mb-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleLogin}>Login</button>
      <p className="mt-2 text-sm">Don't have an account? <a href="/signup" className="text-blue-600">Sign up</a></p>
    </div>
  );
};

export default Login;