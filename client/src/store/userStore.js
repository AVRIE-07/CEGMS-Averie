import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  errorAddUser: null,
  errorEditUser: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  addUser: async (formData) => {
    set({ isLoading: true, errorAddUser: null });

    try {
      const response = await axios.post(`${API_URL}/users`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        emergency_contact_full_name: formData.emergency_contact_full_name,
        emergency_contact_number: formData.emergency_contact_number,
        password: formData.password,
        role: formData.role || "PE",
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        errorAddUser: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Error signing up";
      const errorCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      set({
        errorAddUser: {
          code: errorCode,
          message: errorMessage,
        },
        isLoading: false,
      });

      throw new Error(errorMessage);
    }
  },
  editUser: async (formData) => {
    set({ isLoading: true, errorEditUser: null });

    try {
      const response = await axios.put(`${API_URL}/users/${formData.id}`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        emergency_contact_full_name: formData.emergency_contact_full_name,
        emergency_contact_number: formData.emergency_contact_number,
        password: formData.password,
        role: formData.role || "PE",
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        errorEditUser: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Error updating user";
      const errorCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      set({
        errorEditUser: {
          code: errorCode,
          message: errorMessage,
        },
        isLoading: false,
      });

      throw new Error(errorMessage);
    }
  },
}));
