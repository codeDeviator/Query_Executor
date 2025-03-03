

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Define the expected query structure
interface QueryType {
  queryId: string;
  createdAt?: string;
  status?: string;
  description?: string;
}

const QueryDetailsPage = () => {
  const { queryId } = useParams<{ queryId?: string }>(); // Ensure queryId is properly typed
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryType | null>(null);

  useEffect(() => {
    try {
      const savedQueries = localStorage.getItem("queries");
      if (savedQueries) {
        const parsedQueries: QueryType[] = JSON.parse(savedQueries);

        // Ensure queryId is always a string before comparison
        const foundQuery = parsedQueries.find((q) => q.queryId === String(queryId));
        if (foundQuery) {
          setQuery(foundQuery);
        }
      }
    } catch (error) {
      console.error("Error parsing queries from localStorage:", error);
    }
  }, [queryId]);

  if (!query) {
    return <p className="text-center text-red-600 mt-10">Query not found!</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-gradient-to-r from-blue-500 to-blue-900 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Query Details</h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg">
            <strong>Query ID:</strong> {query.queryId || "N/A"}
          </p>
          <p className="text-lg">
            <strong>Created At:</strong> {query.createdAt || "Unknown"}
          </p>
          <p className="text-lg">
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                query.status === "Approved"
                  ? "text-green-600"
                  : query.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {query.status || "Pending"}
            </span>
          </p>
          <p className="text-lg mt-4">
            <strong>Description:</strong> {query.description || "No description provided."}
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/requester")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Back to Requester Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryDetailsPage;

// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";

// const QueryDetailsPage = () => {
//   const { queryId } = useParams();
//   const navigate = useNavigate();
//   const [executed, setExecuted] = useState(false);

//   const handleExecution = () => {
//     setExecuted(true);
//     setTimeout(() => {
//       navigate("/");
//     }, 3000);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Execute Query</h1>
//       <p className="text-gray-700 mb-4">Query ID: <span className="font-semibold">{queryId}</span></p>
//       <button
//         className={`px-4 py-2 rounded ${executed ? "bg-green-600" : "bg-blue-600"} text-white`}
//         onClick={handleExecution}
//         disabled={executed}
//       >
//         {executed ? "Executed ✅" : "Execute Query"}
//       </button>
//       {executed && <p className="mt-4 text-green-600">Query executed successfully! Redirecting...</p>}
//     </div>
//   );
// };

// export default QueryDetailsPage;
