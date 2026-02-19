import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types";
import { apiLogin, apiSignup, apiGetMe, apiGetAllUsers, apiDeleteUser } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "bookxchange_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing token and restore session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      apiGetMe()
        .then((data) => setCurrentUser(data.user))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await apiSignup(name, email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await apiGetAllUsers();
    } catch {
      return [];
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    await apiDeleteUser(userId);
  };

  const value: AuthContextType = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    loading,
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
