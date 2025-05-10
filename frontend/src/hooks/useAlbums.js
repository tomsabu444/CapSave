import { useState, useEffect, useCallback } from 'react';
import albumApi from '../api/albumApi';

export default function useAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Load all albums
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await albumApi.getAlbums();
      setAlbums(data);
    } catch (err) {
      console.error('[useAlbums] fetch error', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
 // run on mount
  useEffect(() => {
    load();
  }, [load]);

  // 2️⃣ Create
  const add = async (name) => {
    try {
      const newAlbum = await albumApi.createAlbum(name);
      setAlbums(prev => [newAlbum, ...prev]);
      return newAlbum; // ✅ return for optional chaining
    } catch (err) {
      console.error('[useAlbums] create error', err);
      setError(err);
      throw err;
    }
  };

  // 3️⃣ Rename
  const rename = async (id, name) => {
    try {
      const updated = await albumApi.renameAlbum(id, name);
      setAlbums(prev =>
        prev.map(a => (a.albumId === id ? updated : a))
      );
      return updated;
    } catch (err) {
      console.error('[useAlbums] rename error', err);
      setError(err);
      throw err;
    }
  };

  // 4️⃣ Delete
  const remove = async (id) => {
    try {
      await albumApi.deleteAlbum(id);
      setAlbums(prev => prev.filter(a => a.albumId !== id));
    } catch (err) {
      console.error('[useAlbums] delete error', err);
      setError(err);
      throw err;
    }
  };

  return {
    albums,
    loading,
    error,
    add,
    rename,
    remove,
    reload: load,
  };
}
