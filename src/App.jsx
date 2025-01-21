import { useState, useEffect } from "react";
import "./App.css";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path if your firebase.js is elsewhere

function App() {
  const [comments, setComments] = useState([]); // State to store all comments
  const [newComment, setNewComment] = useState(""); // State for the new comment input

  // Fetch comments from Firestore when the app loads
  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, "comments"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(data);
    };
    fetchComments();
  }, []);

  // Add a new comment to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Ignore empty submissions

    // Save the new comment to Firestore
    await addDoc(collection(db, "comments"), {
      text: newComment,
      createdAt: serverTimestamp(),
    });

    setNewComment(""); // Clear the input field

    // Re-fetch comments to display the new one (for simplicity, not real-time)
    const snapshot = await getDocs(collection(db, "comments"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComments(data);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Jarred Portfolio Demo</h1>
        <div className="links">
          <a href="https://github.com/Drexjar" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="www.linkedin.com/in/jarred-donaldson-75638a32b" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>

        <section className="comments-section">
          <h2>Comments:</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <p>© 2025 Jarred Portfolio. Built with React and Firebase.</p>
      </footer>
    </div>
  );
}

export default App;
