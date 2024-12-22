import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.post(
        `http://localhost:5000/api/status/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-200 text-green-800";
      case "in progress":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
   
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-12 px-6 flex">
       
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 mb-10">Your Tasks</h2>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <p className="text-lg text-gray-600">No tasks assigned to you yet.</p>
            <p className="text-gray-500 mt-3">New tasks will appear here when they're assigned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{task.title}</h3>
                    <span
                      className={`px-4 py-2 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-5 line-clamp-3">{task.description}</p>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => updateStatus(task._id, "In Progress")}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(task._id, "Completed")}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Complete
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/project/${task._id}`)}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">
          <h4 className="text-xl font-medium text-gray-800 mb-6">Status Information</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>In Progress:</strong> Task is being worked on. Update this status when you start working.
            </li>
            <li>
              <strong>Completed:</strong> Task is finished. Update this status when the task is done.
            </li>
            <li>
              <strong>According to the Status, Scores are updated:</strong> The task status reflects the progress.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <button onClick={()=>{navigate('/dashboard')}} className="bg-blue-500 p-3 rounded-md text-white" 
        >
          All Tasks
        </button>
      </div>
    </div>
  );
};

export default UserTasks;
