import './i18n'; // Add this at the top
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Home from "./Home";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check Firebase auth state on mount/changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // Assumes a custom claim "admin" was set on the user
        setIsAdmin(idTokenResult.claims.admin || false);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public portfolio page */}
        <Route path="/" element={<Home />} />

        {/* Admin login page */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected dashboard (only for admin users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 
          You can add a catch-all or other routes here if desired.
          For example: <Route path="*" element={<NotFound />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
