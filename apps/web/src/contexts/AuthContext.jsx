
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pb.authStore.isValid && pb.authStore.model) {
        try {
          // Verify the user record still exists in the database
          const user = await pb.collection('users').getOne(pb.authStore.model.id, { $autoCancel: false });
          setCurrentUser(user);
          setUserRole(user.role);
        } catch (error) {
          console.error("Auth verification failed:", handlePocketBaseError(error));
          // If user is deleted or inaccessible (404/403), clear the invalid auth state
          pb.authStore.clear();
          setCurrentUser(null);
          setUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setUserRole(authData.record.role);
      return authData.record;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    isAuthenticated: pb.authStore.isValid,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
