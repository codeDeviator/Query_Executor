
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const RequesterFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    queryId: uuidv4(),
    requesterName: "",
    createdAt: new Date().toISOString().slice(0, 16), // Correct format
    query: "",
    queryDescription: "",
    dbName: "",
    server: "",
    approverName: "",
  });

  const [queries, setQueries] = useState<any[]>([]); // Will be updated in useEffect
  const [showPopup, setShowPopup] = useState(false);

  // Fetch logged-in user and stored queries
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const savedQueries = localStorage.getItem("queries");

    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prevData) => ({
        ...prevData,
        userId: user.userId || uuidv4(),
        requesterName: user.name || "Unknown User",
      }));
    }

    if (savedQueries) {
      setQueries(JSON.parse(savedQueries));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ignore userId, queryId, and createdAt for validation
    const { userId, queryId, createdAt, ...requiredFields } = formData;

    if (Object.values(requiredFields).every((field) => typeof field === "string" && field.trim() !== "")) {
      const updatedQueries = [...queries, formData];
      setQueries(updatedQueries);
      localStorage.setItem("queries", JSON.stringify(updatedQueries));

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/requester");
      }, 2000);
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-900">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Submit Your Query</h2>

        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold text-green-700">Query Submitted Successfully</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-800">Requester Name</label>
            <input type="text" name="requesterName" value={formData.requesterName} readOnly className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Created At</label>
            <input type="datetime-local" name="createdAt" value={formData.createdAt} readOnly className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Query</label>
            <input type="text" name="query" value={formData.query} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Enter query" required />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Query Description</label>
            <textarea name="queryDescription" value={formData.queryDescription} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Describe your query" required></textarea>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Database Name</label>
            <select name="dbName" value={formData.dbName} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select Database</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
              <option value="MongoDB">MongoDB</option>
              <option value="SQL Server">SQL Server</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Server</label>
            <select name="server" value={formData.server} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select Server</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Google Cloud">Google Cloud</option>
              <option value="On-Premise">On-Premise</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800">Approver Name</label>
            <select name="approverName" value={formData.approverName} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
              <option value="">Select Approver</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Mike Johnson">Mike Johnson</option>
            </select>
          </div>

          <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequesterFormPage;
