import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");

  // Fetch all comments for admin management
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

  // Approve / Mark pending
  const updateStatus = async (id, status) => {
    const commentRef = doc(db, "comments", id);
    await updateDoc(commentRef, { status });
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, status } : comment
      )
    );
  };

  // Delete comment
  const deleteComment = async (id) => {
    const commentRef = doc(db, "comments", id);
    await deleteDoc(commentRef);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  // Simulate a profile picture upload (you’d use Firebase Storage in production)
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newProfilePicture = URL.createObjectURL(file);
    setProfilePicture(newProfilePicture);

    alert("Profile picture updated successfully!");
  };

  // Logout and navigate to homepage
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/"); // Navigate directly to the homepage
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <h2>Manage Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
        {profilePicture && <img src={profilePicture} alt="Profile" />}
      </section>

      <section>
        <h2>Manage Comments</h2>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>
                <strong>
                  {comment.firstName} {comment.lastName}:
                </strong>{" "}
                {comment.text}
              </p>
              <p>Status: {comment.status}</p>
              <button onClick={() => updateStatus(comment.id, "public")}>
                Approve
              </button>
              <button onClick={() => updateStatus(comment.id, "pending")}>
                Mark as Pending
              </button>
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

Dashboard.propTypes = {
  onLogout: PropTypes.func, // Optional, can remove if not used
};

export default Dashboard;
