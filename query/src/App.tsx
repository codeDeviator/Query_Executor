
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import RequesterPage from "./pages/RequesterPage";
import ApproverPage from "./pages/ApproverPage";
import ExecutorPage from "./pages/ExecutorPage";
import RequesterFormPage from "./pages/RequesterFormPage";
import QueryDetailsPage from "./pages/QueryDetailsPage";
import ApproverDetailsPage from "./pages/ApproverDetailsPage";

const API_BASE_URL = "http://localhost:5000";

// 🔹 Get auth headers for authenticated requests
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return { Authorization: `Bearer ${user?.token}` };
};

const HomePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔹 Password validation (Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // 🔹 Redirect user based on role
  const navigateByRole = (userRole: string) => {
    switch (userRole) {
      case "requester":
        navigate("/requester");
        break;
      case "approver":
        navigate("/approver");
        break;
      case "executor":
        navigate("/executor");
        break;
      default:
        setError("Invalid role assigned");
    }
  };

  // 🔹 Handle Login & Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

        const userData = {
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // Store role-specific IDs separately
        if (response.data.role === "approver") {
          localStorage.setItem("approverId", response.data.userId);
        } else if (response.data.role === "executor") {
          localStorage.setItem("executorId", response.data.userId);
        }

        navigateByRole(response.data.role);
      } else {
        if (!validatePassword(password)) {
          setError(
            "Password must be at least 8 characters long, contain uppercase, lowercase letters, a number, and a special character."
          );
          return;
        }

        await axios.post(`${API_BASE_URL}/signup`, { name, email, password, role });
        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        localStorage.removeItem("user");
        setError("Session expired. Please log in again.");
        navigate("/");
      } else {
        setError(error.response?.data?.error || "Something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Login" : "Signup"}
          </h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-sm text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 border rounded-lg" required>
                <option value="">Select Role</option>
                <option value="requester">Requester</option>
                <option value="approver">Approver</option>
                <option value="executor">Executor</option>
              </select>
            </div>
          )}

          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-300">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline text-sm">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/requester" element={<ProtectedRoute><RequesterPage /></ProtectedRoute>} />
        <Route path="/approver" element={<ProtectedRoute><ApproverPage /></ProtectedRoute>} />
        <Route path="/executor" element={<ProtectedRoute><ExecutorPage /></ProtectedRoute>} />
        <Route path="/create-query" element={<ProtectedRoute><RequesterFormPage /></ProtectedRoute>} />
        <Route path="/query/:queryId" element={<ProtectedRoute><QueryDetailsPage /></ProtectedRoute>} />
        <Route path="/approver/:queryId" element={<ProtectedRoute><ApproverDetailsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

// 🔹 Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.token) {
      navigate("/");
    }
  }, [navigate]);

  return children;
};

export default App;