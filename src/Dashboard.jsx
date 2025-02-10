// Dashboard.js
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();

  // ---------------------
  // 1) Profile Picture
  // ---------------------
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

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
      console.error("Error updating profile picture:", error);
      alert("Failed to update the profile picture.");
    }
  };

  // ---------------------
  // 2) Comments Management
  // ---------------------
  const [comments, setComments] = useState([]);

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

  const updateStatus = async (id, status) => {
    const commentRef = doc(db, "comments", id);
    await updateDoc(commentRef, { status });
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, status } : comment))
    );
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    await deleteDoc(doc(db, "comments", id));
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // ---------------------
  // 3) Projects Management
  // ---------------------
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Form fields for a new or edited project
  const [newProjectEnTitle, setNewProjectEnTitle] = useState("");
  const [newProjectFrTitle, setNewProjectFrTitle] = useState("");
  const [newProjectEnDesc, setNewProjectEnDesc] = useState("");
  const [newProjectFrDesc, setNewProjectFrDesc] = useState("");
  const [newProjectEnTech, setNewProjectEnTech] = useState("");
  const [newProjectFrTech, setNewProjectFrTech] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectEnTitle.trim() || !newProjectFrTitle.trim()) {
      alert("Please fill in both EN and FR title fields.");
      return;
    }
    try {
      await addDoc(collection(db, "projects"), {
        title: {
          en: newProjectEnTitle,
          fr: newProjectFrTitle,
        },
        description: {
          en: newProjectEnDesc,
          fr: newProjectFrDesc,
        },
        technologies: {
          en: newProjectEnTech,
          fr: newProjectFrTech,
        },
        createdAt: serverTimestamp(),
      });
      alert("Project added!");
      // Clear form
      setNewProjectEnTitle("");
      setNewProjectFrTitle("");
      setNewProjectEnDesc("");
      setNewProjectFrDesc("");
      setNewProjectEnTech("");
      setNewProjectFrTech("");
      // Refresh
      const snapshot = await getDocs(collection(db, "projects"));
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setNewProjectEnTitle(project.title.en);
    setNewProjectFrTitle(project.title.fr);
    setNewProjectEnDesc(project.description.en);
    setNewProjectFrDesc(project.description.fr);
    setNewProjectEnTech(project.technologies.en);
    setNewProjectFrTech(project.technologies.fr);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editingProjectId) return;
    try {
      const docRef = doc(db, "projects", editingProjectId);
      await updateDoc(docRef, {
        title: { en: newProjectEnTitle, fr: newProjectFrTitle },
        description: { en: newProjectEnDesc, fr: newProjectFrDesc },
        technologies: { en: newProjectEnTech, fr: newProjectFrTech },
      });
      alert("Project updated!");
      setEditingProjectId(null);
      // Clear
      setNewProjectEnTitle("");
      setNewProjectFrTitle("");
      setNewProjectEnDesc("");
      setNewProjectFrDesc("");
      setNewProjectEnTech("");
      setNewProjectFrTech("");
      // Refresh
      const snapshot = await getDocs(collection(db, "projects"));
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("Project deleted!");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // ---------------------
  // 4) Skills Management
  // ---------------------
  const [skills, setSkills] = useState([]);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [newSkillEnLabel, setNewSkillEnLabel] = useState("");
  const [newSkillFrLabel, setNewSkillFrLabel] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      const snapshot = await getDocs(collection(db, "skills"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSkills(data);
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillEnLabel.trim() || !newSkillFrLabel.trim()) {
      alert("Please fill in both EN and FR label fields for the skill.");
      return;
    }
    try {
      await addDoc(collection(db, "skills"), {
        label: {
          en: newSkillEnLabel,
          fr: newSkillFrLabel,
        },
        createdAt: serverTimestamp(),
      });
      alert("Skill added!");
      // Clear
      setNewSkillEnLabel("");
      setNewSkillFrLabel("");
      // Refresh
      const snapshot = await getDocs(collection(db, "skills"));
      setSkills(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    setNewSkillEnLabel(skill.label.en);
    setNewSkillFrLabel(skill.label.fr);
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!editingSkillId) return;
    try {
      const docRef = doc(db, "skills", editingSkillId);
      await updateDoc(docRef, {
        label: { en: newSkillEnLabel, fr: newSkillFrLabel },
      });
      alert("Skill updated!");
      setEditingSkillId(null);
      // Clear
      setNewSkillEnLabel("");
      setNewSkillFrLabel("");
      // Refresh
      const snapshot = await getDocs(collection(db, "skills"));
      setSkills(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteDoc(doc(db, "skills", skillId));
      alert("Skill deleted!");
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  // ---------------------
  // 5) Logout
  // ---------------------
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* ====== PROFILE PICTURE ====== */}
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
        {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" />}
      </section>

      {/* ====== PROJECTS ====== */}
      <section>
        <h2>Manage Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>EN: {project.title.en}</strong> | FR: {project.title.fr}
              <br />
              <button onClick={() => handleEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>{editingProjectId ? "Edit Project" : "Add a New Project"}</h3>
        <form onSubmit={editingProjectId ? handleUpdateProject : handleAddProject}>
          <div>
            <label>Title (EN):</label>
            <input
              type="text"
              value={newProjectEnTitle}
              onChange={(e) => setNewProjectEnTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Title (FR):</label>
            <input
              type="text"
              value={newProjectFrTitle}
              onChange={(e) => setNewProjectFrTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Description (EN):</label>
            <textarea
              value={newProjectEnDesc}
              onChange={(e) => setNewProjectEnDesc(e.target.value)}
            />
          </div>
          <div>
            <label>Description (FR):</label>
            <textarea
              value={newProjectFrDesc}
              onChange={(e) => setNewProjectFrDesc(e.target.value)}
            />
          </div>
          <div>
            <label>Technologies (EN):</label>
            <input
              type="text"
              value={newProjectEnTech}
              onChange={(e) => setNewProjectEnTech(e.target.value)}
            />
          </div>
          <div>
            <label>Technologies (FR):</label>
            <input
              type="text"
              value={newProjectFrTech}
              onChange={(e) => setNewProjectFrTech(e.target.value)}
            />
          </div>
          <button type="submit">{editingProjectId ? "Update Project" : "Add Project"}</button>
        </form>
      </section>

      {/* ====== SKILLS ====== */}
      <section>
        <h2>Manage Skills</h2>
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>
              <strong>EN: {skill.label.en}</strong> | FR: {skill.label.fr}
              <br />
              <button onClick={() => handleEditSkill(skill)}>Edit</button>
              <button onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>{editingSkillId ? "Edit Skill" : "Add a New Skill"}</h3>
        <form onSubmit={editingSkillId ? handleUpdateSkill : handleAddSkill}>
          <div>
            <label>Label (EN):</label>
            <input
              type="text"
              value={newSkillEnLabel}
              onChange={(e) => setNewSkillEnLabel(e.target.value)}
            />
          </div>
          <div>
            <label>Label (FR):</label>
            <input
              type="text"
              value={newSkillFrLabel}
              onChange={(e) => setNewSkillFrLabel(e.target.value)}
            />
          </div>
          <button type="submit">{editingSkillId ? "Update Skill" : "Add Skill"}</button>
        </form>
      </section>

      {/* ====== COMMENTS ====== */}
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

export default Dashboard;
