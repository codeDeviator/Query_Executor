
// import React, { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";

// const RequesterFormPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     userId: "",
//     queryId: uuidv4(),
//     requesterName: "",
//     createdAt: new Date().toISOString().slice(0, 16), // Correct format
//     query: "",
//     queryDescription: "",
//     dbName: "",
//     server: "",
//     approverName: "",
//   });

//   const [queries, setQueries] = useState<any[]>([]); // Will be updated in useEffect
//   const [showPopup, setShowPopup] = useState(false);

//   // Fetch logged-in user and stored queries
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     const savedQueries = localStorage.getItem("queries");

//     if (userData) {
//       const user = JSON.parse(userData);
//       setFormData((prevData) => ({
//         ...prevData,
//         userId: user.userId || uuidv4(),
//         requesterName: user.name || "Unknown User",
//       }));
//     }

//     if (savedQueries) {
//       setQueries(JSON.parse(savedQueries));
//     }
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Ignore userId, queryId, and createdAt for validation
//     const { userId, queryId, createdAt, ...requiredFields } = formData;

//     if (Object.values(requiredFields).every((field) => typeof field === "string" && field.trim() !== "")) {
//       const updatedQueries = [...queries, formData];
//       setQueries(updatedQueries);
//       localStorage.setItem("queries", JSON.stringify(updatedQueries));

//       setShowPopup(true);

//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/requester");
//       }, 2000);
//     } else {
//       alert("Please fill all required fields.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-900">
//       <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-3xl">
//         <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Submit Your Query</h2>

//         {showPopup && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <p className="text-lg font-semibold text-green-700">Query Submitted Successfully</p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-lg font-medium text-gray-800">Requester Name</label>
//             <input type="text" name="requesterName" value={formData.requesterName} readOnly className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Created At</label>
//             <input type="datetime-local" name="createdAt" value={formData.createdAt} readOnly className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Query</label>
//             <input type="text" name="query" value={formData.query} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Enter query" required />
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Query Description</label>
//             <textarea name="queryDescription" value={formData.queryDescription} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Describe your query" required></textarea>
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Database Name</label>
//             <select name="dbName" value={formData.dbName} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
//               <option value="">Select Database</option>
//               <option value="PostgreSQL">PostgreSQL</option>
//               <option value="MySQL">MySQL</option>
//               <option value="MongoDB">MongoDB</option>
//               <option value="SQL Server">SQL Server</option>
//             </select>
//           </div>

         

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Approver Name</label>
//             <select name="approverName" value={formData.approverName} onChange={handleChange} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
//               <option value="">Select Approver</option>
//               <option value="John Doe">John Doe</option>
//               <option value="Jane Smith">Jane Smith</option>
//               <option value="Mike Johnson">Mike Johnson</option>
//             </select>
//           </div>

//           <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">
//             Submit Request
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequesterFormPage;

// import React, { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";

// const RequesterFormPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     userId: "",  // Corrected
//     queryId: uuidv4(),
//     requesterName: "",
//     createdAt: new Date().toLocaleString("en-GB").replace(",", ""), // Correct format
//     query: "",
//     queryDescription: "",
//     dbName: "",
//     approverNames: [] as string[], // Store selected approvers
//   });

//   const [queries, setQueries] = useState<any[]>([]);
//   const [showPopup, setShowPopup] = useState(false);

//   // ✅ Fetch user data from localStorage
//   // useEffect(() => {
//   //   const userData = localStorage.getItem("user");
//   //   const savedQueries = localStorage.getItem("queries");

//   //   if (userData) {
//   //     const user = JSON.parse(userData);
//   //     console.log("🔍 Retrieved user from localStorage:", user); // Debugging

//   //     setFormData((prevData) => ({
//   //       ...prevData,
//   //       userId: user.id || "", // Corrected: Ensure we're using `id`
//   //       requesterName: user.name || "Unknown User",
//   //     }));
//   //   }

//   //   if (savedQueries) {
//   //     setQueries(JSON.parse(savedQueries));
//   //   }
//   // }, []);


//   useEffect(() => {
//   const userData = localStorage.getItem("user");

//   if (userData) {
//     const user = JSON.parse(userData);
//     console.log("🔍 Retrieved user from localStorage:", user); // Debugging

