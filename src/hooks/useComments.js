// src/hooks/useComments.js
import { useContext } from 'react';
import { CommentContext } from '../context/CommentProvider';

export const useComments = () => {
  return useContext(CommentContext);
};
