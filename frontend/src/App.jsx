import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import UserTasks from "./Components/Alltask";
import ProjectDetails from "./Components/ProjectDetails";
import AdminUserTable from "./Components/admin";
import CreateProject from "./Components/CreateProject";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home/>} />
          <Route path="/task" element={<UserTasks/>} />
          <Route path="/project/:id" element={<ProjectDetails/>} />
          <Route path="/admin" element={<AdminUserTable/>} />
          <Route path="/create" element={<CreateProject/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
