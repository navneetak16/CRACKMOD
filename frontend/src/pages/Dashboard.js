import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    if (storedRole === "admin") {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUsers(res.data)).catch(console.error);
    }
  }, []);

  return (
    <motion.div className="min-h-screen p-6 dark:bg-gray-900 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-4">Welcome to CrackMod Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-gray-200 p-4 rounded">General</button>
        {role === "vip" && <button className="bg-yellow-300 p-4 rounded">VIP Zone</button>}
        {role === "admin" && (
          <>
            <button className="bg-red-400 p-4 rounded">Admin Panel</button>
            <div className="col-span-2 mt-4">
              <h2 className="text-xl font-semibold mb-2">All Users:</h2>
              <ul className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
                {users.map(u => (
                  <li key={u._id} className="mb-1">{u.username} - {u.role}</li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;