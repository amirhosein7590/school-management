import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  resetToken: "",
  phone: "",
  userName: "",
  setResetToken: (token) => set((state) => ({ resetToken: token })),
  setPhone: (p) => set((state) => ({ phone: p })),
  setUserName: (uName) => set((state) => ({ userName: uName })),
}));

export default useAuthStore;
