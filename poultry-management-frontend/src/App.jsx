import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateBatch from "./components/CreateBatch";
import BatchList from "./components/BatchList";
import DataEntryForm from "./components/DataEntryForm";
import About from "./components/About";
import BatchDetails from "./components/BatchDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import { isAuthenticated, getStoredUser } from "./services/authService";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const storedUser = getStoredUser();
    if (storedUser && isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  // Public Route component (redirects to dashboard if already authenticated)
  const PublicRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register onRegister={handleLogin} />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navbar user={user} onLogout={handleLogout} />
                <div className="container mt-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-batch" element={<CreateBatch />} />
                    <Route path="/batch-list" element={<BatchList />} />
                    <Route path="/data-entry" element={<DataEntryForm />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/batch/:id" element={<BatchDetails />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
