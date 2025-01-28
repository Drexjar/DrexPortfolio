import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function Home() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture] = useState("public/Images/1728364921486.jpg");
  // Fetch public comments from Firestore
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

  // Submit new comment (default "pending" status)
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
    alert("Comment submitted for review!");
  };

  return (
    <div className="app-container">
      <header>
        <h1>Jarred Portfolio</h1>
        <div className="links">
          <a
            href="https://github.com/Drexjar"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jarred-donaldson-75638a32b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          {/* Link to the admin login page (separate route) */}
          <a href="/admin" className="admin-view-link">
            Admin View
          </a>
        </div>
      </header>

      {/* About Me Section */}
      <section className="about-me">
        <img src={profilePicture} alt="Jarred Donaldson" />
        <div>
          <h2>About Me</h2>
          <p>
            Hi, I’m Jarred! I’m a Computer Science student at Champlain
            College Saint-Lambert. I’m passionate about developing
            innovative solutions, designing intuitive interfaces, and
            delivering impactful results. I’ve worked on a variety of
            projects ranging from pet clinic management systems to
            modernizing business platforms. Outside of tech, I’m a football
            team member and love tackling challenges both on and off the
            field.
          </p>
          <a
            href="public/Documents/Jarred_Donaldson_CV.pdf"
            download
            className="download-btn"
          >
            Download My CV
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects">
        <h2>Projects</h2>
        <div className="project">
          <h3>C CLEAN INC. Digital Platform</h3>
          <p>
            Modernizing company operations with a centralized platform for
            CRM and employee scheduling.
            <br />
            <strong>Technologies:</strong> React, Spring Boot, Agile
            Methodologies
          </p>
        </div>
        <div className="project">
          <h3>Pet Clinic Management System</h3>
          <p>
            A microservices-based veterinary management system. Contributed
            to both front-end (React) and back-end (Spring Boot)
            development.
            <br />
            <strong>Technologies:</strong> React, Spring Boot, CI/CD
            Pipelines
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <h2>Skills</h2>
        <ul>
          <li>Programming: Java, JavaScript, C#, SQL, HTML, CSS</li>
          <li>Frameworks: React, Spring Boot, .NET, Unity</li>
          <li>Tools: Docker, Azure, CI/CD Pipelines</li>
          <li>Database Design and Administration</li>
          <li>Mobile Development: iOS & Android</li>
          <li>Agile/Scrum Development</li>
        </ul>
      </section>

      {/* Comments Section */}
      <section className="comments-section">
        <h2>Testimonials/Comments</h2>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Submit</button>
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
        <p>© 2025 Jarred Portfolio. Built with React and Firebase.</p>
      </footer>
    </div>
  );
}

export default Home;
