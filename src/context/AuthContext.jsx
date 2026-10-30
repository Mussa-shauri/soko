import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Passwords are never saved as plain text
async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => load("users", []));
  const [currentId, setCurrentId] = useState(() => load("currentUserId", null));
  const currentUser = users.find((u) => u.id === currentId) || null;

  const saveUsers = (list) => {
    setUsers(list);
    localStorage.setItem("users", JSON.stringify(list));
  };

  const setSession = (id) => {
    setCurrentId(id);
    localStorage.setItem("currentUserId", JSON.stringify(id));
  };

  const register = async (data) => {
    const email = data.email.trim().toLowerCase();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "This email is already registered." };
    }
    const { password, confirm, ...rest } = data;
    const user = { ...rest, email, id: Date.now(), passwordHash: await hash(password) };
    saveUsers([...users, user]);
    setSession(user.id);
    return { ok: true };
  };

  const login = async (email, password) => {
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.passwordHash !== (await hash(password))) {
      return { ok: false, error: "Wrong email or password." };
    }
       setSession(user.id);
    return { ok: true, user };
  };

  const logout = () => {
    setCurrentId(null);
    localStorage.removeItem("currentUserId");
  };

  const updateProfile = (changes) =>
    saveUsers(users.map((u) => (u.id === currentId ? { ...u, ...changes } : u)));

  return (
    <AuthContext.Provider value={{ users, currentUser, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);