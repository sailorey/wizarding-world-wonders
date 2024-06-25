import { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/IssueForm.css';

const IssueForm = ({ addIssue }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() === '' || formData.description.trim() === '') {
      setMessage('Both fields are required.');
      return;
    }

    addIssue(formData);
    setFormData({ title: '', description: '' });
    setMessage('Issue successfully added!');
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <form className="issue-form" onSubmit={handleSubmit}>
      {message && <p className="message">{message}</p>}
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Issue Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Issue Description"
        required
      />
      <button type="submit">Add Issue</button>
    </form>
  );
};

IssueForm.propTypes = {
  addIssue: PropTypes.func.isRequired,
};

export default IssueForm;
