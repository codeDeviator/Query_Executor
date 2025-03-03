// import { useParams, useNavigate } from "react-router-dom";

// const queries = [
//   { 
//     queryId: "Q001", requestedBy: "Requester 1", requestorId: "R001", time: "10:00 AM", date: "2025-01-01", status: "Pending",
//     requestType: "SELECT", requestedAt: "2025-01-01 09:55 AM",
//     approvedBy: "", approvedAt: "", executedAt: "", executedBy: "",
//     queryName: "Query 1", databaseName: "DB1", serverName: "Server1", queryContent: "SELECT * FROM users;"
//   },
//   { 
//     queryId: "Q002", requestedBy: "Requester 2", requestorId: "R002", time: "11:00 AM", date: "2025-01-02", status: "Pending",
//     requestType: "UPDATE", requestedAt: "2025-01-02 10:45 AM",
//     approvedBy: "", approvedAt: "", executedAt: "", executedBy: "",
//     queryName: "Query 2", databaseName: "DB2", serverName: "Server2", queryContent: "UPDATE users SET active = 1;"
//   },
// ];

// const ApproverDetailsPage = () => {
//   const { queryId } = useParams();
//   const navigate = useNavigate();

//   const query = queries.find(q => q.queryId === queryId);

//   if (!query) {
//     return <div className="text-center text-red-500">Query not found</div>;
//   }

//   const handleAction = (action: string) => {
//     alert(`Query ${query.queryId} has been ${action}`);
//     navigate("/approver");
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Query Details</h2>
//         <div className="mb-4">
//           <strong>Requestor ID:</strong> {query.requestorId}
//         </div>
//         <div className="mb-4">
//           <strong>Requested By:</strong> {query.requestedBy}
//         </div>
//         <div className="mb-4">
//           <strong>Request Type:</strong> {query.requestType}
//         </div>
//         <div className="mb-4">
//           <strong>Requested At:</strong> {query.requestedAt}
//         </div>
//         <div className="mb-4">
//           <strong>Database:</strong> {query.databaseName}
//         </div>
//         <div className="mb-4">
//           <strong>Server:</strong> {query.serverName}
//         </div>
//         <div className="mb-4">
//           <strong>Query Content:</strong>
//           <pre className="bg-gray-100 p-2 rounded">{query.queryContent}</pre>
//         </div>

//         <div className="flex justify-between mt-6">
//           <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleAction("approved")}>
//             Approve
//           </button>
//           <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleAction("put on hold")}>
//             On Hold
//           </button>
//           <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleAction("rejected")}>
//             Reject
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproverDetailsPage;
