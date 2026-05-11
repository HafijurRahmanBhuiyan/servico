import { createContext, useContext, useState } from "react";
import { getProviderAppByUserId } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("servico_user")); } catch { return null; }
  });

  const signIn = async (email, password) => {
    if (email === "admin@servico.com" && password === "admin123") {
      const adminUser = { id: "admin", name: "Admin", email, role: "admin" };
      setUser(adminUser);
      localStorage.setItem("servico_user", JSON.stringify(adminUser));
      return { error: null, role: "admin" };
    }
    const mockUser = { id: "u1", name: "Demo User", email };
    setUser(mockUser);
    localStorage.setItem("servico_user", JSON.stringify(mockUser));
    return { error: null };
  };

  const signUp = async (email, password, fullName, phone) => {
    const mockUser = { id: "u2", name: fullName, email, phone };
    setUser(mockUser);
    localStorage.setItem("servico_user", JSON.stringify(mockUser));
    return { error: null };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("servico_user");
  };

  const isAdmin = user?.role === "admin";
  const providerApplication = user && !isAdmin ? getProviderAppByUserId(user.id) : null;
  const isProvider = !!providerApplication;
  const providerStatus = providerApplication?.status ?? null;

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAdmin, isProvider, providerStatus, providerApplication }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
