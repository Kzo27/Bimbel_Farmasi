import React, { useState, useEffect } from 'react';

function SubjectForm({ onSubmit, initialData = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...initialData,
      title,
      description,
    };
    
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Judul Mata Pelajaran</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul mata pelajaran..."
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat tentang mata pelajaran..."
          required
          rows="4"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}

export default SubjectForm;