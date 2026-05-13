import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiRegister, fetchMyProviderApplication } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("servico_user"));
      if (u && u.status === "suspended") {
        localStorage.removeItem("servico_user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return null;
      }
      return u;
    } catch {
      return null;
    }
  });

  // ── signIn ──────────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    // 1. Authenticate against PostgreSQL via backend
    const result = await apiLogin(email, password);
    if (!result.error) {
      // Reject suspended users
      if (result.user.status === "suspended") {
        localStorage.removeItem("servico_user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return { error: "You are suspended" };
      }

      // Normalise backend user shape (full_name → name) for frontend consistency
      const sessionUser = {
        id: result.user.id,
        name: result.user.full_name || result.user.name || "",
        email: result.user.email,
        phone: result.user.phone || "",
        role: result.user.role || "customer",
      };
      setUser(sessionUser);
      localStorage.setItem("servico_user", JSON.stringify(sessionUser));
      if (sessionUser.role === "admin") return { error: null, role: "admin" };
      return { error: null };
    }

    return result;
  };

  // ── signUp ──────────────────────────────────────────────────────────────────
  const signUp = async (email, password, fullName, phone) => {
    const result = await apiRegister(email, password, fullName, phone);
    if (result.error) return result;

    // Auto-login after successful registration
    const loginResult = await apiLogin(email, password);
    if (!loginResult.error) {
      const sessionUser = {
        id: loginResult.user.id,
        name: loginResult.user.full_name || loginResult.user.name || "",
        email: loginResult.user.email,
        phone: loginResult.user.phone || "",
        role: loginResult.user.role || "customer",
      };
      setUser(sessionUser);
      localStorage.setItem("servico_user", JSON.stringify(sessionUser));
    }

    return { error: null };
  };

  // ── signOut ─────────────────────────────────────────────────────────────────
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("servico_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // ── changeAdminPassword ─────────────────────────────────────────────────────
  const changeAdminPassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:8000/api/me/change-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Failed to change password" };
    return { error: null };
  };

  const [providerApplication, setProviderApplication] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const refreshProviderApp = () => setRefreshTick((t) => t + 1);

  useEffect(() => {
    if (user && user.role !== "admin") {
      fetchMyProviderApplication().then(setProviderApplication);
    } else {
      setProviderApplication(null);
    }
  }, [user, refreshTick]);

  // Poll for status changes every 30s while user has a pending application
  useEffect(() => {
    if (!user || user.role === "admin" || !providerApplication) return;
    const id = setInterval(refreshProviderApp, 30000);
    return () => clearInterval(id);
  }, [user, providerApplication]);

  const isAdmin = user?.role === "admin";
  const isProvider = user?.role === "provider";
  const providerStatus = providerApplication?.status ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        changeAdminPassword,
        refreshProviderApp,
        isAdmin,
        isProvider,
        providerStatus,
        providerApplication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
