import "./i18n";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import NavBar from "./NavBar";
import Home from "./Home";
import Contact from "./Contact";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

/**
 *  App – the top‑level router wrapper
 */
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  // Detect admin claim once
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setIsAdmin(false);
      const { claims } = await user.getIdTokenResult();
      setIsAdmin(!!claims.admin);
    });
    return unsub;
  }, []);

  const toggleLanguage = () =>
    setCurrentLang((prev) => (prev === "en" ? "fr" : "en"));

  return (
    <Router>
      <NavBar toggleLanguage={toggleLanguage} currentLang={currentLang} />

      {/* Lazy routes wrapped in Suspense to avoid first‑load blanks */}
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Routes>
          <Route
            path="/"
            element={<Home currentLang={currentLang} />}
          />

          <Route path="/contact" element={<Contact currentLang={currentLang} />} />
          <Route path="/admin" element={<AdminLogin currentLang={currentLang} />}/>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* fallback route */}
          <Route path="*" element={<Home currentLang={currentLang} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
