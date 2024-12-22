import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your token retrieval logic if authentication is required
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add if your API requires authentication
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const data = await response.json();
      setMessage(data.message);
      setError("");
      setFormData({ title: "", description: "", deadline: "" }); // Reset the form
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto p-5 max-w-md">
        
      <h1 className="text-2xl font-bold text-center mb-5">Create a New Project</h1>
      {message && <div className="text-green-500 text-center mb-4">{message}</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 justify-center items-center">
        <div>
          <label htmlFor="title" className="block font-medium">
            Project Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block font-medium">
            Deadline<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Project
        </button>
        <button onClick={()=>{navigate('/admin')}} className="p-2 bg-black m-2 rounded-md text-white">
        Back to Admin Dashboard
      </button>
      <button onClick={()=>{navigate('/dashboard')}} className="p-2 bg-black m-2 rounded-md text-white">
        Back to Projects
      </button>
      </form>
    </div>
  );
};

export default CreateProject;
