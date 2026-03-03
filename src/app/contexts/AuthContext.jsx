import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fivepigs_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const isAdmin = !!user && user.role === 'admin';

  const login = (email, password) => {
    const usersData = localStorage.getItem('fivepigs_users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Admin hard-code
    if (email === 'admin@fivepigs.com' && password === 'admin123') {
      const adminUser = { id: 'admin', email, name: 'Admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(adminUser));
      return true;
    }

    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const loggedInUser = { id: found.id, email: found.email, name: found.name, role: 'customer' };
      setUser(loggedInUser);
      localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));
      return true;
    }

    return false;
  };

  const register = (email, password, name) => {
    const usersData = localStorage.getItem('fivepigs_users');
    const users = usersData ? JSON.parse(usersData) : [];

    // email existed?
    if (users.some((u) => u.email === email)) return false;

    const newUser = { id: Date.now().toString(), email, password, name, role: 'customer' };
    users.push(newUser);
    localStorage.setItem('fivepigs_users', JSON.stringify(users));

    const loggedInUser = { id: newUser.id, email: newUser.email, name: newUser.name, role: 'customer' };
    setUser(loggedInUser);
    localStorage.setItem('fivepigs_user', JSON.stringify(loggedInUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fivepigs_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
