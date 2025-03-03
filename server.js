// server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Pool } = require('pg');

// const app = express();
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   ssl: false // Disable SSL for local development
// });

// app.use(cors({ origin: '*' })); // Adjust for security in production
// app.use(express.json()); // Express now has built-in JSON parser

// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, role',
//       [name, email, hashedPassword, role]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body; // Changed from username to email
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Middleware for Authentication
// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied' });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// // Server Listening
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: false,
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

  const user = result.rows[0];
  if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    role: user.role,
    userId: user.id,
    name: user.name, // ✅ Include name in response
  });
});


app.post("/submit-query", async (req, res) => {
  const { requesterId, dbName, query, queryDescription, approverName } = req.body;

  if (!requesterId || !dbName || !query || !queryDescription || !approverName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO requester (db_name, query, query_description, requested_at, approver_name, status, approved_by) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING id",
      [dbName, query, queryDescription, approverName, "Pending", requesterId]
    );

    res.status(201).json({ message: "Query submitted successfully", queryId: result.rows[0].id });
  } catch (err) {
    console.error("Error submitting query:", err);
    res.status(500).json({ error: "Error submitting query" });
  }
});


// Fetch Queries for Logged-in Requester
app.get("/requester/:requesterId", async (req, res) => {
  const { requesterId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, db_name, query, query_description, requested_at, approver_name, approved_by, status FROM requester WHERE approved_by = $1 ORDER BY requested_at DESC",
      [requesterId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching queries" });
  }
});

// Fetch Queries for Approver
app.get("/approver/:approverId", async (req, res) => {
  const { approverId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM approver WHERE approver_id = $1 ORDER BY requested_at DESC",
      [approverId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching approval queries" });
  }
});

// Fetch Queries for Executor
app.get("/executor/:executorId", async (req, res) => {
  const { executorId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM executor WHERE executor_id = $1 ORDER BY requested_at DESC",
      [executorId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching execution queries" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));











// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Pool } = require('pg');

// const app = express();
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   ssl: false  // Add this line
// });

// app.use(cors());
// app.use(bodyParser.json());

// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { username, password, email, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     const result = await pool.query(
//       'INSERT INTO users (name, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id, name, role',
//       [username, hashedPassword, email, role]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $3', [email]);
//     if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Middleware for Authentication
// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied' });
//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // ===============================


// // require("dotenv").config();
// // const express = require("express");
// // const bcrypt = require("bcrypt");
// // const jwt = require("jsonwebtoken");
// // const { Pool } = require("pg");
// // const cors = require("cors");

// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASS,
// //   port: process.env.DB_PORT,
// // });

// // const secretKey = process.env.JWT_SECRET;

// // // Signup
// // app.post("/api/auth/signup", async (req, res) => {
// //   const { username, password, role } = req.body;
// //   const hashedPassword = await bcrypt.hash(password, 10);
  
// //   try {
// //     await pool.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", [username, hashedPassword, role]);
// //     res.json({ message: "User registered successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Login
// // app.post("/api/auth/login", async (req, res) => {
// //   const { username, password } = req.body;
// //   const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  
// //   if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
// //     return res.status(401).json({ error: "Invalid credentials" });
// //   }

// //   const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, secretKey);
// //   res.json({ token });
// // });

// // // Middleware to verify JWT
// // const authenticate = (req, res, next) => {
// //   const token = req.headers["authorization"];
// //   if (!token) return res.status(403).json({ error: "Access denied" });

// //   try {
// //     const verified = jwt.verify(token, secretKey);
// //     req.user = verified;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ error: "Invalid token" });
// //   }
// // };

// // // Submit Query (Requester)
// // app.post("/api/requester/query", authenticate, async (req, res) => {
// //   const { title, description, database, server } = req.body;
// //   await pool.query("INSERT INTO queries (title, description, database, server, status, requester_id) VALUES ($1, $2, $3, $4, 'pending', $5)", [title, description, database, server, req.user.id]);
// //   res.json({ message: "Query submitted successfully" });
// // });

// // // Approve or Reject Query
// // app.post("/api/approver/query/:id/action", authenticate, async (req, res) => {
// //   if (req.user.role !== "approver") return res.status(403).json({ error: "Unauthorized" });
  
// //   const { action } = req.body; // action can be 'approved' or 'rejected'
// //   await pool.query("UPDATE queries SET status = $1 WHERE id = $2", [action, req.params.id]);
// //   res.json({ message: `Query ${action}` });
// // });

// // // Executor Marks Query as Completed
// // app.post("/api/executor/query/:id/complete", authenticate, async (req, res) => {
// //   if (req.user.role !== "executor") return res.status(403).json({ error: "Unauthorized" });
  
// //   await pool.query("UPDATE queries SET status = 'completed' WHERE id = $1", [req.params.id]);
// //   res.json({ message: "Query marked as completed" });
// // });

// // app.listen(5000, () => console.log("Server running on port 5000"));