//     setFormData((prevData) => ({
//       ...prevData,
//       userId: user.userId || "", // ✅ Fix: Ensure we use `userId` correctly
//       requesterName: user.name || "Unknown User",
//     }));
//   }
// }, []);


//   // ✅ Handle Checkbox for Approvers
//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       approverNames: checked
//         ? [...prevData.approverNames, value] // Add if checked
//         : prevData.approverNames.filter((name) => name !== value), // Remove if unchecked
//     }));
//   };

//   // ✅ Handle Form Submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.dbName || !formData.query || !formData.queryDescription) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     if (formData.approverNames.length === 0) {
//       alert("Please select at least one approver.");
//       return;
//     }

//     const requestData = {
//       requesterId: formData.userId,  
//       requesterName: formData.requesterName,
//       dbName: formData.dbName,
//       query: formData.query,
//       queryDescription: formData.queryDescription,
//       approverNames: formData.approverNames,
//       createdAt: formData.createdAt,
//     };

//     try {
//       console.log("🔍 Sending request data:", requestData);

//       const response = await fetch("http://localhost:5000/submit-query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         console.error("❌ Server error response:", responseData);
//         alert(`Error: ${responseData.error || "Failed to submit query"}`);
//         return;
//       }

//       console.log("✅ Query submitted successfully:", responseData);

//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/requester");
//       }, 2000);
//     } catch (error) {
//       console.error("❌ Error submitting query:", error);
//       alert("An error occurred while submitting the query. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-900">
//       <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-3xl">
//         <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Submit Your Query</h2>

//         {showPopup && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <p className="text-lg font-semibold text-green-700">Query Submitted Successfully</p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-lg font-medium text-gray-800">Requester Name</label>
//             <input type="text" name="requesterName" value={formData.requesterName} readOnly className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />
//           </div>

//           <div>
//   <label className="block text-lg font-medium text-gray-800">Created At</label>
//   <input 
//     type="datetime-local" 
//     name="createdAt" 
//     value={new Date().toLocaleString("sv-SE").replace(" ", "T").slice(0, 16)} // ✅ Local time fix
//     readOnly 
//     className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" 
//   />
// </div>



//           <div>
//             <label className="block text-lg font-medium text-gray-800">Query</label>
//             <input type="text" name="query" value={formData.query} onChange={(e) => setFormData({ ...formData, query: e.target.value })} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Enter query" required />
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Query Description</label>
//             <textarea name="queryDescription" value={formData.queryDescription} onChange={(e) => setFormData({ ...formData, queryDescription: e.target.value })} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" placeholder="Describe your query" required></textarea>
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Database Name</label>
//             <select name="dbName" value={formData.dbName} onChange={(e) => setFormData({ ...formData, dbName: e.target.value })} className="mt-2 block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
//               <option value="">Select Database</option>
//               <option value="PostgreSQL">PostgreSQL</option>
//               <option value="MySQL">MySQL</option>
//               <option value="MongoDB">MongoDB</option>
//               <option value="SQL Server">SQL Server</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-800">Approver Name</label>
//             <div className="mt-2 flex flex-col space-y-2">
//               {["Priya Verma", "Vikram Singh"].map((name) => (
//                 <label key={name} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     value={name}
//                     checked={formData.approverNames.includes(name)}
//                     onChange={handleCheckboxChange}
//                     className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <span className="text-gray-700 text-lg">{name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">
//             Submit Request
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequesterFormPage;


// import React, { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";

// interface Approver {
//   id: string;
//   name: string;
// }

// const RequesterFormPage: React.FC = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     userId: "",
//     queryId: uuidv4(),
//     requesterName: "",
//     createdAt: new Date().toISOString().slice(0, 16),
//     query: "",
//     queryDescription: "",
//     dbName: "",
//     approverIds: [] as string[],
//   });

//   const [approvers, setApprovers] = useState<Approver[]>([]);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         setFormData((prevData) => ({
//           ...prevData,
//           userId: user?.userId || "",
//           requesterName: user?.name || "Unknown User",
//         }));
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchApprovers = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/approvers");
//         if (!response.ok) throw new Error("Failed to fetch approvers");
//         const data: Approver[] = await response.json();
//         console.log("Fetched Approvers:", data); // ✅ Debugging line
//         setApprovers(data || []);
//       } catch (error) {
//         console.error("Error fetching approvers:", error);
//       }
//     };
//     fetchApprovers();
//   }, []);
  

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     console.log("Checkbox clicked:", { value, checked }); // ✅ Debugging line
  
