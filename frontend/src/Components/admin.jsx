import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate=useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must log in to view this page");
          return;
        }
      
        try {
          const response = await fetch("http://localhost:5000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const data = await response.json();
          setUsers(data.filter(user => user.role === "user"));
        } catch (err) {
          setError(err.message);
        }
      };
      

    fetchUsers();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">User Management</h1>
      <button onClick={()=>{navigate('/create')}} className="p-2 bg-blue-500 m-2 rounded-md text-white">
        Create Project
      </button>
      <button onClick={()=>{navigate('/dashboard')}} className="p-2 bg-black m-2 rounded-md text-white">
        Back to Projects
      </button>
      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id} className="border-t border-gray-200">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.totalScore}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-3">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
