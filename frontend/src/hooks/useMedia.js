import { useState, useEffect, useCallback } from 'react';
import mediaApi from '../api/mediaApi';

export default function useMedia(albumId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const load = useCallback(async (pageToLoad = 1, append = false) => {
    if (!albumId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await mediaApi.fetchByAlbum(albumId, pageToLoad, limit);
      if (append) {
        setItems(prev => [...prev, ...data]);
      } else {
        setItems(data);
      }
      setHasMore(data.length === limit);
      return data;
    } catch (e) {
      console.error('[useMedia] fetch error', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    const nextPage = page + 1;
    await load(nextPage, true);
    setPage(nextPage);
  }, [loading, hasMore, page, load]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    load(1);
  }, [albumId, load]);

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
    loadMore,
    hasMore,
  };
}