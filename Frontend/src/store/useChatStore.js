import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            if (res && res.data) {
                set({ users: res.data });
            } else {
                console.error('No data received from /messages/users');
            }

        } catch (error) {
            if (error.response) {
                console.error('Server error:', error.response.data.message);
                toast.error(error.response.data.message);

            } else if (error.request) {
                console.error('Network error:', error.message);
                toast.error('Network error, please try again later.');

            } else {
                console.error('Error:', error.message);
                toast.error('Something went wrong.');
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async(userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            set({ messages: [...messages, res.data] });
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subsribeToMessage: () => {
        const socket = useAuthStore.getState().socket;

        if (socket) {
            socket.on("newMessage", (newMessage) => {
                const { messages } = get();
                set({
                    messages: [...messages, newMessage],
                });
            });
        }
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },
    
    reconnectOnMessage: () => {
        const socket = useAuthStore.getState().socket;

        if (socket) {
            socket.on("connect_error", () => {
                console.log("Reconnecting...");
                socket.connect();
            });
        }
    },
    
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
