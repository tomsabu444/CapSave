import React, { useState, useEffect } from 'react';

export default function AlbumForm({ title, initialName, onSubmit, onCancel }) {
  const [name, setName]   = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialName);
    setError('');
  }, [initialName]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Album name cannot be empty.');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="bg-white p-6 rounded-xl w-80 shadow-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Album name"
        className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg border border-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
        >
          {title.startsWith('Create') ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
}
