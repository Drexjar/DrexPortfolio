// Home.js
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

function Home() {
  // 1) i18n
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // 2) Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // 3) Profile picture
  const [profilePicture, setProfilePicture] = useState(
    "/public/Images/1728364921486.jpg"
  );

  // 4) Projects & Skills (Firestore)
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // -- Fetch public comments
  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, "comments"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Only show comments with status "public"
      setComments(data.filter((comment) => comment.status === "public"));
    };
    fetchComments();
  }, []);

  // -- Fetch profile picture from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "homepage"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setProfilePicture(
          data.profilePicture || "/public/Images/1728364921486.jpg"
        );
      }
    };
    fetchSettings();
  }, []);

  // -- Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // -- Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      const snapshot = await getDocs(collection(db, "skills"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSkills(data);
    };
    fetchSkills();
  }, []);

  // 5) Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !firstName.trim() || !lastName.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    await addDoc(collection(db, "comments"), {
      text: newComment,
      firstName,
      lastName,
      status: "pending", // new comments are pending by default
      createdAt: serverTimestamp(),
    });
    setNewComment("");
    setFirstName("");
    setLastName("");
    alert(t("comments.alert"));
  };

  // 6) Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header>
        <h1>{t("header.title")}</h1>
        <div className="links">
          <div className="language-switcher">
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("fr")}>FR</button>
          </div>
          <a href="https://github.com/Drexjar" target="_blank" rel="noreferrer">
            {t("header.github")}
          </a>
          <a
            href="https://www.linkedin.com/in/jarred-donaldson-75638a32b/"
            target="_blank"
            rel="noreferrer"
          >
            {t("header.linkedin")}
          </a>
          <a href="/admin" className="admin-view-link">
            Login
          </a>
        </div>
      </header>

      {/* ABOUT ME */}
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

      {/* PROJECTS */}
      <section className="projects">
        <h2>{t("projects.title")}</h2>
        {projects.map((project) => {
          // Each project doc has {title: {en, fr}, description: {en, fr}, technologies: {en, fr}}
          const title = project.title?.[currentLang] || "";
          const description = project.description?.[currentLang] || "";
          const technologies = project.technologies?.[currentLang] || "";
          return (
            <div className="project" key={project.id}>
              <h3>{title}</h3>
              <p>
                {description}
                <br />
                <strong>{technologies}</strong>
              </p>
            </div>
          );
        })}
      </section>

      {/* SKILLS */}
      <section className="skills">
        <h2>{t("skills.title")}</h2>
        <ul>
          {skills.map((skill) => {
            // skill.label.en, skill.label.fr
            const label = skill.label?.[currentLang] || "";
            return <li key={skill.id}>{label}</li>;
          })}
        </ul>
      </section>

      {/* COMMENTS */}
      <section className="comments-section">
        <h2>{t("comments.title")}</h2>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder={t("comments.firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("comments.lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("comments.comment")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">{t("comments.submit")}</button>
        </form>

        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>
                {comment.firstName} {comment.lastName}: {comment.text}
              </p>
              <p>
                {comment.createdAt?.seconds &&
                  new Date(comment.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* FOOTER */}
      <footer>
        <p>{t("footer.text")}</p>
      </footer>
    </div>
  );
}

export default Home;
