import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-all">
      <Router>
        <nav className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold">CRACKMOD</h1>
          <DarkModeToggle />
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;