// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface Query {
//   query_id: number;
//   requested_by: number;
//   requested_at: string;
//   database_name: string;
//   query: string;
//   query_description: string;
//   status: string;
//   approver_id: number | null;
//   approved_by: string | null;
//   approved_at: string | null;
// }

// interface ApproverDetailsPageProps {
//   onStatusChange?: () => void; // 🟢 Made optional
// }

// const ApproverDetailsPage: React.FC<ApproverDetailsPageProps> = ({ onStatusChange }) => {
//   const { queryId } = useParams<{ queryId: string }>(); // Explicit typing
//   const navigate = useNavigate();
//   const [query, setQuery] = useState<Query | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchQuery = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/queries/${queryId}`);
//         setQuery(response.data);
//       } catch (err) {
//         console.error("❌ Error fetching query:", err);
//         setError("Query not found or an error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (queryId) fetchQuery();
//   }, [queryId]);

//   const handleAction = async (action: "approved" | "rejected" | "pending") => {
//     console.log("🟡 Query object:", query);
  
//     if (!query?.query_id) {
//       console.error("❌ Missing Query ID!");
//       setError("Query ID is missing.");
//       return;
//     }

//     const updatedStatus = action.toLowerCase();

//     const payload = {
//       query_id: query.query_id,
//       status: updatedStatus,
//       approver_id: query.approver_id || 4, // Use a default value if null
//     };

//     console.log("🔹 Sending request with payload:", payload);
  
//     try {
//       const response = await axios.post("http://localhost:5000/update-query-status", payload, {
//         headers: { "Content-Type": "application/json" },
//       });
  
//       console.log("✅ Response:", response.data);
//       setQuery((prev) => (prev ? { ...prev, status: updatedStatus } : prev)); // ✅ Update state locally
      
//       if (onStatusChange) {
//         onStatusChange(); // ✅ Check if function exists before calling
//       }

//       navigate("/approver");
//     } catch (err) {
//       console.error("❌ Error updating status:", err);
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || "Failed to update query status.");
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     }
//   };

//   if (loading) return <div className="text-center text-white text-lg">Loading query details...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;
//   if (!query) return <div className="text-center text-red-500">Query not found</div>;

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
//         <h2 className="text-3xl font-bold mb-4">Query Details</h2>
//         <p><strong>Query ID:</strong> {query.query_id}</p>
//         <p><strong>Requested By:</strong> {query.requested_by}</p>
//         <p><strong>Database:</strong> {query.database_name}</p>
//         <p><strong>Status:</strong> {query.status}</p>
//         <p><strong>Description:</strong> {query.query_description}</p>

//         <div className="flex space-x-4 mt-4">
//           <button 
//             onClick={() => handleAction("approved")} 
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Approve
//           </button>
//           <button 
//             onClick={() => handleAction("rejected")} 
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//           >
//             Reject
//           </button>
//           <button 
//             onClick={() => handleAction("pending")} 
//             className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//           >
//             On Hold
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproverDetailsPage;
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface Query {
  query_id: number;
  requested_by: number;
  requested_at: string;
  database_name: string;
  query: string;
  query_description: string;
  status: string;
  approver_id: number | null;
  approved_by: string | null;
  approved_at: string | null;
}

interface ApproverDetailsPageProps {
  onStatusChange?: () => void; // 🟢 Made optional
}

const ApproverDetailsPage: React.FC<ApproverDetailsPageProps> = ({ onStatusChange }) => {
  const { queryId } = useParams<{ queryId: string }>(); // Explicit typing
  const navigate = useNavigate();
  const [query, setQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/queries/${queryId}`);
        setQuery(response.data);
      } catch (err) {
        console.error("❌ Error fetching query:", err);
        setError("Query not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (queryId) fetchQuery();
  }, [queryId]);

  const handleAction = async (action: "approved" | "rejected" | "pending") => {
    console.log("🟡 Query object:", query);

    if (!query?.query_id) {
      console.error("❌ Missing Query ID!");
      setError("Query ID is missing.");
      return;
    }

    const updatedStatus = action.toLowerCase();

    // Convert query_id and approver_id to integers
    const payload = {
      query_id: parseInt(query.query_id.toString(), 10), // Ensure query_id is an integer
      status: updatedStatus,
      approver_id: parseInt(query.approver_id?.toString() || "4", 10), // Ensure approver_id is an integer
    };

    console.log("🔹 Sending request with payload:", payload);

    try {
      const response = await axios.post("http://localhost:5000/update-query-status", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Response:", response.data);
      setQuery((prev) => (prev ? { ...prev, status: updatedStatus } : prev)); // Update state locally

      if (onStatusChange) {
        onStatusChange(); // Call the callback to refresh data in the Approver Dashboard
      }

      navigate("/approver");
    } catch (err) {
      console.error("❌ Error updating status:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to update query status.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  if (loading) return <div className="text-center text-white text-lg">Loading query details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!query) return <div className="text-center text-red-500">Query not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Query Details</h2>
        <p><strong>Query ID:</strong> {query.query_id}</p>
        <p><strong>Requested By:</strong> {query.requested_by}</p>
        <p><strong>Database:</strong> {query.database_name}</p>
        <p><strong>Status:</strong> {query.status}</p>
        <p><strong>Description:</strong> {query.query_description}</p>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => handleAction("approved")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction("rejected")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction("pending")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            On Hold
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproverDetailsPage;