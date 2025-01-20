import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    IsSignUp: false,
    isLoggingIn: false,
    IsUpdateProfile: false,
    IsCheckingAuth: true,
    onlineUsers: [], // Initialize with an empty array
    setOnlineUsers: (users) => set({ onlineUsers: users }),
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            get().connectsocket();
        } catch (error) {
            console.log("Error is ", error);
            set({ authUser: null });
        } finally {
            set({ IsCheckingAuth: false });
        }
    },

    signUp: async(userData) => {
        try {
            const res = await axiosInstance.post("/auth/signup", userData);
            set({ authUser: res.data });
            toast.success("Sign up Successfully");

            setTimeout(() => {
                get().connectsocket();
            }, 0);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    login: async(data) => {
        try {
            const res = await axiosInstance.post("/auth/Login", data);
            set({ authUser: res.data });
            toast.success("Login Sucessfully");

            setTimeout(() => {
                get().connectsocket();
            }, 0);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("auth/Logout");
            set({ authUser: null });

            toast.success("Logout Sucessfully");
            get().disconnectsocket();
        } catch (error) {
            toast.error("Error in Logout");
            console.log("Error in Logout is", error);
        }
    },

    connectsocket: () => {
        const { authUser, socket } = get();
        if (!authUser || (socket && socket.connected)) return;

        const socketInstance = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });

        socketInstance.connect();
        set({ socket: socketInstance });

        socketInstance.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socketInstance.on("connect_error", () => {
            console.log("Reconnecting...");
            socketInstance.connect();
        });
    },

    disconnectsocket: () => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
    updateProfile: async(updatedData) => {
        try {
            set({ IsUpdateProfile: true }); // Set loading state
            const res = await axiosInstance.put("/auth/updateProfile", updatedData);

            // Update the authUser state with the new data
            set((state) => ({
                authUser: {...state.authUser, ...res.data },
            }));

            toast.success("Profile updated successfully!");
        } catch (error) {
            const errorMessage =
                error &&
                error.response &&
                error.response.data &&
                error.response.data.message ?
                error.response.data.message :
                "Failed to update profile";
            toast.error(errorMessage);
            console.log("Error updating profile:", error);
        } finally {
            set({ IsUpdateProfile: false }); // Reset loading state
        }
    },
}));