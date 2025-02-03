import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function Home() {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture] = useState("public/Images/1728364921486.jpg");
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, "comments"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(data.filter((comment) => comment.status === "public"));
    };
    fetchComments();
  }, []);

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
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setNewComment("");
    setFirstName("");
    setLastName("");
    alert(t('comments.alert'));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="app-container">
      <header>
        <h1>{t('header.title')}</h1>
        <div className="links">
          <div className="language-switcher">
            <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('fr')}>FR</button>
          </div>
          <a
            href="https://github.com/Drexjar"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('header.github')}
          </a>
          <a
            href="https://www.linkedin.com/in/jarred-donaldson-75638a32b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('header.linkedin')}
          </a>
          <a href="/admin" className="admin-view-link">
            {t('header.adminView')}
          </a>
        </div>
      </header>

      <section className="about-me">
        <img src={profilePicture} alt="Jarred Donaldson" />
        <div>
          <h2>{t('aboutMe.title')}</h2>
          <p>{t('aboutMe.description')}</p>
          <a
            href={currentLang === 'en' 
              ? "public/Documents/Jarred_Donaldson_CV_EN.pdf" 
              : "public/Documents/Jarred_Donaldson_CV_FR.pdf"}
            download
            className="download-btn"
          >
            {t('aboutMe.downloadCV')}
          </a>
        </div>
      </section>

      <section className="projects">
        <h2>{t('projects.title')}</h2>
        <div className="project">
          <h3>{t('projects.project1.title')}</h3>
          <p>
            {t('projects.project1.description')}
            <br />
            <strong>{t('projects.project1.technologies')}</strong>
          </p>
        </div>
        <div className="project">
          <h3>{t('projects.project2.title')}</h3>
          <p>
            {t('projects.project2.description')}
            <br />
            <strong>{t('projects.project2.technologies')}</strong>
          </p>
        </div>
      </section>

      <section className="skills">
        <h2>{t('skills.title')}</h2>
        <ul>
          {t('skills.items', { returnObjects: true }).map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="comments-section">
        <h2>{t('comments.title')}</h2>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder={t('comments.firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t('comments.lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t('comments.comment')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">{t('comments.submit')}</button>
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

      <footer>
        <p>{t('footer.text')}</p>
      </footer>
    </div>
  );
}

export default Home;