// src/context/UserProvider.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, setDoc, getDocs, query, where, doc } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0]?.data();
        setUser({ ...currentUser, username: userData?.username });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, confirmPassword, username) => {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email,
      username,
    });
    setUser({ ...newUser, username });
  };

  const signIn = async (identifier, password) => {
    let email;
    if (identifier.includes('@')) {
      email = identifier;
    } else {
      const q = query(collection(db, 'users'), where('username', '==', identifier));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('No user found with this username');
      }
      email = querySnapshot.docs[0].data().email;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => signOut(auth);

  return (
    <UserContext.Provider value={{ user, signUp, signIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
