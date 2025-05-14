import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";
import PropTypes from "prop-types";

/**
 * Home – public portfolio
 * ▸ props.currentLang comes from App
 */
export default function Home({ currentLang }) {
  const { t, i18n } = useTranslation();

  /* keep i18n in sync with parent language */
  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  // --- Firestore state
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [comments, setComments] = useState([]);

  // --- form data
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [newComment, setNewComment] = useState("");

  // --- profile picture
  const [profilePicture, setProfilePicture] = useState("/Images/default.jpg");

  /* fetch everything once on mount */
  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "projects")),
      getDocs(collection(db, "skills")),
      getDocs(collection(db, "comments")),
      getDoc(doc(db, "settings", "homepage")),
    ]).then(([projSnap, skillSnap, commentSnap, settingsDoc]) => {
      setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setSkills(skillSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setComments(
        commentSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((c) => c.status === "public")
      );
      if (settingsDoc.exists()) {
        setProfilePicture(
          settingsDoc.data().profilePicture || "/Images/default.jpg"
        );
      }
    });
  }, []);

  /* add comment */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !newComment) return;
    await addDoc(collection(db, "comments"), {
      firstName,
      lastName,
      text: newComment,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    setFirst("");
    setLast("");
    setNewComment("");
    alert(t("comments.alert"));
  };

  return (
    <div className="page-content">
      {/* ---------- ABOUT ME ---------- */}
      <section className="about-me">
        <img src={profilePicture} alt="Profile" />
        <div>
          <h2>{t("aboutMe.title")}</h2>
          <p>{t("aboutMe.description")}</p>
          <a
            href="/Documents/Jarred_Donaldson_CV.pdf"
            download
            className="download-btn"
          >
            {t("aboutMe.downloadCV")}
          </a>
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section className="projects">
        <h2>{t("projects.title")}</h2>

        {projects.length === 0 && (
          <p className="empty-note">{t("projects.none")}</p>
        )}

        {projects.map((p) => {
          const title = p.title?.[currentLang] || "";
          const desc = p.description?.[currentLang] || "";
          const tech = p.technologies?.[currentLang] || "";
          return (
            <article key={p.id} className="project-card">
              <header>
                <h3>{title}</h3>
                <div className="project-links">
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noreferrer">
                      {t("projects.live")}
                    </a>
                  )}
                  {p.codeUrl && (
                    <a href={p.codeUrl} target="_blank" rel="noreferrer">
                      {t("projects.code")}
                    </a>
                  )}
                </div>
              </header>

              <p>{desc}</p>
              <p className="tech-stack">{tech}</p>
            </article>
          );
        })}
      </section>

      {/* ---------- SKILLS ---------- */}
      <section className="skills">
        <h2>{t("skills.title")}</h2>
        <ul>
          {skills.map((s) => (
            <li key={s.id}>{s.label?.[currentLang]}</li>
          ))}
        </ul>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="comments-section">
        <h2>{t("comments.title")}</h2>

        <form onSubmit={handleSubmit} className="comment-form">
          <input
            placeholder={t("comments.firstName")}
            value={firstName}
            onChange={(e) => setFirst(e.target.value)}
          />
          <input
            placeholder={t("comments.lastName")}
            value={lastName}
            onChange={(e) => setLast(e.target.value)}
          />
          <input
            placeholder={t("comments.comment")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button>{t("comments.submit")}</button>
        </form>

        <div className="review-grid">
          {comments.map((c) => (
            <div key={c.id} className="review-card">
              <p className="review-meta">
                <strong>
                  {c.firstName} {c.lastName}
                </strong>{" "}
                ·{" "}
                {c.createdAt?.seconds
                  ? new Date(c.createdAt.seconds * 1000).toLocaleDateString()
                  : ""}
              </p>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer>
        <p>{t("footer.text")}</p>
      </footer>
    </div>
  );
}

/* ----- PropTypes (ESLint happy) ----- */
Home.propTypes = {
  currentLang: PropTypes.string.isRequired,
};
