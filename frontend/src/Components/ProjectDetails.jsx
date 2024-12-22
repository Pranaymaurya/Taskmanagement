import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // To track loading state
  const [role, setRole] = useState(''); // State to hold the user role
  const navigate = useNavigate();

  // Retrieve the token
  const token = localStorage.getItem('token');

  // Handle token validation and role fetching
  useEffect(() => {
    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

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

    fetchRole();
  }, [token]); // Only run when token changes

  // Fetch project details when component is mounted or project id changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      try {
        setLoading(true); // Set loading to true before the API call
        console.log(`Fetching project with ID: ${id}`);

        const response = await axios.get(`http://localhost:5000/api/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        console.log('Project data:', response.data); // Log the data received from the backend

        if (response.data) {
          setProject(response.data); // Set project data if it exists
        } else {
          setError('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to fetch project details. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false once the API call finishes
      }
    };

    fetchProjectDetails();
  }, [id, token]); // Re-fetch if `id` or `token` changes

  // Handle taking the project
  const handleTakeProject = async (projectId) => {
    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/takeProject/${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);

      if (response.data.message === 'Project taken successfully') {
        setProject((prev) => ({ ...prev, status: 'Taken' }));
        setError(''); // Clear the error if project was taken successfully
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

  // Handle back button
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-100 p-4 rounded-lg text-gray-600">
            Loading project details...
          </div>
        </div>
      </div>
    );
  }

  // Show error if there's any issue fetching the project
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Show a fallback message if project data isn't found
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-100 p-4 rounded-lg text-gray-600">
            No project found with ID: {id}
          </div>
        </div>
      </div>
    );
  }

  // Render the project details
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          </div>

          <div className="text-gray-600 mb-4">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="mt-2">{project.description}</p>
          </div>

          <div className="text-gray-600 mb-4">
            <h3 className="text-xl font-semibold">Project Status</h3>
            <p className="mt-2">{project.status}</p>
          </div>

          <div className="text-gray-600 mb-4">
            <h3 className="text-xl font-semibold">Deadline</h3>
            <p className="mt-2">{new Date(project.deadline).toLocaleDateString()}</p>
          </div>

          <div className="text-gray-600 mb-4">
            <h3 className="text-xl font-semibold">Assigned to</h3>
            <ul className="mt-2">
              {project.assignedTo?.length > 0 ? (
                project.assignedTo.map((user, index) => (
                  <li key={index} className="text-gray-500">{user}</li>
                ))
              ) : (
                <li>No one assigned yet</li>
              )}
            </ul>
          </div>

          {project.status === 'Taken' && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Progress</h3>
              <p className="mt-2">Track your progress here (e.g., milestones, updates, etc.)</p>
            </div>
          )}

          {/* Hide the button if the role is admin */}
          {project.status === 'Open' && role !== 'admin' && (
            <div className="mt-6">
              <button
                onClick={() => handleTakeProject(id)} // Handle taking the project
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out"
              >
                Take Project
              </button>
            </div>
          )}

          {role === 'admin' && (
            <div className="mt-6 text-gray-500">
              <p>You are an admin and cannot take projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
