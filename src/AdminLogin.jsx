import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import PropTypes from "prop-types";

function AdminLogin({ currentLang }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        navigate("/dashboard");
      } else {
        alert("You do not have admin privileges.");
      }
    } catch {
      alert("Invalid login credentials.");
    }
  };

  return (
    <div className="login-section">
      <h2>{t("nav.login")}</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{t("nav.login")}</button>
      </form>
    </div>
  );
}

AdminLogin.propTypes = {
  currentLang: PropTypes.string.isRequired,
};

export default AdminLogin;
