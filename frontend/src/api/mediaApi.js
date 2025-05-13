import axios from 'axios';
import { API_BASE_URL } from '../config/apiconfig';
import { getFirebaseToken } from '../utils/firebaseToken';

const api = axios.create({
  baseURL: `${API_BASE_URL}/v1/media`,
});

// attach Firebase token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getFirebaseToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[mediaApi] could not get Firebase token', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const mediaApi = {
    // upload a file to an album
  upload: async (file, albumId) => {
    const form = new FormData();
    form.append('mediaFile', file);
    form.append('albumId', albumId);
    const res = await api.post('/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data; // { mediaId, albumId, userId, mediaType, mediaUrl, ... }
  },

  // fetch all media in an album with pagination
  fetchByAlbum: async (albumId, page = 1, limit = 20) => {
    try {
      const res = await api.get(`/${albumId}`, {
        params: { page, limit },
      });
      return res.data;
    } catch (err) {
      console.error('[mediaApi] Fetch error:', err);
      throw err;
    }
  },

    // delete a single media item
  remove: async (mediaId) => {
    const res = await api.delete(`/${mediaId}`);
    return res.data;
  },
};

export default mediaApi;
