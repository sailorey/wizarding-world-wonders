import { useEffect } from 'react';
import { useIssues } from '../hooks/useIssues';
import Issue from './Issue';
import IssueForm from './IssueForm';
import '../css/IssueList.css';

const IssueList = () => {
  const { issues, fetchIssues, addIssue, deleteIssue, editIssue, voteOnIssue } = useIssues();

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <div className="container issue-list">
      <h2>Issues</h2>
      <IssueForm addIssue={addIssue} />
      {issues.map(issue => (
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

export default IssueList;
