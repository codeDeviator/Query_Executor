
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// interface Query {
//   id: string;
//   queryId: string;
//   requestedBy: string;
//   requestedAt: string | null;
//   approverId: string;
//   status: string;
//   approvedBy: string | null;
//   approvedAt: string | null;
//   query: string;
//   databaseName: string;
//   queryDescription: string;
// }

// const ApproverPage = () => {
//   const [queries, setQueries] = useState<Query[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchQueries = async () => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (!userData) throw new Error("User data missing. Please log in again.");

//       let parsedUser;
//       try {
//         parsedUser = JSON.parse(userData);
//       } catch (e) {
//         throw new Error("Invalid user data. Please log in again.");
//       }

//       if (!parsedUser?.userId) throw new Error("Approver ID missing. Please log in again.");

//       const response = await axios.get(`http://localhost:5000/queries/approver/${parsedUser.userId}`);

//       const formattedQueries = response.data.map((query: any) => ({
//         id: query.id?.toString() || "",
//         queryId: query.query_id?.toString() || "",
//         requestedBy: query.requested_by?.toString() || "Unknown",
//         requestedAt: query.requested_at ?? null,
//         approverId: query.approver_id?.toString() || "N/A",
//         status: query.status || "Pending",
//         approvedBy: query.approved_by?.toString() ?? null,
//         approvedAt: query.approved_at ?? null,
//         query: query.query || "",
//         databaseName: query.database_name || "Unknown",
//         queryDescription: query.query_description || "No description",
//       }));

//       setQueries(formattedQueries);
//     } catch (error) {
//       console.error("Error fetching queries:", error);
//       setError(
//         axios.isAxiosError(error)
//           ? error.response?.data?.message || "Failed to fetch queries."
//           : error instanceof Error
//           ? error.message
//           : "An unknown error occurred."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQueries();
//   }, []);

//   if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-blue-700 p-6">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-7xl">
//         <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Approver Dashboard</h2>

//         <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               {["Query ID", "Requested By", "Requested At", "Approver ID", "Status", "Approved By", "Approved At", "Query", "Database Name", "Query Description"].map((header) => (
//                 <th key={header} className="border p-3">{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {queries.length > 0 ? (
//               queries.map((query) => (
//                 <tr key={query.queryId} className="hover:bg-gray-200 cursor-pointer">
//                   <td className="border p-3 text-blue-600 font-semibold underline" onClick={() => navigate(`/approver/${query.queryId}`)}>{query.queryId}</td>
//                   <td className="border p-3">{query.requestedBy}</td>
//                   <td className="border p-3">{query.requestedAt ? new Date(query.requestedAt).toLocaleString() : "-"}</td>
//                   <td className="border p-3">{query.approverId}</td>
//                   <td className={`border p-3 font-bold ${query.status === "Approved" ? "text-green-600" : query.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
//                     {query.status}
//                   </td>
//                   <td className="border p-3">{query.approvedBy ?? "-"}</td>
//                   <td className="border p-3">{query.approvedAt ? new Date(query.approvedAt).toLocaleString() : "-"}</td>
//                   <td className="border p-3">{query.query}</td>
//                   <td className="border p-3">{query.databaseName}</td>
//                   <td className="border p-3">{query.queryDescription}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan={10} className="text-center">No queries available</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ApproverPage;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Query {
  id: string;
  queryId: string;
  requestedBy: string;
  requestedAt: string | null;
  approverId: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  query: string;
  databaseName: string;
  queryDescription: string;
}

const ApproverPage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchQueries = async () => {
    try {
      if (!userData) throw new Error("User data missing. Please log in again.");

      let parsedUser;
      try {
        parsedUser = JSON.parse(userData);
      } catch (e) {
        throw new Error("Invalid user data. Please log in again.");
      }

      if (!parsedUser?.userId) throw new Error("Approver ID missing. Please log in again.");

      const response = await axios.get(`http://localhost:5000/queries/approver/${parsedUser.userId}`);

      const formattedQueries = response.data.map((query: any) => ({
        id: query.id?.toString() || "",
        queryId: query.query_id?.toString() || "",
        requestedBy: query.requested_by?.toString() || "Unknown",
        requestedAt: query.requested_at ?? null,
        approverId: query.approver_id?.toString() || "N/A",
        status: query.status || "Pending",
        approvedBy: query.approved_by?.toString() ?? null,
        approvedAt: query.approved_at ?? null,
        query: query.query || "",
        databaseName: query.database_name || "Unknown",
        queryDescription: query.query_description || "No description",
      }));

      setQueries(formattedQueries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch queries."
          : error instanceof Error
          ? error.message
          : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-700 p-6 relative">
      {/* Logout Button - Top Right Corner */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            className="flex items-center space-x-2 bg-white text-blue-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">{user?.name || "Approver"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showLogoutDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-7xl mt-12">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Approver Dashboard</h2>

        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Query ID", "Requested By", "Requested At", "Approver ID", "Status", "Approved By", "Approved At", "Query", "Database Name", "Query Description"].map((header) => (
                <th key={header} className="border p-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? (
              queries.map((query) => (
                <tr key={query.queryId} className="hover:bg-gray-200 cursor-pointer">
                  <td className="border p-3 text-blue-600 font-semibold underline" onClick={() => navigate(`/approver/${query.queryId}`)}>{query.queryId}</td>
                  <td className="border p-3">{query.requestedBy}</td>
                  <td className="border p-3">{query.requestedAt ? new Date(query.requestedAt).toLocaleString() : "-"}</td>
                  <td className="border p-3">{query.approverId}</td>
                  <td className={`border p-3 font-bold ${query.status === "Approved" ? "text-green-600" : query.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
                    {query.status}
                  </td>
                  <td className="border p-3">{query.approvedBy ?? "-"}</td>
                  <td className="border p-3">{query.approvedAt ? new Date(query.approvedAt).toLocaleString() : "-"}</td>
                  <td className="border p-3">{query.query}</td>
                  <td className="border p-3">{query.databaseName}</td>
                  <td className="border p-3">{query.queryDescription}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={10} className="text-center">No queries available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproverPage;