import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Query {
  id: number;
  db_name: string;
  query: string;
  query_description: string;
  requested_at: string;
  approver_name?: string;
  approved_by?: number;
  status: string;
}

const RequesterPage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Retrieve requesterId dynamically
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const requesterId = user?.userId; 

  // ✅ Fetch Queries Function
  const fetchQueries = async () => {
    if (!requesterId) {
      setError("Requester ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching queries for requesterId: ${requesterId}`);
      const response = await axios.get(`http://localhost:5000/queries/requester/${requesterId}`);
      setQueries(response.data);
    } catch (err) {
      setError("Error fetching queries. Try again later.");
      console.error("❌ Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Queries on Component Mount & when requesterId changes
  useEffect(() => {
    if (requesterId) {
      fetchQueries();
    }
  }, [requesterId]); 

  // ✅ Query Submission Function
  const handleQuerySubmit = async (formData: any) => {
    setSubmitting(true); 

    try {
      const response = await axios.post("http://localhost:5000/submit-query", formData);
      console.log("✅ Query submitted successfully:", response.data);

      // 🔄 Fetch updated queries list after successful submission
      await fetchQueries();
    } catch (error) {
      console.error("❌ Error submitting query:", error);
      setError("Error submitting query. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-blue-700 p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-7xl">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
          Requester Dashboard
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/create-query")}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg text-lg font-semibold hover:bg-pink-700 transition"
            disabled={submitting} 
          >
            {submitting ? "Submitting..." : "Create New Query"}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-700">Loading queries...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg w-full">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Submitted Queries
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-3">Query ID</th>
                    <th className="border p-3">DB Name</th>
                    <th className="border p-3">Query</th>
                    <th className="border p-3">Query Description</th>
                    <th className="border p-3">Requested At</th>
                    <th className="border p-3">Approver Name</th>
                    <th className="border p-3">Approved By</th>
                    <th className="border p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.length > 0 ? (
                    queries.map((query) => (
                      <tr
                        key={query.id}
                        className="hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/query/${query.id}`)}
                      >
                        <td className="border p-3 text-blue-600">{query.id}</td>
                        <td className="border p-3">{query.db_name}</td>
                        <td className="border p-3">{query.query}</td>
                        <td className="border p-3">{query.query_description}</td>
                        <td className="border p-3">
                          {new Date(query.requested_at).toLocaleString()}
                        </td>
                        <td className="border p-3">{query.approver_name || "-"}</td>
                        <td className="border p-3">{query.approved_by || "-"}</td>
                        <td className="border p-3 text-center">{query.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="border p-3 text-center text-gray-600">
                        No queries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequesterPage;
