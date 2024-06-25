import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'comments'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = {};
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', data.userId));
        const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
        if (!commentsData[data.issueId]) {
          commentsData[data.issueId] = [];
        }
        commentsData[data.issueId].push({ id: docSnap.id, ...data, username });
      }
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchComments = async (issueId) => {
    const q = query(collection(db, 'comments'), where('issueId', '==', issueId));
    const snapshot = await getDocs(q);
    const commentsData = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', data.userId));
        const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
        return { id: docSnap.id, ...data, username };
      })
    );
    setComments(prev => ({ ...prev, [issueId]: commentsData }));
    console.log("Fetched comments for issue with usernames:", commentsData);
  };

  const addComment = async (issueId, comment) => {
    if (!user) return;
    console.log("Adding comment with user:", user.username);
    await addDoc(collection(db, 'comments'), { ...comment, userId: user.uid, issueId, username: user.username });
    fetchComments(issueId); // Fetch comments again to update state
  };

  const deleteComment = async (issueId, commentId) => {
    if (!user) return;
    await deleteDoc(doc(db, 'comments', commentId));
    setComments(prev => ({
      ...prev,
      [issueId]: prev[issueId].filter(comment => comment.id !== commentId)
    }));
  };

  const editComment = async (issueId, commentId, updatedComment) => {
    if (!user) return;
    await updateDoc(doc(db, 'comments', commentId), updatedComment);
    setComments(prev => ({
      ...prev,
      [issueId]: prev[issueId].map(comment => comment.id === commentId ? { ...comment, ...updatedComment } : comment)
    }));
  };

  return (
    <CommentContext.Provider value={{ comments, fetchComments, addComment, deleteComment, editComment }}>
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
