
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Query {
  id: string;
  queryId: string;
  requestedBy: string;
  requestedAt: string;
  approverId: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  query: string;
  databaseName: string;
  serverName: string;
  queryContent: string;
}

const ApproverPage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      const approverId = localStorage.getItem("approverId"); // Get logged-in Approver ID
      if (!approverId) {
        console.error("No approver ID found in localStorage.");
        setError("Approver ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/approver-queries/${approverId}`);
        setQueries(response.data);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setError("Failed to fetch queries. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleQueryClick = (queryId: string) => {
    const query = queries.find((q) => q.id === queryId) || null;
    setSelectedQuery(query);
  };

  const handleAction = async (action: "approved" | "rejected" | "on hold") => {
    if (!selectedQuery) return;

    try {
      await axios.post("http://localhost:5000/update-query-status", {
        queryId: selectedQuery.id,
        status: action,
        approverId: localStorage.getItem("approverId"),
      });

      setQueries((prev) =>
        prev.map((query) =>
          query.id === selectedQuery.id
            ? {
                ...query,
                status: action === "approved" ? "Approved" : action === "rejected" ? "Rejected" : "On Hold",
                approvedBy: localStorage.getItem("approverId"),
                approvedAt: new Date().toISOString(),
              }
            : query
        )
      );

      setSelectedQuery(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-700 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-7xl">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Approver Dashboard</h2>

        {selectedQuery ? (
          <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Query Details</h3>
            <p><strong>Requested By:</strong> {selectedQuery.requestedBy}</p>
            <p><strong>Requested At:</strong> {new Date(selectedQuery.requestedAt).toLocaleString()}</p>
            <p><strong>Database:</strong> {selectedQuery.databaseName}</p>
            <p><strong>Server:</strong> {selectedQuery.serverName}</p>
            <p><strong>Query:</strong> <pre className="bg-gray-200 p-2 rounded">{selectedQuery.queryContent}</pre></p>

            <div className="flex justify-between mt-6">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleAction("approved")}>
                Approve
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleAction("on hold")}>
                On Hold
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleAction("rejected")}>
                Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-3">Query ID</th>
                  <th className="border p-3">Requested By</th>
                  <th className="border p-3">Requested At</th>
                  <th className="border p-3">Approver ID</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Approved By</th>
                  <th className="border p-3">Approved At</th>
                  <th className="border p-3">Query</th>
                  <th className="border p-3">Database Name</th>
                  <th className="border p-3">Server Name</th>
                  <th className="border p-3">Query Content</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr
                    key={query.id}
                    className="hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleQueryClick(query.id)}
                  >
                    <td className="border p-3 text-blue-600">{query.queryId}</td>
                    <td className="border p-3">{query.requestedBy}</td>
                    <td className="border p-3">{new Date(query.requestedAt).toLocaleString()}</td>
                    <td className="border p-3">{query.approverId}</td>
                    <td className="border p-3">{query.status}</td>
                    <td className="border p-3">{query.approvedBy || "-"}</td>
                    <td className="border p-3">{query.approvedAt ? new Date(query.approvedAt).toLocaleString() : "-"}</td>
                    <td className="border p-3">{query.query}</td>
                    <td className="border p-3">{query.databaseName}</td>
                    <td className="border p-3">{query.serverName}</td>
                    <td className="border p-3">{query.queryContent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproverPage;

