
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RequesterFilesPage = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.userId) {
      alert("No requester ID found. Please log in again.");
      navigate("/login"); // Redirect if no user
      return;
    }

    const fetchQueries = () => {
      const savedQueries = JSON.parse(localStorage.getItem("queries") || "[]");

      // Filter queries that match the logged-in requester's userId
      const userQueries = savedQueries.filter((query) => query.requesterId === `R00${user.userId}`);

      setFiles(
        userQueries.map((query, index) => ({
          id: query.queryId || `Q00${index + 1}`,
          name: `query_${query.queryId || index + 1}.txt`,
          status: query.status || "Pending",
        }))
      );
    };

    fetchQueries();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen w-screen p-6 bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Requester Files</h2>
        <p className="text-gray-600 mb-6 text-center">Here are all the files related to your submitted requests.</p>

        {files.length === 0 ? (
          <p className="text-center text-gray-500">No files available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">File Name</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{file.name}</td>
                  <td className={`p-3 font-semibold ${file.status === "Approved" ? "text-green-600" : file.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
                    {file.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-center mt-6">
          <Link to="/requester" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Back to Requester Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequesterFilesPage;

