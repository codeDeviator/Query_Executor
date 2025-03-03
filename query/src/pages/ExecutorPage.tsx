
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

interface Query {
  id: string;
  queryId: string;
  requestedBy: string;
  requestorId: string;
  approverId: string;
  executorId: string;
  status: string;
  requestType: string;
  requestedAt: string;
  approvedBy: string;
  approvedAt: string;
  executedAt: string;
  executedBy: string;
  queryName: string;
  databaseName: string;
  serverName: string;
  queryContent: string;
}

const ExecutorPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      const executorId = localStorage.getItem("executorId");
      if (!executorId) {
        setError("Executor ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/executor-queries/${executorId}`);
        setQueries(response.data);
      } catch (error) {
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

  const handleExecution = async () => {
    if (!selectedQuery) return;

    try {
      await axios.post("http://localhost:5000/update-query-status", {
        queryId: selectedQuery.id,
        status: "Executed",
        executorId: localStorage.getItem("executorId"),
      });

      setQueries((prev) =>
        prev.map((query) =>
          query.id === selectedQuery.id
            ? { ...query, status: "Executed", executedBy: "Executor 1", executedAt: new Date().toISOString() }
            : query
        )
      );
      setPopupMessage("Query Executed Successfully!");
      setTimeout(() => setPopupMessage(null), 2000);
      setSelectedQuery(null);
    } catch (error) {
      console.error("Error executing query:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(queries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries Report");
    XLSX.writeFile(workbook, "Query_Report.xlsx");
  };

  if (loading) return <div className="text-center text-white text-lg">Loading queries...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
      <div className="flex-grow bg-white p-6 rounded-lg shadow-2xl overflow-auto">
        {popupMessage && <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow-lg">{popupMessage}</div>}
        {selectedQuery ? (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Query Details</h2>
            <p><strong>Requestor ID:</strong> {selectedQuery.requestorId}</p>
            <p><strong>Requested By:</strong> {selectedQuery.requestedBy}</p>
            <p><strong>Database:</strong> {selectedQuery.databaseName}</p>
            <p><strong>Server:</strong> {selectedQuery.serverName}</p>
            <p><strong>Query:</strong> <pre className="bg-gray-100 p-2 rounded">{selectedQuery.queryContent}</pre></p>
            <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={handleExecution}>Execute</button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Executor Dashboard</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={exportToExcel}>Download Excel Report</button>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  {['Query ID', 'Requested By', 'Database', 'Server', 'Status'].map((col) => (
                    <th key={col} className="px-4 py-2 border">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query.id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleQueryClick(query.id)}>
                    <td className="px-4 py-2 border text-blue-600 underline">{query.queryId}</td>
                    <td className="px-4 py-2 border">{query.requestedBy}</td>
                    <td className="px-4 py-2 border">{query.databaseName}</td>
                    <td className="px-4 py-2 border">{query.serverName}</td>
                    <td className="px-4 py-2 border">{query.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ExecutorPage;

