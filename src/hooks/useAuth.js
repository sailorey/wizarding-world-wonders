// src/hooks/useAuth.js
import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';

export const useAuth = () => {
  return useContext(UserContext);
};
