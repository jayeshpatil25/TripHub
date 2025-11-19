// src/store/useChatStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { axiosInstance } from '../api';

const socket = io('https://triphub-backend-3x8e.onrender.com'); // Make sure backend is running here

export const useChatStore = create((set, get) => ({
  messages: [],
  typingUsers: [],
  socket,
  authUser: null, //  store it

  initSocketListeners: (tripId, authUser) => {
    set({ authUser }); //  set in store
    socket.emit('join-trip', { tripId, userId: authUser._id });

    socket.off('receive-message').on('receive-message', (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socket.off('typing').on('typing', ({ user }) => {
      if (user._id !== authUser._id) {
        set((state) => ({
          typingUsers: [...new Set([...state.typingUsers, user.name])],
        }));
      }
    });

    socket.off('stop-typing').on('stop-typing', ({ user }) => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((u) => u !== user.name),
      }));
    });

    get().fetchMessages(tripId);
  },

  fetchMessages: async (tripId) => {
    try {
      const res = await axiosInstance.get(`/trips/${tripId}`);
      set({ messages: res.data.messages || [] });
    } catch (err) {
      console.error('Error loading messages', err);
    }
  },

  sendMessage: (tripId, text) => {
    const userId = get().authUser?._id;
    if (!userId || !text) return;
    socket.emit('send-message', {
      tripId,
      userId,
      text, //  only send text
    });
  },

  emitTyping: (tripId, user) => {
    socket.emit('typing', { tripId, user });
  },

  emitStopTyping: (tripId, user) => {
    socket.emit('stop-typing', { tripId, user });
  },
}));
