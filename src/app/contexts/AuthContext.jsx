import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load session from localStorage
    const savedUserId = localStorage.getItem('fivepigs_session');
    if (savedUserId) {
      api.get(`/users/${savedUserId}`).then(userData => {
        if (userData) {
          setUser(userData);
        }
      }).catch(err => {
        console.error("Failed to restore session", err);
        localStorage.removeItem('fivepigs_session');
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const users = await api.get(`/users?email=${email}&password=${password}`);
      if (users && users.length > 0) {
        const loggedInUser = users[0];
        setUser(loggedInUser);
        localStorage.setItem('fivepigs_session', loggedInUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      const existingUsers = await api.get(`/users?email=${email}`);
      if (existingUsers && existingUsers.length > 0) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: 'customer',
        cart: [],
        wishlist: []
      };

      const createdUser = await api.post('/users', newUser);
      setUser(createdUser);
      localStorage.setItem('fivepigs_session', createdUser.id);

      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fivepigs_session');
  };

  const resetPassword = async (email, newPassword) => {
    try {
      if (email === 'admin@fivepigs.com') {
        return false;
      }

      const existingUsers = await api.get(`/users?email=${email}`);
      if (!existingUsers || existingUsers.length === 0) {
        return false;
      }

      const userToUpdate = existingUsers[0];
      await api.patch(`/users/${userToUpdate.id}`, { password: newPassword });
      
      return true;
    } catch (error) {
      console.error("Password reset failed", error);
      return false;
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user) return false;

      // Check if new email already exists (if email changed)
      if (updatedData.email !== user.email) {
        const existingUsers = await api.get(`/users?email=${updatedData.email}`);
        if (existingUsers && existingUsers.length > 0) {
          return false;
        }
      }

      const updatedUser = await api.patch(`/users/${user.id}`, {
        name: updatedData.name,
        email: updatedData.email
      });

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Profile update failed", error);
      return false;
    }
  };

  // Keep API synchronization for internal state updates (like cart/wishlist)
  const syncUserSession = async () => {
    if (user) {
      try {
        const updatedUser = await api.get(`/users/${user.id}`);
        setUser(updatedUser);
      } catch (err) {}
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
      syncUserSession,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
