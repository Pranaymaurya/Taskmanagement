import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [takenProjects, setTakenProjects] = useState([]);
  const [error, setError] = useState('');
  const [roles, setRole] = useState(''); // Track user role
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchRole(); // Fetch user role
      fetchProjects();
      fetchTakenProjects();
    }
  }, [token, navigate]);

  // Fetch user role
  const fetchRole = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/role', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(response.data.role); // Assuming the backend returns { role: 'Admin' } or similar
    } catch (error) {
      console.error('Error fetching role:', error);
      setError('Failed to fetch user role.');
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Project', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const openProjects = response.data.filter(project => project.status === 'Open');
      setProjects(openProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    }
  };

  // Fetch the projects that the user has taken
  const fetchTakenProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTakenProjects(response.data);
    } catch (error) {
      console.error('Error fetching taken projects:', error);
      setError('You have taken no projects.');
    }
  };

  // Take a project
  const takeProject = async (projectId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/takeProject/${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === 'Project taken successfully') {
        fetchProjects();
        fetchTakenProjects();
      }
    } catch (error) {
      console.error('Error taking project:', error);
      if (error.response?.data?.message === 'You have already taken this project.') {
        setError('You have already taken this project.');
      } else {
        setError('Failed to take the project. Please try again later.');
      }
    }
  };

  // View project details
  const viewProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Available Projects</h2>
          <div className="flex space-x-4">
          {roles !== 'admin' && takenProjects.length > 0 && (
  <button
    onClick={() => navigate('/task')}
    className="px-4 py-2 text-sm text-white hover:text-gray-800 transition-colors bg-blue-500 p-5 rounded-md"
  >
    My Tasks
  </button>
)}

            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Admin-specific section */}
        {roles === 'admin' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            <p>Welcome, Admin! You have access to manage projects and users.</p>
            <button
              onClick={() => navigate('/admin')}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}
        {roles!=='admin'&&(
          <div className="mb-6 p-4 border border-black rounded-lg text-black bg-white">
          <h1>View the tasks you have taken in My Tasks</h1>
        </div>

        )}
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {project.title}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium ${
                        project.status === 'Taken'
                          ? 'text-gray-500 bg-gray-100'
                          : 'text-blue-600 bg-blue-50'
                      } rounded-full`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">{project.description}</p>
                  {project.status === 'Open'&& roles==='user' ? (
                    <button
                      onClick={() => takeProject(project._id)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out"
                    >
                      Take Project
                    </button>
                  ) : (
                    <button
                      onClick={() => viewProject(project._id)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out"
                    >
                      View Project
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg">No open projects available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
