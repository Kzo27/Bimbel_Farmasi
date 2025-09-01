import React, { useState, useEffect } from 'react';

function ChapterForm({ onSubmit, initialData = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setVideoFile(null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (videoFile) {
      formData.append('video', videoFile);
    }
    
    if (initialData?._id) {
      formData.append('_id', initialData._id);
    }

    onSubmit(formData);
    // HAPUS PANGGILAN onClose() DI SINI
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Judul Bab</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Masukkan judul bab..." 
          required 
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Deskripsi singkat tentang bab..." 
          rows="4"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Unggah Video</label>
        <input 
          type="file" 
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])} 
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <button 
          type="submit"
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          {initialData ? 'Simpan Perubahan' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}

export default ChapterForm;