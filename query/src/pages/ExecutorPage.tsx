

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";

// interface Query {
//   id: string;
//   query_id: string;
//   requested_by: string;
//   requester_id: string;
//   approver_id: string;
//   executor_id: string;
//   requested_at: string;
//   status: string;
//   approved_at: string | null;
//   executed_by: string | null;
//   executed_at: string | null;
//   query: string;
//   database_name: string;
//   query_description: string;
//   result: string | null;
// }

// const API_BASE_URL = "http://localhost:5000";

// const ExecutorPage: React.FC = () => {
//   const [queries, setQueries] = useState<Query[]>([]);
//   const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchQueries = async () => {
//       const executorId = localStorage.getItem("executorId");
//       console.log("executorId:", executorId);
//       const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;

//       if (!executorId || !token) {
//         setError("Authentication failed. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_BASE_URL}/executor-queries/${executorId}`, {
//           headers: { Authorization: `Bearer ${token}` },
          
//         });
//         console.log("response:", response),

//         setQueries(response.data);
//       } catch (err: any) {
//         console.error("❌ Error fetching queries:", err);
//         setError(err.response?.data?.error || "Failed to fetch queries. Try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQueries();
//   }, []);

//   const handleQueryClick = (queryId: string) => {
//     const query = queries.find((q) => String(q.id) === queryId) || null;
//     setSelectedQuery(query);
//   };
//   console.log("handleQueryClick:", handleQueryClick );

//   const handleExecution = async () => {
//     if (!selectedQuery) return;

//     const executorId = localStorage.getItem("executorId");
//     const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;

//     if (!executorId || !token) {
//       setPopupMessage("⚠️ Authentication failed. Please log in again.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_BASE_URL}/executor/update-query-status`,
//         { queryId: selectedQuery.id, status: "executed", executorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQueries((prev) =>
//         prev.map((query) =>
//           query.id === selectedQuery.id
//             ? { ...query, status: "executed", executed_by: `Executor (${executorId})`, executed_at: new Date().toISOString() }
//             : query
//         )
//       );

//       setPopupMessage("✅ Query Executed Successfully!");
//       setTimeout(() => setPopupMessage(null), 2000);
//       setSelectedQuery(null);
//     } catch (error) {
//       console.error("❌ Error executing query:", error);
//       setPopupMessage("⚠️ Failed to execute query!");
//       setTimeout(() => setPopupMessage(null), 2000);
//     }
//   };

//   const exportToExcel = () => {
//     if (queries.length === 0) {
//       setPopupMessage("⚠️ No data to export!");
//       setTimeout(() => setPopupMessage(null), 2000);
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(queries);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Queries Report");
//     XLSX.writeFile(workbook, "Query_Report.xlsx");
//   };

//   if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
//       <h1 className="text-3xl text-white font-bold mb-4 text-center">Executor Dashboard</h1>
//       <button className="bg-green-600 text-white px-4 py-2 rounded mb-4 self-center" onClick={exportToExcel}>
//         📥 Download Excel Report
//       </button>

//       <div className="flex-grow bg-white p-6 rounded-lg shadow-2xl overflow-auto">
//         {popupMessage && (
//           <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow-lg">
//             {popupMessage}
//           </div>
//         )}

//         {selectedQuery ? (
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Query Details</h2>
//             {Object.entries(selectedQuery).map(([key, value]) => (
//               <p key={key}>
//                 <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value || "N/A"}
//               </p>
//             ))}

//             <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={handleExecution}>
//               ✅ Execute
//             </button>
//             <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-4" onClick={() => setSelectedQuery(null)}>
//               🔙 Back
//             </button>
//           </div>
//         ) : (
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               <tr className="bg-blue-700 text-white">
//                 <th className="border px-4 py-2">ID</th>
//                 <th className="border px-4 py-2">Query ID</th>
//                 <th className="border px-4 py-2">Requested By</th>
//                 <th className="border px-4 py-2">Requester ID</th>
//                 <th className="border px-4 py-2">Approver ID</th>
//                 <th className="border px-4 py-2">Executor ID</th>
//                 <th className="border px-4 py-2">Requested At</th>
//                 <th className="border px-4 py-2">Status</th>
//                 <th className="border px-4 py-2">Approved At</th>
//                 <th className="border px-4 py-2">Executed By</th>
//                 <th className="border px-4 py-2">Executed At</th>
//                 <th className="border px-4 py-2">Query</th>
//                 <th className="border px-4 py-2">Database</th>
//                 <th className="border px-4 py-2">Description</th>
//                 <th className="border px-4 py-2">Result</th>
//               </tr>
//             </thead>
//             <tbody>
//   {queries.map((query) => (
//     <tr
//       key={query.id}
//       className="border hover:bg-gray-100 cursor-pointer"
//       onClick={() => handleQueryClick(String(query.id))}
//     >
//       <td className="border px-4 py-2">{query.id || "N/A"}</td>
//       <td className="border px-4 py-2">{query.query_id || "N/A"}</td>
//       <td className="border px-4 py-2">{query.requested_by ?? "Unknown"}</td>
//       <td className="border px-4 py-2">{query.approver_id ?? "Not Assigned"}</td>
//       <td className="border px-4 py-2">{query.executor_id || "N/A"}</td>
//       <td className="border px-4 py-2">
//         {query.requested_at ? new Date(query.requested_at).toLocaleString() : "N/A"}
//       </td>
//       <td className="border px-4 py-2">{query.status || "N/A"}</td>
//       <td className="border px-4 py-2">
//         {query.approved_at ? new Date(query.approved_at).toLocaleString() : "Pending"}
//       </td>
//       <td className="border px-4 py-2">{query.executed_by ?? "Not Executed"}</td>
//       <td className="border px-4 py-2">
//         {query.executed_at ? new Date(query.executed_at).toLocaleString() : "N/A"}
//       </td>
//       <td className="border px-4 py-2">{query.query || "N/A"}</td>
//       <td className="border px-4 py-2">{query.database_name || "N/A"}</td>
//       <td className="border px-4 py-2">{query.query_description || "No Description"}</td>
//       <td className="border px-4 py-2">{query.result || "No Result"}</td>
//     </tr>
//   ))}
// </tbody>


