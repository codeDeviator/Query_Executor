
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

interface Approver {
  id: string;
  name: string;
}

const RequesterFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    queryId: uuidv4(),
    requesterName: "",
    createdAt: new Date().toISOString().slice(0, 16),
    query: "",
    queryDescription: "",
    dbName: "",
    approverIds: [] as string[],
  });

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setFormData((prevData) => ({
          ...prevData,
          userId: user?.userId,
          requesterName: user?.name || "Unknown User",
        }));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const response = await fetch("http://localhost:5000/approvers");
        if (!response.ok) throw new Error("Failed to fetch approvers");
        const data: Approver[] = await response.json();
        console.log("Fetched Approvers:", data); // ✅ Debugging line
        setApprovers(data || []);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };
    fetchApprovers();
  }, []);
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log("Checkbox clicked:", { value, checked }); // ✅ Debugging line
  
    setFormData((prevData) => {
      const newApproverIds = checked
        ? [...prevData.approverIds, value]
        : prevData.approverIds.filter((id) => id !== value);
      
      console.log("Updated approverIds:", newApproverIds); // ✅ Debugging line
      return { ...prevData, approverIds: newApproverIds };
    });
  };
  


  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Collect approver names based on selected approverIds
    const selectedApprovers = approvers
      .filter((approver) => formData.approverIds.includes(String(approver.id)))
      .map((approver) => approver.name);
  
    // Ensure requesterId is set properly
    const payload = {
      requesterId: formData.userId,
      dbName: formData.dbName,
      query: formData.query,
      queryDescription: formData.queryDescription,
      approverIds: formData.approverIds,
      approver_name: selectedApprovers.join(", "), // Send approver names as a comma-separated string
    };
  
    console.log("Payload before submission:", payload); // Debugging
  
    if (!payload.requesterId || !payload.dbName || !payload.query || !payload.queryDescription) {
      alert("Please fill in all required fields.");
      return;
    }
  
    if (payload.approverIds.length === 0) {
      alert("Please select at least one approver.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/submit-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send corrected payload
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to submit query");
      }
  
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/requester");
      }, 2000);
    } catch (error) {
      alert("An error occurred while submitting the query. Please try again.");
      console.error("Submission error:", error);
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
          <label className="block text-lg font-semibold">Requester Name</label>
          <input type="text" value={formData.requesterName} readOnly className="block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />

          <label className="block text-lg font-semibold">Created At</label>
<input 
  type="text" 
  value={new Date(formData?.createdAt || Date.now()).toLocaleString()} 
  readOnly 
  className="block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" 
/>


          <label className="block text-lg font-semibold">Query</label>
          <input type="text" value={formData.query} onChange={(e) => setFormData({ ...formData, query: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required />

          <label className="block text-lg font-semibold">Query Description</label>
          <textarea value={formData.queryDescription} onChange={(e) => setFormData({ ...formData, queryDescription: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required></textarea>

          <label className="block text-lg font-semibold">Select Database</label>
          <select value={formData.dbName} onChange={(e) => setFormData({ ...formData, dbName: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
            <option value="">Select Database</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="MongoDB">MongoDB</option>
            <option value="SQL Server">SQL Server</option>
          </select>

          <label className="block text-lg font-semibold">Approvers</label>
          {approvers.length > 0 ? approvers.map((approver) => (
            <label key={approver.id} className="flex items-center space-x-2">
              <input
  type="checkbox"
  value={String(approver.id)} // Convert to string if needed
  checked={formData.approverIds.includes(String(approver.id))}
  onChange={handleCheckboxChange}
/>

              <span className="text-gray-700 text-lg">{approver.name}</span>
            </label>
          )) : <p className="text-gray-500">No approvers available.</p>}

          <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default RequesterFormPage;
