import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '../services/firebase';

// GoogleSignin is not available on web
let GoogleSignin = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (e) {
    console.warn('GoogleSignin not available:', e.message);
  }
}

let GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID;
try {
  const env = require('@env');
  GOOGLE_WEB_CLIENT_ID = env.GOOGLE_WEB_CLIENT_ID;
  GOOGLE_IOS_CLIENT_ID = env.GOOGLE_IOS_CLIENT_ID;
} catch (e) {
  GOOGLE_WEB_CLIENT_ID = '';
  GOOGLE_IOS_CLIENT_ID = '';
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driverDocuments, setDriverDocuments] = useState({});

  useEffect(() => {
    if (GoogleSignin) {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = { uid: firebaseUser.uid, ...userSnap.data() };
            setUser(userData);
            setIsAuthenticated(true);

            if (userData.userType === 'driver') {
              const docsRef = doc(db, 'driverDocuments', firebaseUser.uid);
              const docsSnap = await getDoc(docsRef);
              if (docsSnap.exists()) {
                setDriverDocuments({ [firebaseUser.uid]: docsSnap.data() });
              }
            }

            await AsyncStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        const cachedUser = await AsyncStorage.getItem('user');
        const cachedDocs = await AsyncStorage.getItem('driverDocuments');

        if (cachedDocs) {
          setDriverDocuments(JSON.parse(cachedDocs));
        }

        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        throw new Error('User data not found. Please sign up again.');
      }

      const userData = { uid: firebaseUser.uid, ...userSnap.data() };
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      if (userData.userType === 'driver') {
        const docsRef = doc(db, 'driverDocuments', firebaseUser.uid);
        const docsSnap = await getDoc(docsRef);
        if (docsSnap.exists()) {
          const docs = { [firebaseUser.uid]: docsSnap.data() };
          setDriverDocuments(docs);
          await AsyncStorage.setItem('driverDocuments', JSON.stringify(docs));
        }
      }

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Invalid credentials';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      else if (error.code === 'auth/invalid-credential') message = 'Invalid email or password';
      throw new Error(message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();

      if (!data?.idToken) {
        throw new Error('Google sign-in was cancelled');
      }

      const credential = GoogleAuthProvider.credential(data.idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      let userData;

      if (!userSnap.exists()) {
        userData = {
          name: data.user?.name || '',
          email: data.user?.email || '',
          phone: '',
          userType: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, userData);
        userData = { uid: firebaseUser.uid, ...userData };
      } else {
        userData = { uid: firebaseUser.uid, ...userSnap.data() };
      }

      await AsyncStorage.setItem('user', JSON.stringify(userData));

      if (userData.userType === 'driver') {
        const docsRef = doc(db, 'driverDocuments', firebaseUser.uid);
        const docsSnap = await getDoc(docsRef);
        if (docsSnap.exists()) {
          const docs = { [firebaseUser.uid]: docsSnap.data() };
          setDriverDocuments(docs);
          await AsyncStorage.setItem('driverDocuments', JSON.stringify(docs));
        }
      }

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with this email. Please sign in with email/password.');
      }
      throw new Error(error.message || 'Google sign-in failed');
    }
  };

  const signup = async (userData) => {
    try {
      const { name, email, phone, password, userType } = userData;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userProfile = {
        name,
        email,
        phone,
        userType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

      if (userType === 'driver') {
        await setDoc(doc(db, 'driverDocuments', firebaseUser.uid), {});
      }

      return { uid: firebaseUser.uid, ...userProfile };
    } catch (error) {
      console.error('Signup error:', error);
      let message = 'Signup failed';
      if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      else if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      if (GoogleSignin) {
        try { await GoogleSignin.signOut(); } catch (e) { /* ignore on web */ }
      }
      await signOut(auth);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('driverDocuments');
      setUser(null);
      setIsAuthenticated(false);
      setDriverDocuments({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      if (!user?.uid) throw new Error('You must be logged in');

      const userDocRef = doc(db, 'users', user.uid);

      const updatePayload = Object.keys(userData).reduce((acc, key) => {
        const value = userData[key];
        if (typeof value === 'object' && value !== null && !value.seconds) {
          acc[key] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
      updatePayload.updatedAt = serverTimestamp();

      await updateDoc(userDocRef, updatePayload);

      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const uploadDriverDocument = async (documentType, fileData) => {
    try {
      if (!user?.uid) throw new Error('You must be logged in');

      const storageRef = ref(
        storage,
        `driver-documents/${user.uid}/${documentType}`
      );

      const response = await fetch(fileData.uri);
      const blob = await response.blob();

      await uploadBytesResumable(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      const docRef = doc(db, 'driverDocuments', user.uid);

      const userDocs = driverDocuments[user.uid] || {};
      const updatedUserDocs = {
        ...userDocs,
        [documentType]: {
          name: fileData.name,
          size: fileData.size,
          mimeType: fileData.mimeType,
          url: downloadURL,
          status: 'uploaded',
          uploadedAt: serverTimestamp(),
        },
      };

      await setDoc(docRef, updatedUserDocs, { merge: true });

      const updatedAllDocs = {
        ...driverDocuments,
        [user.uid]: updatedUserDocs,
      };

      setDriverDocuments(updatedAllDocs);
      await AsyncStorage.setItem('driverDocuments', JSON.stringify(updatedAllDocs));

      return updatedUserDocs;
    } catch (error) {
      console.error('Upload driver document error:', error);
      throw error;
    }
  };

  const submitDriverVerification = async () => {
    try {
      if (!user?.uid) throw new Error('You must be logged in');

      const userDocs = driverDocuments[user.uid] || {};
      const requiredDocs = ['driversLicense', 'vehicleRegistration', 'idDocument'];
      const hasAllRequired = requiredDocs.every((docType) => !!userDocs[docType]);

      if (!hasAllRequired) {
        throw new Error('Upload all required documents first');
      }

      const submittedDocs = Object.keys(userDocs).reduce((acc, key) => {
        acc[key] = {
          ...userDocs[key],
          status: 'under_review',
          submittedAt: serverTimestamp(),
        };
        return acc;
      }, {});

      const docRef = doc(db, 'driverDocuments', user.uid);
      await setDoc(docRef, submittedDocs, { merge: true });

      await updateDoc(doc(db, 'users', user.uid), {
        verificationStatus: 'under_review',
        updatedAt: serverTimestamp(),
      });

      const updatedAllDocs = {
        ...driverDocuments,
        [user.uid]: submittedDocs,
      };

      setDriverDocuments(updatedAllDocs);
      await AsyncStorage.setItem('driverDocuments', JSON.stringify(updatedAllDocs));

      return submittedDocs;
    } catch (error) {
      console.error('Submit verification error:', error);
      throw error;
    }
  };

  const getDriverVerification = () => {
    if (!user?.uid) return {};
    return driverDocuments[user.uid] || {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateUser,
        uploadDriverDocument,
        submitDriverVerification,
        getDriverVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