//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExecutorPage;


import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Query {
  id: string;
  query_id: string;
  requested_by: string;
  requester_id: string;
  approver_id: string;
  executor_id: string;
  requested_at: string;
  status: string;
  approved_at: string | null;
  executed_by: string | null;
  executed_at: string | null;
  query: string;
  database_name: string;
  query_description: string;
  result: string | null;
}

const API_BASE_URL = "http://localhost:5000";

const ExecutorPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      const executorId = localStorage.getItem("executorId");
      const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;
  
      if (!executorId || !token) {
        setError("Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`${API_BASE_URL}/executor-queries/${executorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setQueries(response.data);
      } catch (err: any) {
        console.error("❌ Error fetching queries:", err);
        setError(err.response?.data?.error || "Failed to fetch queries. Try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQueries();
  }, []);
  const handleQueryClick = (queryId: string) => {
    const query = queries.find((q) => String(q.id) === queryId) || null;
    setSelectedQuery(query);
  };

  const handleExecution = async () => {
    if (!selectedQuery) return;

    const executorId = localStorage.getItem("executorId");
    const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;

    if (!executorId || !token) {
      setPopupMessage("⚠️ Authentication failed. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/executor/update-query-status`,
        { queryId: selectedQuery.id, status: "executed", executorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQueries((prev) =>
        prev.map((query) =>
          query.id === selectedQuery.id
            ? { ...query, status: "executed", executed_by: `Executor (${executorId})`, executed_at: new Date().toISOString() }
            : query
        )
      );

      setPopupMessage("✅ Query Executed Successfully!");
      setTimeout(() => setPopupMessage(null), 2000);
      setSelectedQuery(null);
    } catch (error) {
      console.error("❌ Error executing query:", error);
      setPopupMessage("⚠️ Failed to execute query!");
      setTimeout(() => setPopupMessage(null), 2000);
    }
  };

  const exportToExcel = () => {
    if (queries.length === 0) {
      setPopupMessage("⚠️ No data to export!");
      setTimeout(() => setPopupMessage(null), 2000);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(queries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries Report");
    XLSX.writeFile(workbook, "Query_Report.xlsx");
  };

  if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
      <h1 className="text-3xl text-white font-bold mb-4 text-center">Executor Dashboard</h1>
      <button className="bg-green-600 text-white px-4 py-2 rounded mb-4 self-center" onClick={exportToExcel}>
        📥 Download Excel Report
      </button>

      <div className="flex-grow bg-white p-6 rounded-lg shadow-2xl overflow-auto">
        {popupMessage && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow-lg">
            {popupMessage}
          </div>
        )}

        {selectedQuery ? (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Query Details</h2>
            {Object.entries(selectedQuery).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value || "N/A"}
              </p>
            ))}

            <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={handleExecution}>
              ✅ Execute
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-4" onClick={() => setSelectedQuery(null)}>
              🔙 Back
            </button>
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Query ID</th>
                <th className="border px-4 py-2">Requested By</th>
                <th className="border px-4 py-2">Requester ID</th>
                <th className="border px-4 py-2">Approver ID</th>
                <th className="border px-4 py-2">Executor ID</th>
                <th className="border px-4 py-2">Requested At</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Approved At</th>
                <th className="border px-4 py-2">Executed By</th>
                <th className="border px-4 py-2">Executed At</th>
                <th className="border px-4 py-2">Query</th>
                <th className="border px-4 py-2">Database</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr
                  key={query.id}
                  className="border hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleQueryClick(String(query.id))}
                >
                  <td className="border px-4 py-2">{query.id || "N/A"}</td>
                  <td className="border px-4 py-2">{query.query_id || "N/A"}</td>
                  <td className="border px-4 py-2">{query.requested_by ?? "Unknown"}</td>
                  <td className="border px-4 py-2">{query.requester_id ?? "N/A"}</td>
                  <td className="border px-4 py-2">{query.approver_id ?? "Not Assigned"}</td>
                  <td className="border px-4 py-2">{query.executor_id || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {query.requested_at ? new Date(query.requested_at).toLocaleString() : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{query.status || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {query.approved_at ? new Date(query.approved_at).toLocaleString() : "Pending"}
                  </td>
                  <td className="border px-4 py-2">{query.executed_by ?? "Not Executed"}</td>
                  <td className="border px-4 py-2">
                    {query.executed_at ? new Date(query.executed_at).toLocaleString() : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{query.query || "N/A"}</td>
                  <td className="border px-4 py-2">{query.database_name || "N/A"}</td>
                  <td className="border px-4 py-2">{query.query_description || "No Description"}</td>
                  <td className="border px-4 py-2">{query.result || "No Result"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExecutorPage;