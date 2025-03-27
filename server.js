

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Pool } = require("pg");

// const app = express();
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   ssl: false,
// });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// // 🔹 Signup Route
// app.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
//       [name, email, hashedPassword, role]
//     );
//     res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔹 Login Route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//   if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

//   const user = result.rows[0];
//   if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Invalid credentials" });

//   const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//   res.json({ token, role: user.role, userId: user.id, name: user.name });
// });

// // 🔹 Submit Query
// app.post("/submit-query", async (req, res) => {
//   const { requesterId, requesterName, dbName, query, queryDescription, approverNames } = req.body;

//   if (!requesterId || !requesterName || !dbName || !query || !queryDescription || !approverNames.length) {
//     return res.status(400).json({ error: "All fields are required, including at least one approver." });
//   }

//   try {
//     const approverList = approverNames.join(", ");
//     const result = await pool.query(
//       `INSERT INTO requester (requester_id, name, db_name, query, query_description, requested_at, approver_name, status) 
//        VALUES ($1, $2, $3, $4, $5, NOW(), $6, 'Pending') RETURNING id`,
//       [requesterId, requesterName, dbName, query, queryDescription, approverList]
//     );

//     res.status(201).json({ message: "Query submitted successfully", queryId: result.rows[0].id });
//   } catch (err) {
//     console.error("❌ Error submitting query:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Fetch a Single Query by ID
// app.get("/query/:queryId", async (req, res) => {
//   const { queryId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT id, requester_id, db_name, query, query_description, requested_at, status, approved_by, approver_name
//        FROM requester WHERE id = $1`,
//       [queryId]
//     );

//     if (result.rows.length === 0) return res.status(404).json({ error: "Query not found" });

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("❌ Error fetching query details:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Fetch Queries for a Specific Requester
// app.get("/queries/requester/:requesterId", async (req, res) => {
//   const { requesterId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT * FROM requester WHERE requester_id = $1 ORDER BY requested_at DESC`,
//       [requesterId]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching requester queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Fetch Queries for a Specific Approver
// app.get("/queries/approver/:approverId", async (req, res) => {
//   const { approverId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT 
//           id, query_id, requested_by, requested_at, approver_id, status, approved_at, 
//           query, database_name, server_name, query_content
//        FROM approver
//        WHERE approver_id = $1
//        ORDER BY requested_at DESC`,
//       [approverId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "No queries found for this approver." });
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching approver queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Approve a Query
// app.post("/approve-query/:queryId", async (req, res) => {
//   const { queryId } = req.params;
//   const { approverId } = req.body;

//   if (!approverId) {
//     return res.status(400).json({ error: "Approver ID is required" });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE approver 
//        SET status = 'Approved', approved_at = NOW() 
//        WHERE query_id = $1 AND approver_id = $2 RETURNING *`,
//       [queryId, approverId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Query not found or not assigned to this approver." });
//     }

//     res.json({ message: "Query approved successfully", updatedQuery: result.rows[0] });
//   } catch (err) {
//     console.error("❌ Error approving query:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Reject a Query
// app.post("/reject-query/:queryId", async (req, res) => {
//   const { queryId } = req.params;
//   const { approverId } = req.body;

//   if (!approverId) {
//     return res.status(400).json({ error: "Approver ID is required" });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE approver 
//        SET status = 'Rejected', approved_at = NOW() 
//        WHERE query_id = $1 AND approver_id = $2 RETURNING *`,
//       [queryId, approverId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Query not found or not assigned to this approver." });
//     }

//     res.json({ message: "Query rejected successfully", updatedQuery: result.rows[0] });
//   } catch (err) {
//     console.error("❌ Error rejecting query:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // 🔹 Start Server
// app.listen(5000, () => console.log("🚀 Server running on port 5000"));



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Pool } = require("pg");

// const app = express();
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   ssl: false,
// });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// // 🔹 Signup Route
// app.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
//       [name, email, hashedPassword, role]
//     );
//     res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔹 Login Route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//   if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

//   const user = result.rows[0];
//   if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Invalid credentials" });

//   const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//   res.json({ token, role: user.role, userId: user.id, name: user.name });
// });

// // 🔹 Submit Query
// app.post("/submit-query", async (req, res) => {
//   const { requesterId, requesterName, dbName, query, queryDescription, approverId } = req.body;

//   if (!requesterId || !requesterName || !dbName || !query || !queryDescription || !approverId) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO requester (query, database_name, query_content, requested_by, requested_at, approver_id, status) 
//        VALUES ($1, $2, $3, $4, NOW(), $5, 'Pending') RETURNING id`,
//       [query, dbName, queryDescription, requesterId, approverId]
//     );

//     res.status(201).json({ message: "Query submitted successfully", queryId: result.rows[0].id });
//   } catch (err) {
//     console.error("❌ Error submitting query:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Fetch Queries for a Specific Approver
// app.get("/queries/approver/:approverId", async (req, res) => {
//   const { approverId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT id AS query_id, requested_by, requested_at, approver_id, status, approved_at, query, database_name, query_content 
//        FROM approver WHERE approver_id = $1 ORDER BY requested_at DESC`,
//       [approverId]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching approver queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Approve or Reject a Query
// app.post("/update-query-status", async (req, res) => {
//   const { queryId, status, approverId } = req.body;

//   if (!queryId || !status || !approverId) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     await pool.query(
//       `UPDATE approver SET status = $1, approved_at = NOW() WHERE query_id = $2 AND approver_id = $3`,
//       [status, queryId, approverId]
//     );

//     res.json({ message: `Query ${status} successfully` });
//   } catch (err) {
//     console.error("❌ Error updating query status:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Start Server
// app.listen(5000, () => console.log("🚀 Server running on port 5000"));




// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Pool } = require("pg");

// const app = express();
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   ssl: false,
// });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// /**
//  * 🔹 User Signup
//  */

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader && authHeader.split(" ")[1];

//   console.log("🔑 Received Token:", token);

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log("✅ Token Verified:", decoded);
//     next();
//   } catch (err) {
//     console.error("❌ Invalid Token:", err.message);
//     return res.status(403).json({ error: "Invalid token. Please log in again." });
//   }
// };




// app.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert into users table
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
//       [name, email, hashedPassword, role]
//     );

//     const userId = result.rows[0].id;

//     // Insert into role-specific tables
//     if (role === "executor") {
//       await pool.query("INSERT INTO executor (executor_id) VALUES ($1)", [userId]);
//     } else if (role === "approver") {
//       await pool.query("INSERT INTO approver (approver_id) VALUES ($1)", [userId]);
//     }

//     res.status(201).json({ message: "User registered successfully", userId });
//   } catch (err) {
//     console.error("❌ Signup Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * 🔹 User Login
//  */
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
  
//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//     if (result.rows.length === 0) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const user = result.rows[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     console.log("🔐 Generating JWT for:", user.email);

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     res.json({ token, role: user.role, userId: user.id, name: user.name });
//   } catch (err) {
//     console.error("❌ Login Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// /**
//  * 🔹 Submit a Query
//  */
// app.post("/submit-query", async (req, res) => {
//   try {
//     const { requesterId, dbName, query, queryDescription, approverIds } = req.body;

//     if (!requesterId || !dbName || !query || !queryDescription || !approverIds || approverIds.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const client = await pool.connect();
//     try {
//       // Insert into requester table and get query_id
//       const queryInsert = `
//         INSERT INTO requester (db_name, query, query_description, requested_at, requester_id) 
//         VALUES ($1, $2, $3, NOW(), $4) RETURNING id;
//       `;
//       const result = await client.query(queryInsert, [dbName, query, queryDescription, requesterId]);
//       const queryId = result.rows[0].id;

//       // Insert into approver table for each approver
//       const insertApprover = `
//         INSERT INTO approver (query_id, requested_by, requested_at, approver_id, status, query, database_name, query_content, approved_by) 
//         VALUES ($1, $2, NOW(), $3, 'pending', $4, $5, $6, $7)
//         ON CONFLICT DO NOTHING;
//       `;

//       for (const approverId of approverIds) {
//         await client.query(insertApprover, [queryId, requesterId, approverId, query, dbName, queryDescription, "System"]);
//       }

//       res.json({ message: "Query submitted successfully", queryId });
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// /**
//  * 🔹 Fetch a single query by ID
//  */
// app.get("/queries/:queryId", async (req, res) => {
//   const { queryId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT 
//           a.query_id,
//           a.requested_by, 
//           a.requested_at, 
//           a.approver_id, 
//           a.status, 
//           a.approved_at, 
//           a.query, 
//           a.database_name, 
//           a.query_content,
//           COALESCE(u.name, 'Unknown') AS approved_by
//        FROM approver a
//        LEFT JOIN users u ON a.approver_id = u.id
//        WHERE a.query_id = $1`,
//       [queryId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Query not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("❌ Error fetching query:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });




// /**
//  * 🔹 Fetch Queries for a Requester
//  */
// // app.get("/queries/requester/:requesterId", async (req, res) => {
// //   const { requesterId } = req.params;

// //   try {
// //     const queryResult = await pool.query(
// //       `SELECT 
// //           r.id, 
// //           r.db_name, 
// //           r.query, 
// //           r.query_description, 
// //           r.requested_at,
// //           COALESCE(a.status, 'Pending') AS status, 
// //           COALESCE(u.name, 'Not Available') AS approver_name
// //        FROM requester r
// //        LEFT JOIN approver a ON r.id = a.query_id
// //        LEFT JOIN users u ON a.approver_id = u.id
// //        WHERE r.requester_id = $1
// //        ORDER BY r.requested_at DESC`,
// //       [requesterId]
// //     );

// //     res.json(queryResult.rows);
// //   } catch (err) {
// //     console.error("❌ Error fetching queries:", err.message);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// ///Ankit
// app.get("/queries/requester/:requesterId", async (req, res) => {
//   const { requesterId } = req.params;

//   try {
//     const queryResult = await pool.query(
//       `SELECT 
//           r.id, 
//           r.db_name, 
//           r.query, 
//           r.query_description, 
//           r.requested_at,
//           COALESCE(a.status, 'Pending') AS status, 
//           COALESCE(STRING_AGG(u.name, ', '), 'Not Available') AS approver_names,
//           COALESCE(STRING_AGG(a.approver_id::TEXT, ', '), 'Not Available') AS approved_by
//        FROM requester r
//        LEFT JOIN approver a ON r.id = a.query_id
//        LEFT JOIN users u ON a.approver_id = u.id
//        WHERE r.requester_id = $1
//        GROUP BY r.id, a.status
//        ORDER BY r.requested_at DESC`,
//       [requesterId]
//     );