//     setFormData((prevData) => {
//       const newApproverIds = checked
//         ? [...prevData.approverIds, value]
//         : prevData.approverIds.filter((id) => id !== value);
      
//       console.log("Updated approverIds:", newApproverIds); // ✅ Debugging line
//       return { ...prevData, approverIds: newApproverIds };
//     });
//   };
  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     // Ensure requesterId is set properly
//     const payload = {
//       requesterId: formData.userId, // ✅ Rename userId to requesterId
//       dbName: formData.dbName,
//       query: formData.query,
//       queryDescription: formData.queryDescription,
//       approverIds: formData.approverIds,
//     };
  
//     console.log("Payload before submission:", payload); // Debugging
  
//     if (!payload.requesterId || !payload.dbName || !payload.query || !payload.queryDescription) {
//       alert("Please fill in all required fields.");
//       return;
//     }
  
//     if (payload.approverIds.length === 0) {
//       alert("Please select at least one approver.");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5000/submit-query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload), // Send corrected payload
//       });
  
//       if (!response.ok) {
//         const responseData = await response.json();
//         throw new Error(responseData.error || "Failed to submit query");
//       }
  
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/requester");
//       }, 2000);
//     } catch (error) {
//       alert("An error occurred while submitting the query. Please try again.");
//       console.error("Submission error:", error);
//     }
//   };
  
  


//   return (
//     <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-900">
//       <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-3xl">
//         <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Submit Your Query</h2>

//         {showPopup && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <p className="text-lg font-semibold text-green-700">Query Submitted Successfully</p>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <label className="block text-lg font-semibold">Requester Name</label>
//           <input type="text" value={formData.requesterName} readOnly className="block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />

//           <label className="block text-lg font-semibold">Created At</label>
//           <input type="datetime-local" value={formData.createdAt} readOnly className="block w-full px-6 py-3 border border-gray-300 rounded-lg bg-gray-100" />

//           <label className="block text-lg font-semibold">Query</label>
//           <input type="text" value={formData.query} onChange={(e) => setFormData({ ...formData, query: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required />

//           <label className="block text-lg font-semibold">Query Description</label>
//           <textarea value={formData.queryDescription} onChange={(e) => setFormData({ ...formData, queryDescription: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required></textarea>

//           <label className="block text-lg font-semibold">Select Database</label>
//           <select value={formData.dbName} onChange={(e) => setFormData({ ...formData, dbName: e.target.value })} className="block w-full px-6 py-3 border border-gray-300 rounded-lg" required>
//             <option value="">Select Database</option>
//             <option value="PostgreSQL">PostgreSQL</option>
//             <option value="MySQL">MySQL</option>
//             <option value="MongoDB">MongoDB</option>
//             <option value="SQL Server">SQL Server</option>
//           </select>

//           <label className="block text-lg font-semibold">Approvers</label>
//           {approvers.length > 0 ? approvers.map((approver) => (
//             <label key={approver.id} className="flex items-center space-x-2">
//               <input
//   type="checkbox"
//   value={String(approver.id)} // Convert to string if needed
//   checked={formData.approverIds.includes(String(approver.id))}
//   onChange={handleCheckboxChange}
// />

//               <span className="text-gray-700 text-lg">{approver.name}</span>
//             </label>
//           )) : <p className="text-gray-500">No approvers available.</p>}

//           <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out">Submit Request</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequesterFormPage;



import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

interface Approver {
  id: string;
  name: string;
}

const getISTDateTime = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 330); // Convert to IST (UTC+5:30)
  return date.toISOString().slice(0, 16); // Keep format YYYY-MM-DDTHH:mm
};

const RequesterFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    queryId: uuidv4(),
    requesterName: "",
    createdAt: getISTDateTime(),
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
          userId: user?.userId || "",
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
  
    // Ensure requesterId is set properly
    const payload = {
      requesterId: formData.userId, // ✅ Rename userId to requesterId
      dbName: formData.dbName,
      query: formData.query,
      queryDescription: formData.queryDescription,
      approverIds: formData.approverIds,
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
  type="datetime-local" 
  value={formData.createdAt} 
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
