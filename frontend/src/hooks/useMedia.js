import { useState, useEffect, useCallback } from 'react';
import mediaApi from '../api/mediaApi';

export default function useMedia(albumId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load media when albumId changes
  const load = useCallback(async () => {
    if (!albumId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await mediaApi.fetchByAlbum(albumId);
      setItems(data);
      return data;
    } catch (e) {
      console.error('[useMedia] fetch error', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    load();
  }, [load]);

  // upload and append
  const upload = async (file) => {
    if (!albumId) throw new Error('albumId is required');
    setLoading(true);
    try {
      const newMedia = await mediaApi.upload(file, albumId);
      setItems(prev => [newMedia, ...prev]);
      return newMedia;
    } catch (e) {
      console.error('[useMedia] upload error', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // delete and remove
  const remove = async (mediaId) => {
    setLoading(true);
    try {
      await mediaApi.remove(mediaId);
      setItems(prev => prev.filter(m => m.mediaId !== mediaId));
    } catch (e) {
      console.error('[useMedia] delete error', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    reload: load,
    upload,
    remove,
  };
}