//     res.json(queryResult.rows);
//   } catch (err) {
//     console.error("❌ Error fetching queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// // Fetch queries assigned to the approver
// app.get("/queries/approver/:approverId", async (req, res) => {
//   try {
//     const { approverId } = req.params;
//     console.log(`Fetching queries for Approver ID: ${approverId}`);

//     const result = await pool.query(
//       `SELECT 
//           id, 
//           query_id, 
//           requested_by, 
//           requested_at, 
//           approver_id, 
//           status, 
//           approved_at, 
//           query, 
//           database_name, 
//           query_content, 
//           approved_by 
//       FROM approver 
//       WHERE approver_id = $1 OR status = 'pending'`,
//       [approverId]
//     );

//     console.log("✅ Approver Queries:", result.rows);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching queries:", err.message);
//     res.status(500).send("Server Error");
//   }
// });

// /**
//  * 🔹 Approver: Fetch Queries
//  */
// app.get("/queries/approver/:approverId", async (req, res) => {
//   const { approverId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT 
//           r.id AS query_id, 
//           u.name AS requested_by, 
//           r.requested_at, 
//           r.status, 
//           a.approved_at,  
//           r.query, 
//           r.db_name AS database_name, 
//           r.query_description 
//        FROM requester r
//        JOIN users u ON r.requester_id = u.id
//        LEFT JOIN approver a ON r.id = a.query_id  
//        WHERE r.status = 'pending' OR a.approver_id = $1
//        ORDER BY r.requested_at DESC`,
//       [approverId]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching approver queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * 🔹 Update Query Status (Approver)
//  */
// app.post("/update-query-status", async (req, res) => {
//   const { query_id, status, approver_id } = req.body;

//   console.log("🔹 Received request:", req.body);

//   // 🔍 Validate required fields
//   if (!query_id || !status || !approver_id) {
//     console.error("❌ Missing required fields:", { query_id, status, approver_id });
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // 🔍 Ensure status is valid
//   const validStatuses = ["pending", "approved", "rejected"];
//   if (!validStatuses.includes(status.toLowerCase())) {
//     console.error("❌ Invalid status value:", status);
//     return res.status(400).json({ error: "Invalid status value" });
//   }

//   try {
//     // 🛠 Check if queryId exists in the requester table
//     console.log("🔍 Checking if queryId exists:", query_id);
//     const queryExists = await pool.query(`SELECT id FROM requester WHERE id = $1`, [query_id]);

//     if (queryExists.rowCount === 0) {
//       console.error("❌ Query ID does not exist:", query_id);
//       return res.status(404).json({ error: "Invalid Query ID" });
//     }

//     // 🛠 Check if approverId exists in the users table
//     console.log("🔍 Checking if approverId exists:", approver_id);
//     const approverExists = await pool.query(`SELECT id FROM users WHERE id = $1`, [approver_id]);

//     if (approverExists.rowCount === 0) {
//       console.error("❌ Approver ID does not exist:", approver_id);
//       return res.status(404).json({ error: "Invalid Approver ID" });
//     }

//     // 🛠 Update the query status in the approver table
//     console.log("🔹 Updating query status...");
//     const result = await pool.query(
//       `UPDATE approver 
//        SET status = $1, approver_id = $2 
//        WHERE query_id = $3 
//        RETURNING *`,
//       [status, approver_id, query_id]
//     );

//     if (result.rowCount === 0) {
//       console.error("❌ Query not found in approver table:", query_id);
//       return res.status(404).json({ error: "Query not found in approver table" });
//     }

//     console.log("✅ Query status updated successfully:", result.rows[0]);
//     res.json({ message: "Query status updated successfully", data: result.rows[0] });

//   } catch (err) {
//     console.error("❌ Error updating query status:", err.message);
//     res.status(500).json({ error: "Internal Server Error", details: err.message });
//   }
// });



// // app.get("/queries/approver/:approverId", async (req, res) => {
// //   try {
// //     const { approverId } = req.params;
// //     console.log(`Fetching queries for Approver ID: ${approverId}`);

// //     const result = await pool.query(
// //       `SELECT 
// //           r.id AS query_id, 
// //           u.name AS requested_by, 
// //           r.requested_at, 
// //           r.status, 
// //           a.approved_at,  
// //           r.query, 
// //           r.db_name AS database_name, 
// //           r.query_description, 
// //           a.approver_id, 
// //           a.approved_by 
// //        FROM requester r
// //        JOIN users u ON r.requester_id = u.id
// //        LEFT JOIN approver a ON r.id = a.query_id  
// //        WHERE r.status = 'pending' OR a.approver_id = $1
// //        ORDER BY r.requested_at DESC`,
// //       [approverId]
// //     );

// //     console.log("✅ Approver Queries:", result.rows);
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error("❌ Error fetching queries:", err.message);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // app.post("/update-query-status", async (req, res) => {
// //   const { query_id, status, approver_id } = req.body;

// //   console.log("🔹 Received request:", req.body);

// //   if (!query_id || !status || !approver_id) {
// //     console.error("❌ Missing required fields:", { query_id, status, approver_id });
// //     return res.status(400).json({ error: "Missing required fields" });
// //   }

// //   const validStatuses = ["pending", "approved", "rejected"];
// //   if (!validStatuses.includes(status.toLowerCase())) {
// //     console.error("❌ Invalid status value:", status);
// //     return res.status(400).json({ error: "Invalid status value" });
// //   }

// //   try {
// //     const queryExists = await pool.query(`SELECT id FROM requester WHERE id = $1`, [query_id]);
// //     if (queryExists.rowCount === 0) {
// //       console.error("❌ Query ID does not exist:", query_id);
// //       return res.status(404).json({ error: "Invalid Query ID" });
// //     }

// //     const approverExists = await pool.query(`SELECT id FROM users WHERE id = $1`, [approver_id]);
// //     if (approverExists.rowCount === 0) {
// //       console.error("❌ Approver ID does not exist:", approver_id);
// //       return res.status(404).json({ error: "Invalid Approver ID" });
// //     }

// //     const result = await pool.query(
// //       `UPDATE approver 
// //        SET status = $1, approver_id = $2 
// //        WHERE query_id = $3 
// //        RETURNING *`,
// //       [status, approver_id, query_id]
// //     );

// //     if (result.rowCount === 0) {
// //       console.error("❌ Query not found in approver table:", query_id);
// //       return res.status(404).json({ error: "Query not found in approver table" });
// //     }

// //     console.log("✅ Query status updated successfully:", result.rows[0]);
// //     res.json({ message: "Query status updated successfully", data: result.rows[0] });
// //   } catch (err) {
// //     console.error("❌ Error updating query status:", err.message);
// //     res.status(500).json({ error: "Internal Server Error", details: err.message });
// //   }
// // });






// app.get("/executor-queries/:executorId", authenticateToken, async (req, res) => {
//   const { executorId } = req.params;
//   console.log("🔍 Executor ID from request:", executorId);
//   console.log("🔐 User ID from token:", req.user?.id); // Should NOT be undefined

//   try {
//       const result = await pool.query(
//           `SELECT 
//               e.id, 
//               e.query_id, 
//               r.requester_id, 
//               a.approver_id, 
//               e.executor_id, 
//               r.requested_at, 
//               r.status, 
//               a.approved_at,  
//               e.executed_by, 
//               e.executed_at,
//               r.query, 
//               r.db_name AS database_name, 
//               r.query_description, 
//               e.result
//           FROM executor e
//           JOIN requester r ON e.query_id = r.id
//           LEFT JOIN approver a ON r.id = a.query_id
//           WHERE e.executor_id = $1
//           ORDER BY r.requested_at DESC`,
//           [executorId]
//       );

//       console.log("✅ Queries found:", result.rows.length);
//       res.json(result.rows);
//   } catch (err) {
//       console.error("❌ Error fetching executor queries:", err.message);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * 🔹 Fetch Approvers List
//  */
// app.get("/approvers", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, name FROM users WHERE role = 'approver'"
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching approvers:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// /**
//  * 🔹 Update Query Status (Executor Execution)
//  */
// app.post("/executor/update-query-status", async (req, res) => {
//   const { queryId, status, executorId } = req.body;

//   if (!queryId || !status || !executorId) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const executedAt = new Date().toISOString();
    
//     await pool.query(
//       `UPDATE executor 
//        SET status = $1, executed_by = $2, executed_at = $3 
//        WHERE query_id = $4 AND executor_id = $5`,
//       [status, executorId, executedAt, queryId, executorId]
//     );

//     res.json({ message: "Query execution status updated successfully" });
//   } catch (err) {
//     console.error("❌ Error updating query status:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// /*
//  * 🔹 Start Server
//  */
// app.listen(5000, () => console.log("🚀 Server running on port 5000"));




// // require("dotenv").config();
// // const express = require("express");
// // const cors = require("cors");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const { Pool } = require("pg");

// // const app = express();
// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASS,
// //   port: process.env.DB_PORT,
// //   ssl: false,
// // });

// // app.use(cors({ origin: "*" }));
// // app.use(express.json());

// // /**
// //  * 🔹 Middleware: Authenticate Token
// //  */
// // const authenticateToken = (req, res, next) => {
// //   const authHeader = req.header("Authorization");
// //   const token = authHeader && authHeader.split(" ")[1];

// //   if (!token) {
// //     return res.status(401).json({ error: "Access denied. No token provided." });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     return res.status(403).json({ error: "Invalid token. Please log in again." });
// //   }
// // };

// // /**
// //  * 🔹 User Signup
// //  */
// // app.post("/signup", async (req, res) => {
// //   const { name, email, password, role } = req.body;
// //   if (!name || !email || !password || !role) {
// //     return res.status(400).json({ error: "All fields are required" });
// //   }

// //   try {
// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const result = await pool.query(
// //       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
// //       [name, email, hashedPassword, role]
// //     );

// //     const userId = result.rows[0].id;

// //     if (role === "executor") {
// //       await pool.query("INSERT INTO executor (executor_id) VALUES ($1)", [userId]);
// //     } else if (role === "approver") {
// //       await pool.query("INSERT INTO approver (approver_id) VALUES ($1)", [userId]);
// //     }

// //     res.status(201).json({ message: "User registered successfully", userId });
// //   } catch (err) {
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // /**
// //  * 🔹 User Login
// //  */
// // app.post("/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
// //     if (result.rows.length === 0) {
// //       return res.status(400).json({ error: "User not found" });
// //     }

// //     const user = result.rows[0];
// //     const passwordMatch = await bcrypt.compare(password, user.password);
// //     if (!passwordMatch) {
// //       return res.status(400).json({ error: "Invalid credentials" });
// //     }

// //     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
// //       expiresIn: "1h",
// //     });

// //     res.json({ token, role: user.role, userId: user.id, name: user.name });
// //   } catch (err) {
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // // 🔹 API to Handle Query Submission
// // app.post("/submit-query", async (req, res) => {
// //   try {
// //     const { requesterId, requesterName, dbName, query, queryDescription, approverIds, requestedAt } = req.body;

// //     // ✅ Validate all required fields
// //     if (!requesterId || !dbName || !query || !queryDescription || !approverIds || approverIds.length === 0 || !requestedAt) {
// //       return res.status(400).json({ error: "All fields are required" });
// //     }

// //     // 🔹 Get Approver Names
// //     const approverNamesResult = await pool.query(
// //       `SELECT name FROM users WHERE id = ANY($1::int[])`,
// //       [approverIds]
// //     );

// //     const approverNames = approverNamesResult.rows.map((row) => row.name).join(", ");

// //     // ✅ Insert Query Request into `requester` table
// //     const queryResult = await pool.query(
// //       `INSERT INTO requester (requester_id, name, db_name, query, query_description, requested_at, approver_name, status)
// //        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING id`,
// //       [requesterId, requesterName, dbName, query, queryDescription, requestedAt, approverNames]
// //     );

// //     const queryId = queryResult.rows[0].id;

// //     // ✅ Insert Approver Mappings into `approver` table
// //     for (const approverId of approverIds) {
// //       await pool.query(
// //         `INSERT INTO approver (query_id, requested_by, requested_at, approver_id, status, query, database_name, query_content)
// //          VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7)`,
// //         [queryId, requesterId, requestedAt, approverId, query, dbName, queryDescription]
// //       );
// //     }

// //     res.status(201).json({ message: "Query submitted successfully", queryId });
// //   } catch (error) {
// //     console.error("❌ Error submitting query:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });


// // /**
// //  * 🔹 Fetch Queries for an Executor
// //  */
// // app.get("/executor-queries/:executorId", authenticateToken, async (req, res) => {
// //   const { executorId } = req.params;

// //   try {
// //     const result = await pool.query(
// //       `SELECT 
// //           e.id, 
// //           e.query_id, 
// //           r.requester_id, 
// //           a.approver_id, 
// //           e.executor_id, 
// //           r.requested_at, 
// //           r.status, 
// //           a.approved_at,  
// //           e.executed_by, 
// //           e.executed_at,
// //           r.query, 
// //           r.db_name AS database_name, 
// //           r.query_description, 
// //           e.result
// //       FROM executor e, approver a, requester r ;
// //        JOIN requester r ON e.query_id = r.id
// //        LEFT JOIN approver a ON r.id = a.query_id
// //        WHERE e.executor_id = $1 AND e.query_id IS NOT NULL
// //        ORDER BY r.requested_at DESC`,
// //        [executorId]
// //     );

// //     res.json(result.rows);
// //   } catch (err) {
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });



// // /**
// //  * 🔹 Update Query Status (Executor Execution)
// //  */
// // app.post("/executor/update-query-status", async (req, res) => {
// //   const { queryId, status, executorId } = req.body;
// //   if (!queryId || !status || !executorId) {
// //     return res.status(400).json({ error: "Missing required fields" });
// //   }

// //   try {
// //     const executedAt = new Date().toISOString();

// //     const { rowCount } = await pool.query(
// //       `UPDATE executor 
// //        SET status = $1, executed_by = $2, executed_at = $3 
// //        WHERE query_id = $4 AND executor_id = $5 
// //        RETURNING *`,
// //       [status, executorId, executedAt, queryId, executorId]
// //     );

// //     if (rowCount === 0) {
// //       return res.status(403).json({ error: "Unauthorized: You can only update your assigned queries" });
// //     }

// //     res.json({ message: "Query execution status updated successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // /**
// //  * 🔹 Cleanup: Remove Empty Query Entries (Run Once in Database)
// //  */
// // app.delete("/cleanup-empty-queries", async (req, res) => {
// //   try {
// //     const { rowCount } = await pool.query("DELETE FROM queries WHERE query_id IS NULL");
// //     res.json({ message: `Deleted ${rowCount} empty queries.` });
// //   } catch (err) {
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // /**
// //  * 🔹 Start Server
// //  */
// // app.listen(5000, () => console.log("🚀 Server running on port 5000"));





require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: false,
});

app.use(cors({ origin: "*" }));
app.use(express.json());

/**
 * 🔹 User Signup
 */

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔑 Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token Verified:", decoded);
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    return res.status(403).json({ error: "Invalid token. Please log in again." });
  }
};



// ----------------Ankit


// SMTP Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Please click the following link to verify your email: ${verificationUrl}`,
  };

  await transporter.sendMail(mailOptions);
};

// app.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     // Insert into users table
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role, verification_token, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
//       [name, email, hashedPassword, role, verificationToken, false]
//     );

//     const userId = result.rows[0].id;

//     // Insert into role-specific tables
//     if (role === "executor") {
//       await pool.query("INSERT INTO executor (executor_id) VALUES ($1)", [userId]);
//     } else if (role === "approver") {
//       await pool.query("INSERT INTO approver (approver_id) VALUES ($1)", [userId]);
//     }

//     // Send verification email
//     await sendVerificationEmail(email, verificationToken);

