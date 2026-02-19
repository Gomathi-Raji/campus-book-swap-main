import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "bookxchange_users";
const CURRENT_USER_KEY = "bookxchange_current_user";

// Default admin user
const DEFAULT_ADMIN: User = {
  id: "admin-001",
  name: "Admin User",
  email: "admin@campus.edu",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

// Default demo users
const DEFAULT_USERS: User[] = [
  DEFAULT_ADMIN,
  {
    id: "user-001",
    name: "Riya Sharma",
    email: "riya@campus.edu",
    password: "password123",
    role: "user",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-002",
    name: "Arjun Mehta",
    email: "arjun@campus.edu",
    password: "password123",
    role: "user",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-003",
    name: "Priya Nair",
    email: "priya@campus.edu",
    password: "password123",
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const storedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default users
      setUsers(DEFAULT_USERS);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    }

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Persist users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  // Persist current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const signup = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    // Check for duplicate email
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Validate password length
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getAllUsers = () => {
    return users.filter((u) => u.role !== "admin");
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const value: AuthContextType = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    login,
    signup,
    logout,
    getAllUsers,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
