import { useEffect } from 'react';
import { useIssues } from '../hooks/useIssues';
import { useAuth } from '../hooks/useAuth';
import Issue from './Issue';
import '../css/Profile.css';

const Profile = () => {
  const { issues, fetchIssues, deleteIssue, editIssue, voteOnIssue } = useIssues();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [fetchIssues, user]);

  return (
    <div className="profile">
      <h2>Welcome, {user?.username}!</h2>
      <p>Manage your magical issues and comments here.</p>
      <h3>My Issues</h3>
      {issues.filter(issue => issue.userId === user.uid).map(issue => (
        <Issue
          key={issue.id}
          issue={issue}
          onDelete={deleteIssue}
          onEdit={editIssue}
          onVote={voteOnIssue}
        />
      ))}
    </div>
  );
};

export default Profile;
