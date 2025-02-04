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
  // 1) Set up i18n
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // 2) Firestore state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // 3) Profile picture from Firestore
  const [profilePicture, setProfilePicture] = useState("public/Images/1728364921486.jpg");

  // 4) Fetch public comments
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

  // 5) Fetch the profile picture URL from Firestore settings
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "homepage"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setProfilePicture(data.profilePicture || "public/Images/1728364921486.jpg");
      }
    };
    fetchSettings();
  }, []);

  // 6) Submit new comment
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
      status: "pending", // new comments default to pending
      createdAt: serverTimestamp(),
    });

    setNewComment("");
    setFirstName("");
    setLastName("");
    alert(t("comments.alert")); // Use translation for "Comment submitted..."
  };

  // 7) Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <h1>{t("header.title")}</h1>
        <div className="links">
          {/* Language Switcher */}
          <div className="language-switcher">
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("fr")}>FR</button>
          </div>

          <a
            href="https://github.com/Drexjar"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("header.github")}
          </a>
          <a
            href="https://www.linkedin.com/in/jarred-donaldson-75638a32b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("header.linkedin")}
          </a>
          {/* Admin View */}
          <a href="/admin" className="admin-view-link">
            {t("header.adminView")}
          </a>
        </div>
      </header>

      {/* About Me Section */}
      <section className="about-me">
        <img src={profilePicture} alt="Jarred Donaldson" />
        <div>
          <h2>{t("aboutMe.title")}</h2>
          <p>{t("aboutMe.description")}</p>

          {/* Example: language-specific CV link */}
          <a
            href={
              currentLang === "fr"
                ? "public/Documents/Jarred_Donaldson_CV_FR.pdf"
                : "public/Documents/Jarred_Donaldson_CV_EN.pdf"
            }
            download
            className="download-btn"
          >
            {t("aboutMe.downloadCV")}
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects">
        <h2>{t("projects.title")}</h2>
        <div className="project">
          <h3>{t("projects.project1.title")}</h3>
          <p>
            {t("projects.project1.description")}
            <br />
            <strong>{t("projects.project1.technologies")}</strong>
          </p>
        </div>
        <div className="project">
          <h3>{t("projects.project2.title")}</h3>
          <p>
            {t("projects.project2.description")}
            <br />
            <strong>{t("projects.project2.technologies")}</strong>
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <h2>{t("skills.title")}</h2>
        <ul>
          {t("skills.items", { returnObjects: true }).map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Comments Section */}
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

      {/* Footer */}
      <footer>
        <p>{t("footer.text")}</p>
      </footer>
    </div>
  );
}

export default Home;
