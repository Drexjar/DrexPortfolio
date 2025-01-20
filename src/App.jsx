import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function App() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // Fetch all comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, 'comments'));
      const commentsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsArray);
    };
    fetchComments();
  }, []);

  // Add a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await addDoc(collection(db, 'comments'), {
      text: comment,
      createdAt: new Date()
    });
    setComment('');
    // Optional: re-fetch or just push to local state
    const snapshot = await getDocs(collection(db, 'comments'));
    setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Jarred Portfolio</h1>
      <p>Hello World! This is a simple React + Firebase test.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Comments:</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
