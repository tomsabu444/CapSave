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

  // fetch all media in an album
  fetchByAlbum: async (albumId) => {
    const res = await api.get(`/${albumId}`);
    return res.data; // array of media items
  },

  // delete a single media item
  remove: async (mediaId) => {
    const res = await api.delete(`/${mediaId}`);
    return res.data; // { message: 'Media deleted' }
  },
};

export default mediaApi;