//     res.status(201).json({ message: "User registered successfully. Please check your email to verify your account.", userId });
//   } catch (err) {
//     console.error("❌ Signup Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Insert into users table
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, verification_token, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, email, hashedPassword, role, verificationToken, false]
    );

    const userId = result.rows[0].id;

    // Insert into executor table if role is executor
    if (role === "executor") {
      await pool.query("INSERT INTO executor (executor_id) VALUES ($1)", [userId]);
    }

    // Do not insert into approver table during signup

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "User registered successfully. Please check your email to verify your account.", userId });
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE verification_token = $1", [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    const user = result.rows[0];

    // Mark user as verified
    await pool.query("UPDATE users SET verified = true, verification_token = NULL WHERE id = $1", [user.id]);

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("❌ Email Verification Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Check if email is verified
    if (!user.verified) {
      return res.status(400).json({ error: "Please verify your email before logging in." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, userId: user.id, name: user.name });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ----------------

// app.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert into users table
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
//       [name, email, hashedPassword, role]
//     );

//     const userId = result.rows[0].id;

//     // Insert into role-specific tables
//     if (role === "executor") {
//       await pool.query("INSERT INTO executor (executor_id) VALUES ($1)", [userId]);
//     } else if (role === "approver") {
//       await pool.query("INSERT INTO approver (approver_id) VALUES ($1)", [userId]);
//     }

//     res.status(201).json({ message: "User registered successfully", userId });
//   } catch (err) {
//     console.error("❌ Signup Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

/**
 * 🔹 User Login
 */
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
  
//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//     if (result.rows.length === 0) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const user = result.rows[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     console.log("🔐 Generating JWT for:", user.email);

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     res.json({ token, role: user.role, userId: user.id, name: user.name });
//   } catch (err) {
//     console.error("❌ Login Error:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


/**
 * 🔹 Submit a Query
 */
// app.post("/submit-query", async (req, res) => {
//   try {
//     const { requesterId, dbName, query, queryDescription, approverIds } = req.body;

//     if (!requesterId || !dbName || !query || !queryDescription || !approverIds || approverIds.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const client = await pool.connect();
//     try {
//       // Insert into requester table and get query_id
//       const queryInsert = `
//         INSERT INTO requester (db_name, query, query_description, requested_at, requester_id) 
//         VALUES ($1, $2, $3, NOW(), $4) RETURNING id;
//       `;
//       const result = await client.query(queryInsert, [dbName, query, queryDescription, requesterId]);
//       const queryId = result.rows[0].id;

//       // Insert into approver table for each approver
//       const insertApprover = `
//         INSERT INTO approver (query_id, requested_by, requested_at, approver_id, status, query, database_name, query_content, approved_by) 
//         VALUES ($1, $2, NOW(), $3, 'pending', $4, $5, $6, $7)
//         ON CONFLICT DO NOTHING;
//       `;

//       for (const approverId of approverIds) {
//         await client.query(insertApprover, [queryId, requesterId, approverId, query, dbName, queryDescription, "System"]);
//       }

//       res.json({ message: "Query submitted successfully", queryId });
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// ----------------------------------------------------------------------

// 23
app.post("/submit-query", async (req, res) => {
  try {
    const { requesterId, dbName, query, queryDescription, approverIds } = req.body;

    if (!requesterId || !dbName || !query || !queryDescription || !approverIds || approverIds.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const client = await pool.connect();
    try {
      // Insert into requester table and get query_id
      const queryInsert = `
        INSERT INTO requester (db_name, query, query_description, requested_at, requester_id) 
        VALUES ($1, $2, $3, NOW(), $4) RETURNING id;
      `;
      const result = await client.query(queryInsert, [dbName, query, queryDescription, requesterId]);
      const queryId = result.rows[0].id;

      // Insert into approver table for each approver
      const insertApprover = `
        INSERT INTO approver (query_id, requested_by, requested_at, approver_id, status, query, database_name, query_content) 
        VALUES ($1, $2, NOW(), $3, 'pending', $4, $5, $6)
        ON CONFLICT DO NOTHING;
      `;

      for (const approverId of approverIds) {
        await client.query(insertApprover, [queryId, requesterId, approverId, query, dbName, queryDescription]);
      }

      res.json({ message: "Query submitted successfully", queryId });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * 🔹 Fetch a single query by ID
 */
app.get("/queries/:queryId", async (req, res) => {
  const { queryId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          a.query_id,
          a.requested_by, 
          a.requested_at, 
          a.approver_id, 
          a.status, 
          a.approved_at, 
          a.query, 
          a.database_name, 
          a.query_content,
          COALESCE(u.name, 'Unknown') AS approved_by
       FROM approver a
       LEFT JOIN users u ON a.approver_id = u.id
       WHERE a.query_id = $1`,
      [queryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching query:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




/**
 * 🔹 Fetch Queries for a Requester
 */
app.get("/queries/requester/:requesterId", async (req, res) => {
  const { requesterId } = req.params;

  try {
    const queryResult = await pool.query(
      `SELECT 
          r.id, 
          r.db_name, 
          r.query, 
          r.query_description, 
          r.requested_at,
          COALESCE(a.status, 'Pending') AS status, 
          COALESCE(u.name, 'Not Available') AS approver_name
       FROM requester r
       LEFT JOIN approver a ON r.id = a.query_id
       LEFT JOIN users u ON a.approver_id = u.id
       WHERE r.requester_id = $1
       ORDER BY r.requested_at DESC`,
      [requesterId]
    );

    res.json(queryResult.rows);
  } catch (err) {
    console.error("❌ Error fetching queries:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Fetch queries assigned to the approver
// app.get("/queries/approver/:approverId", async (req, res) => {
//   try {
//     const { approverId } = req.params;
//     console.log(`Fetching queries for Approver ID: ${approverId}`);

//     const result = await pool.query(
//       `SELECT 
//           id, 
//           query_id, 
//           requested_by, 
//           requested_at, 
//           approver_id, 
//           status, 
//           approved_at, 
//           query, 
//           database_name, 
//           query_content, 
//           approved_by 
//       FROM approver 
//       WHERE approver_id = $1 OR status = 'pending'`,
//       [approverId]
//     );

//     console.log("✅ Approver Queries:", result.rows);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching queries:", err.message);
//     res.status(500).send("Server Error");
//   }
// });

app.get("/queries/approver/:approverId", async (req, res) => {
  const { approverId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          a.id,
          r.id AS query_id, 
          u.name AS requested_by, 
          r.requested_at, 
          a.status, 
          a.approved_at,  
          a.approved_by,
          r.query, 
          r.db_name AS database_name, 
          r.query_description 
       FROM approver a
       JOIN requester r ON a.query_id = r.id
       JOIN users u ON r.requester_id = u.id
       WHERE a.approver_id = $1
       ORDER BY r.requested_at DESC`,
      [approverId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching approver queries:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// /**
//  * 🔹 Approver: Fetch Queries
//  */
app.get("/queries/approver/:approverId", async (req, res) => {
  const { approverId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          r.id AS query_id, 
          u.name AS requested_by, 
          r.requested_at, 
          r.status, 
          a.approved_at,  
          r.query, 
          r.db_name AS database_name, 
          r.query_description 
       FROM requester r
       JOIN users u ON r.requester_id = u.id
       LEFT JOIN approver a ON r.id = a.query_id  
       WHERE r.status = 'pending' OR a.approver_id = $1
       ORDER BY r.requested_at DESC`,
      [approverId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching approver queries:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----------------------------------------------
// 23
// app.get("/queries/approver/:approverId", async (req, res) => {
//   const { approverId } = req.params;

//   try {
//     const result = await pool.query(
//       `SELECT 
//           r.id AS query_id, 
//           u.name AS requested_by, 
//           r.requested_at, 
//           r.status, 
//           a.approved_at,  
//           r.query, 
//           r.db_name AS database_name, 
//           r.query_description 
//        FROM requester r
//        JOIN users u ON r.requester_id = u.id
//        LEFT JOIN approver a ON r.id = a.query_id  
//        WHERE (r.status = 'pending' OR a.approver_id = $1)
//        ORDER BY r.requested_at DESC`,
//       [approverId]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching approver queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
/**
 * 🔹 Update Query Status (Approver)
 */


app.get("/query/:queryId", async (req, res) => {
  const { queryId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          r.id, 
          r.db_name, 
          r.query, 
          r.query_description, 
          r.requested_at,
          r.status,
          u.name AS approver_name, 
          a.approved_by
       FROM requester r
       LEFT JOIN approver a ON r.id = a.query_id
       LEFT JOIN users u ON a.approver_id = u.id
       WHERE r.id = $1`,
      [queryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching query details:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// app.post("/update-query-status", async (req, res) => {
//   const { query_id, status, approver_id } = req.body;

//   console.log("🔹 Received request:", req.body);

//   // 🔍 Validate required fields
//   if (!query_id || !status || !approver_id) {
//     console.error("❌ Missing required fields:", { query_id, status, approver_id });
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // 🔍 Ensure status is valid
//   const validStatuses = ["pending", "approved", "rejected"];
//   if (!validStatuses.includes(status.toLowerCase())) {
//     console.error("❌ Invalid status value:", status);
//     return res.status(400).json({ error: "Invalid status value" });
//   }

//   try {
//     // 🛠 Check if queryId exists in the requester table
//     console.log("🔍 Checking if queryId exists:", query_id);
//     const queryExists = await pool.query(`SELECT id FROM requester WHERE id = $1`, [query_id]);

//     if (queryExists.rowCount === 0) {
//       console.error("❌ Query ID does not exist:", query_id);
//       return res.status(404).json({ error: "Invalid Query ID" });
//     }

//     // 🛠 Check if approverId exists in the users table
//     console.log("🔍 Checking if approverId exists:", approver_id);
//     const approverExists = await pool.query(`SELECT id FROM users WHERE id = $1`, [approver_id]);

//     if (approverExists.rowCount === 0) {
//       console.error("❌ Approver ID does not exist:", approver_id);
//       return res.status(404).json({ error: "Invalid Approver ID" });
//     }

//     // 🛠 Update the query status in the approver table
//     console.log("🔹 Updating query status...");
//     const result = await pool.query(
//       `UPDATE approver 
//        SET status = $1, approver_id = $2 
//        WHERE query_id = $3 
//        RETURNING *`,
//       [status, approver_id, query_id]
//     );

//     if (result.rowCount === 0) {
//       console.error("❌ Query not found in approver table:", query_id);
//       return res.status(404).json({ error: "Query not found in approver table" });
//     }

//     console.log("✅ Query status updated successfully:", result.rows[0]);
//     res.json({ message: "Query status updated successfully", data: result.rows[0] });

//   } catch (err) {
//     console.error("❌ Error updating query status:", err.message);
//     res.status(500).json({ error: "Internal Server Error", details: err.message });
//   }
// });


app.post("/update-query-status", async (req, res) => {
  const { query_id, status, approver_id } = req.body;

  // Validate input
  if (!query_id || !status || !approver_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Explicitly cast parameters to ensure type consistency
    const result = await pool.query(
      `UPDATE approver 
       SET status = $1::text, 
           approver_id = $2::integer,
           approved_by = $2::integer,
           approved_at = CASE WHEN $1::text = 'approved' THEN NOW() ELSE NULL END
       WHERE query_id = $3::integer
       RETURNING *`,
      [status, approver_id, query_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Query not found" });
    }

    res.json({ 
      message: "Query status updated successfully", 
      data: result.rows[0] 
    });
  } catch (err) {
    console.error("Error updating query status:", err);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: err.message 
    });
  }
});


// app.get("/queries/approver/:approverId", async (req, res) => {
//   try {
//     const { approverId } = req.params;
//     console.log(`Fetching queries for Approver ID: ${approverId}`);

//     const result = await pool.query(
//       `SELECT 
//           r.id AS query_id, 
//           u.name AS requested_by, 
//           r.requested_at, 
//           r.status, 
//           a.approved_at,  
//           r.query, 
//           r.db_name AS database_name, 
//           r.query_description, 
//           a.approver_id, 
//           a.approved_by 
//        FROM requester r
//        JOIN users u ON r.requester_id = u.id
//        LEFT JOIN approver a ON r.id = a.query_id  
//        WHERE r.status = 'pending' OR a.approver_id = $1
//        ORDER BY r.requested_at DESC`,
//       [approverId]
//     );

//     console.log("✅ Approver Queries:", result.rows);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching queries:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/update-query-status", async (req, res) => {
//   const { query_id, status, approver_id } = req.body;

//   console.log("🔹 Received request:", req.body);

//   if (!query_id || !status || !approver_id) {
//     console.error("❌ Missing required fields:", { query_id, status, approver_id });
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const validStatuses = ["pending", "approved", "rejected"];
//   if (!validStatuses.includes(status.toLowerCase())) {
//     console.error("❌ Invalid status value:", status);
//     return res.status(400).json({ error: "Invalid status value" });
//   }

//   try {
//     const queryExists = await pool.query(`SELECT id FROM requester WHERE id = $1`, [query_id]);
//     if (queryExists.rowCount === 0) {
//       console.error("❌ Query ID does not exist:", query_id);
//       return res.status(404).json({ error: "Invalid Query ID" });
//     }

//     const approverExists = await pool.query(`SELECT id FROM users WHERE id = $1`, [approver_id]);
//     if (approverExists.rowCount === 0) {
//       console.error("❌ Approver ID does not exist:", approver_id);
//       return res.status(404).json({ error: "Invalid Approver ID" });
//     }

//     const result = await pool.query(
//       `UPDATE approver 
//        SET status = $1, approver_id = $2 
//        WHERE query_id = $3 
//        RETURNING *`,
//       [status, approver_id, query_id]
//     );

//     if (result.rowCount === 0) {
//       console.error("❌ Query not found in approver table:", query_id);
//       return res.status(404).json({ error: "Query not found in approver table" });
//     }

//     console.log("✅ Query status updated successfully:", result.rows[0]);
//     res.json({ message: "Query status updated successfully", data: result.rows[0] });
//   } catch (err) {
//     console.error("❌ Error updating query status:", err.message);
//     res.status(500).json({ error: "Internal Server Error", details: err.message });
//   }
// });






app.get("/executor-queries/:executorId", authenticateToken, async (req, res) => {
  const { executorId } = req.params;
  console.log("🔍 Executor ID from request:", executorId);
  console.log("🔐 User ID from token:", req.user?.id); // Should NOT be undefined

  try {
      const result = await pool.query(
          `SELECT 
              e.id, 
              e.query_id, 
              r.requester_id, 
              a.approver_id, 
              e.executor_id, 
              r.requested_at, 
              r.status, 
              a.approved_at,  
              e.executed_by, 
              e.executed_at,
              r.query, 
              r.db_name AS database_name, 
              r.query_description, 
              e.result
          FROM executor e
          JOIN requester r ON e.query_id = r.id
          LEFT JOIN approver a ON r.id = a.query_id
          WHERE e.executor_id = $1
          ORDER BY r.requested_at DESC`,
          [executorId]
      );

      console.log("✅ Queries found:", result.rows.length);
      res.json(result.rows);
  } catch (err) {
      console.error("❌ Error fetching executor queries:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 Fetch Approvers List
 */
app.get("/approvers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM users WHERE role = 'approver'"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching approvers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * 🔹 Update Query Status (Executor Execution)
 */
app.post("/executor/update-query-status", async (req, res) => {
  const { queryId, status, executorId } = req.body;

  if (!queryId || !status || !executorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const executedAt = new Date().toISOString();
    
    await pool.query(
      `UPDATE executor 
       SET status = $1, executed_by = $2, executed_at = $3 
       WHERE query_id = $4 AND executor_id = $5`,
      [status, executorId, executedAt, queryId, executorId]
    );

    res.json({ message: "Query execution status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating query status:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/*
 * 🔹 Start Server
 */
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
