import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  errorLogin: null,
  errorForgotPassword: null,
  errorResetPassword: null,
  errorChangePassword: null,
  error: null,
  errorSignup: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  userId: null,

  signup: async (formData) => {
    set({ isLoading: true, errorSignup: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        country: formData.country,
        region: formData.region,
        city: formData.city,
        address: formData.address,
        zip_code: formData.zip_code,
        emergency_contact_full_name: formData.emergency_contact_full_name,
        emergency_contact_number: formData.emergency_contact_number,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        errorSignup: null,
        isLoading: false,
        role: response.data.user.role,
      });

      const userId = response.data.user.user_id;
      localStorage.setItem("user_id", userId);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Error signing up";
      const errorCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      set({
        errorSignup: {
          code: errorCode,
          message: errorMessage,
        },
        isLoading: false,
      });

      throw new Error(errorMessage);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, errorLogin: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        errorLogin: null,
        isLoading: false,
        role: response.data.user.role,
      });
      localStorage.setItem("user_id", response.data.user.user_id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "An unexpected error occurred";
      const errorCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";

      set({
        errorLogin: {
          code: errorCode,
          message: errorMessage,
        },
        isLoading: false,
      });

      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        role: null,
        isLoading: false,
      });
      localStorage.removeItem("user_id");
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        role: response.data.user.role,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        role: response.data.user.role,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, errorForgotPassword: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });

      set({
        message: response.data.message, // Success message
        errorForgotPassword: null, // Clear error
        isLoading: false, // Stop loading
      });
    } catch (error) {
      const errorCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
      const errorMessage =
        error.response?.data?.error?.message ||
        "Error sending reset password email";

      set({
        isLoading: false,
        errorForgotPassword: {
          code: errorCode,
          message: errorMessage,
        },
      });
      throw new Error(errorMessage); // Propagate the error to the calling component
    }
  },

  resetPassword: async (token, password, confirmPassword) => {
    set({ isLoading: true, errorResetPassword: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error resetting password";

      set({
        isLoading: false,
        errorResetPassword: errorMessage,
      });
      throw new Error(errorMessage); // Propagate the error to the calling component
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const { userId } = useAuthStore.getState();
    console.log("User ID from auth store:", userId);

    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    set({ isLoading: true, errorChangePassword: null });
    try {
      const response = await axios.post(`${API_URL}/change-password`, {
        userId, // Send the user ID
        currentPassword,
        newPassword,
        confirmPassword,
      });

      set({
        message: response.data.message, // Success message
        errorChangePassword: null, // Clear error
        isLoading: false, // Stop loading
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error changing password";

      set({
        isLoading: false,
        errorChangePassword: errorMessage,
      });
      throw new Error(errorMessage); // Propagate the error to the calling component
    }
  },
}));
