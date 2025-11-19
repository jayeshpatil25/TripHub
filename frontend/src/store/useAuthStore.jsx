import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../api';
import { toast } from 'react-toastify';

export const useAuthStore = create(persist(
  (set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogginIn: false,

    setAuthUser: (user) => set({ authUser: user }),

    checkAuth: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return set({ authUser: null });

      try {
        const res = await axiosInstance.get('/auth/check-auth');
        set({ authUser: res.data.user });
        return res.data.user;
      } catch (error) {
        localStorage.removeItem('authToken');
        set({ authUser: null });
        return null;
      }
    },

    signup: async (data, navigate) => {
      set({ isSigningUp: true });
      try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(data.email)) {
          toast.error("Please enter a valid Gmail address");
          return;
        }
        const response = await axiosInstance.post('/auth/register', data);
        set({ authUser: response.data.user });
        toast.success("Account created successfully");
        navigate('/dashboard');
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.message || "Signup failed";
        toast.error(errorMsg);
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async (data, navigate) => {
      set({ isLogginIn: true });
      try {
        const response = await axiosInstance.post(
          '/auth/login',
          data,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        localStorage.setItem('authToken', response.data.token);
        set({ authUser: response.data.user });
        toast.success("Logged in successfully");
        navigate('/');
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.message || "Login failed";
        toast.error(errorMsg);
      } finally {
        set({ isLogginIn: false });
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully');
      } catch (error) {
        toast.error("Unable to logout");
      }
    },

    updateProfile: async (data) => {
      try {
        const res = await axiosInstance.put('/user/update', data);
        set({ authUser: res.data.user });
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      }
    },

    updatePassword: async ({ currentPassword, newPassword }) => {
      try {
        const res = await axiosInstance.put('/user/password', {
          currentPassword,
          newPassword,
        });
        toast.success(res.data.msg || 'Password updated successfully');
      } catch (error) {
        const err = error.response?.data?.msg || 'Failed to change password';
        toast.error(err);
      }
    },

    uploadProfilePicture: async (file) => {
      try {
        const formData = new FormData();
        formData.append("profilePic", file);

        const res = await axiosInstance.post("/user/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        set({ authUser: res.data.user });
        toast.success("Profile picture updated");
      } catch (err) {
        toast.error("Failed to upload profile picture");
      }
    },

    deleteProfilePicture: async () => {
      try {
        const res = await axiosInstance.delete("/user/profile-picture");
        set({ authUser: res.data.user });
        toast.success("Profile picture removed");
      } catch (err) {
        toast.error("Failed to remove profile picture");
      }
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({ authUser: state.authUser }),
  }
));




