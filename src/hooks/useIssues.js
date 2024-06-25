import { useContext } from 'react';
import { IssueContext } from '../context/IssueProvider';

export const useIssues = () => {
  const { issues, fetchIssues, addIssue, deleteIssue, editIssue, voteOnIssue } = useContext(IssueContext);
  return { issues, fetchIssues, addIssue, deleteIssue, editIssue, voteOnIssue };
};
