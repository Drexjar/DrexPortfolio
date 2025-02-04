// Dashboard.js
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

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

  // Fetch the current profile picture URL from settings
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "homepage"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setProfilePictureUrl(data.profilePicture || "");
      }
    };
    fetchSettings();
  }, []);

  // Update the profile picture URL in Firestore
  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(db, "settings", "homepage"),
        { profilePicture: profilePictureUrl },
        { merge: true }
      );
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
      alert("Failed to update the profile picture.");
    }
  };

  // Approve / Mark pending for comments
  const updateStatus = async (id, status) => {
    const commentRef = doc(db, "comments", id);
    await updateDoc(commentRef, { status });
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, status } : comment
      )
    );
  };

  // Delete a comment
  const deleteComment = async (id) => {
    const commentRef = doc(db, "comments", id);
    await deleteDoc(commentRef);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
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

      {/* Manage Profile Picture */}
      <section>
        <h2>Manage Profile Picture</h2>
        <form onSubmit={handleProfilePictureUpdate}>
          <input
            type="text"
            placeholder="Enter new profile picture URL"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />
          <button type="submit">Update Picture</button>
        </form>
        {profilePictureUrl && (
          <img src={profilePictureUrl} alt="Profile" />
        )}
      </section>

      {/* Manage Comments */}
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
  onLogout: PropTypes.func, // Optional, can be removed if unused
};

export default Dashboard;
