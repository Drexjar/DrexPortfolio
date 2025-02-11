// App.js
import './i18n';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Home from "./Home";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Contact from "./Contact"; // Import the new Contact component

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

        {/* Contact page */}
        <Route path="/contact" element={<Contact />} />

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

        {/* You can add more routes or a catch-all route here */}
      </Routes>
    </Router>
  );
}

export default App;
