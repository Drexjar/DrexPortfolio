import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import "./App.css";

export default function NavBar({ toggleLanguage, currentLang }) {
  const { t } = useTranslation();
  const location = useLocation();

  const active = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <header className="main-nav">
      <h1>{t("header.title")}</h1>

      <nav className="nav-links">
        <button onClick={toggleLanguage} className="lang-btn">
          {currentLang === "en" ? "FR" : "EN"}
        </button>

        <Link to="/" className={active("/")}>
          {t("Home")}
        </Link>
        <Link to="/contact" className={active("/contact")}>
          {t("Contact")}
        </Link>
        <a
          href="https://github.com/Drexjar"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jarred-donaldson-75638a32b/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <Link to="/admin" className={active("/admin")}>
          {t("Login")}
        </Link>
      </nav>
    </header>
  );
}

/* ----- PropTypes ----- */
NavBar.propTypes = {
  toggleLanguage: PropTypes.func.isRequired,
  currentLang: PropTypes.string.isRequired,
};
