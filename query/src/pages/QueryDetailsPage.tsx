
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Define the expected query structure
interface QueryType {
  id: number;
  database_name: string;
  query: string;
  query_description: string;
  requested_at: string;
  approver_name?: string;
  approved_by?: number | null;
  status: string;
}

const QueryDetailsPage = () => {
  const { queryId } = useParams<{ queryId?: string }>(); // ✅ Get queryId from the URL
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Query Details Function
  const fetchQueryDetails = async () => {
    if (!queryId) {
      setError("Invalid query ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching details for Query ID: ${queryId}`);
      const response = await axios.get(`http://localhost:5000/queries/${queryId}`);

      if (response.data) {
        setQuery(response.data);
      } else {
        setError("Query not found.");
      }
    } catch (err) {
      setError("Error fetching query details. Try again later.");
      console.error("❌ Error fetching query details:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Query Details on Component Mount
  useEffect(() => {
    fetchQueryDetails();
  }, [queryId]);

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-gradient-to-r from-blue-500 to-blue-900 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Query Details</h2>

        {loading ? (
          <p className="text-center text-gray-700 mt-10 animate-pulse">Loading query details...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-10">{error}</p>
        ) : query ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
            <p className="text-lg">
              <strong>Query ID:</strong> {query.id}
            </p>
            <p className="text-lg">
              <strong>Database:</strong> {query.database_name || "Not Available"}
            </p>
            <p className="text-lg">
              <strong>Query:</strong> {query.query || "Not Available"}
            </p>
            <p className="text-lg">
              <strong>Description:</strong> {query.query_description || "Not Available"}
            </p>
            <p className="text-lg">
              <strong>Requested At:</strong>{" "}
              {query.requested_at ? new Date(query.requested_at).toLocaleString() : "Unknown"}
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
                {query.status}
              </span>
            </p>
            <p className="text-lg">
              <strong>Approver:</strong> {query.approver_name || "Not Available"}
            </p>
            <p className="text-lg">
              <strong>Approved By (ID):</strong> {query.approved_by ?? "Not Available"}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-600 mt-10">Query not found!</p>
        )}

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
