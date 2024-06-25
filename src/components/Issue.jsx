import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import Comment from './Comment';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../css/Issue.css';

const Issue = ({ issue, onDelete, onEdit, onVote }) => {
  const { comments, fetchComments, addComment, deleteComment, editComment } = useComments();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedDescription, setEditedDescription] = useState(issue.description);
  const [userVote, setUserVote] = useState(null);
  const [creatorUsername, setCreatorUsername] = useState('');

  // useEffect(() => {
  //   fetchComments(issue.id);
  // }, [fetchComments, issue.id]);

  useEffect(() => {
    if (user) {
      const userVoteObj = Array.isArray(issue.votes) && issue.votes.find(vote => vote.userId === user.uid);
      if (userVoteObj) {
        setUserVote(userVoteObj.vote);
      }
    }
  }, [user, issue.votes]);

  useEffect(() => {
    const fetchCreatorUsername = async () => {
      const userDoc = await getDoc(doc(db, 'users', issue.userId));
      if (userDoc.exists()) {
        setCreatorUsername(userDoc.data().username);
      } else {
        console.log(`User document does not exist for userId: ${issue.userId}`);
      }
    };
    fetchCreatorUsername();
  }, [issue.userId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      await addComment(issue.id, { text: commentText, username: user.username });
      setCommentText('');
      fetchComments(issue.id);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(issue.id, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (commentId, updatedText) => {
    try {
      await editComment(issue.id, commentId, { text: updatedText });
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleEdit = () => {
    onEdit(issue.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  const handleVote = (increment) => {
    if (userVote === increment) {
      onVote(issue.id, 0);
      setUserVote(null);
    } else {
      onVote(issue.id, increment);
      setUserVote(increment);
    }
  };

  const totalVotes = Array.isArray(issue.votes) ? issue.votes.reduce((sum, vote) => sum + vote.vote, 0) : 0;

  return (
    <div className="issue">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            className="issue-edit-input"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="issue-edit-textarea"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
          />
          <button className="issue-edit-button" onClick={handleEdit}>Save</button>
          <button className="issue-edit-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h3>{issue.title}</h3>
          <p className="creator-username">Created by: {creatorUsername}</p>
          <p>{issue.description}</p>
          {user.uid === issue.userId && (
            <>
              <button className="issue-edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="issue-edit-button" onClick={() => onDelete(issue.id)}>Delete</button>
            </>
          )}
          <button 
            className="issue-vote-button"
            onClick={() => handleVote(1)} 
            disabled={userVote === 1}
          >
            Upvote
          </button>
          <button 
            className="issue-vote-button"
            onClick={() => handleVote(-1)} 
            disabled={userVote === -1}
          >
            Downvote
          </button>
          <p>Votes: {totalVotes}</p>
        </>
      )}
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          className="issue-comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
        />
        <button className="issue-comment-button" type="submit">Add Comment</button>
      </form>
      <div className="comments">
        <h4>Comments</h4>
        {(comments[issue.id] || []).map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            onDelete={() => handleDeleteComment(comment.id)} 
            onEdit={handleEditComment}
          />
        ))}
      </div>
    </div>
  );
};

Issue.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    votes: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string.isRequired,
      vote: PropTypes.number.isRequired,
    })).isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
};

export default Issue;
