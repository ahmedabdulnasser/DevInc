import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
  user: JSON.parse(localStorage.getItem("user")) || null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  isLoggedIn: Boolean(localStorage.getItem("token")) || false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));

export default useAuthStore;
