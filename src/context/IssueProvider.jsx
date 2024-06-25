import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc, deleteDoc, doc, query, updateDoc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const q = query(collection(db, 'issues'));
    const querySnapshot = await getDocs(q);
    const issuesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      votes: Array.isArray(doc.data().votes) ? doc.data().votes : []
    }));
    setIssues(issuesData);
  };

  const addIssue = async (issue) => {
    if (!user) return;
    await addDoc(collection(db, 'issues'), { ...issue, userId: user.uid, votes: [] });
    fetchIssues();
  };

  const deleteIssue = async (issueId) => {
    if (!user) return;
    await deleteDoc(doc(db, 'issues', issueId));
    fetchIssues();
  };

  const editIssue = async (issueId, updatedIssue) => {
    if (!user) return;
    await updateDoc(doc(db, 'issues', issueId), updatedIssue);
    fetchIssues();
  };

  const voteOnIssue = async (issueId, increment) => {
    if (!user) return;

    const issueDocRef = doc(db, 'issues', issueId);
    const userVoteDocRef = doc(issueDocRef, 'votes', user.uid);

    const userVoteDoc = await getDoc(userVoteDocRef);

    if (userVoteDoc.exists()) {
      const currentVote = userVoteDoc.data().vote;
      if (currentVote !== increment) {
        await updateDoc(userVoteDocRef, { vote: increment });
      } else {
        await deleteDoc(userVoteDocRef);
      }
    } else {
      await setDoc(userVoteDocRef, { vote: increment });
    }

    const issueDoc = await getDoc(issueDocRef);
    if (issueDoc.exists()) {
      let votes = issueDoc.data().votes;
      if (!Array.isArray(votes)) {
        votes = [];
      }
      if (increment === 0) {
        votes = votes.filter(vote => vote.userId !== user.uid);
      } else {
        const existingVoteIndex = votes.findIndex(vote => vote.userId === user.uid);
        if (existingVoteIndex >= 0) {
          votes[existingVoteIndex].vote = increment;
        } else {
          votes.push({ userId: user.uid, vote: increment });
        }
      }
      await updateDoc(issueDocRef, { votes: votes });
    }

    fetchIssues();
  };

  return (
    <IssueContext.Provider value={{ issues, fetchIssues, addIssue, deleteIssue, editIssue, voteOnIssue }}>
      {children}
    </IssueContext.Provider>
  );
};

IssueProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
