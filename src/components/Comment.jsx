import PropTypes from 'prop-types';
import { useState } from 'react';
import '../css/Comment.css';

const Comment = ({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleEdit = () => {
    onEdit(comment.id, editedText);
    setIsEditing(false);
  };

  return (
    <div className="comment-card">
      {isEditing ? (
        <div className="comment-edit-form">
          <input
            type="text"
            className="comment-edit-input"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button className="comment-edit-button" onClick={handleEdit}>Save</button>
          <button className="comment-edit-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <p><strong>{comment.username}</strong>: {comment.text}</p>
          <button className="comment-edit-button" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="comment-delete-button" onClick={() => onDelete(comment.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Comment;
