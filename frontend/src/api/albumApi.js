// src/api/albumApi.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiconfig';
import { getFirebaseToken } from '../utils/firebaseToken';

// 1️⃣ Create an axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/albums`,
  headers: { 'Content-Type': 'application/json' },
});

// 2️⃣ Attach Firebase token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getFirebaseToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[albumApi] could not get Firebase token', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const albumApi = {
  /** List all albums for current user */
  getAlbums: async () => {
    const res = await api.get('/');
    return res.data; // array of { albumId, userId, albumName, createdAt, updatedAt }
  },

  /** Create a new album */
  createAlbum: async (albumName) => {
    const res = await api.post('/', { albumName });
    return res.data;
  },

  /** Rename an album */
  renameAlbum: async (albumId, albumName) => {
    const res = await api.put(`/${albumId}`, { albumName });
    return res.data;
  },

  /** Delete an album and its media */
  deleteAlbum: async (albumId) => {
    const res = await api.delete(`/${albumId}`);
    return res.data; // { message: 'Album deleted' }
  },
};

export default albumApi;
