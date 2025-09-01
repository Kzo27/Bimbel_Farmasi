import React, { useState, useEffect, useContext } from 'react'; // <-- Tambahkan useContext
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // <-- 1. Import Sidebar
import { AuthContext } from '../context/AuthContext'; // <-- 2. Import AuthContext

function InfoManagement() {
  const BACKEND_URL = 'http://localhost:5000'; 
  const { logout } = useContext(AuthContext); // <-- 3. Ambil fungsi logout

  const [infos, setInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInfos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/infos');
      const infosData = response.data.data || response.data || [];
      setInfos(Array.isArray(infosData) ? infosData : []);
    } catch (error) {
      console.error("Gagal mengambil data info:", error);
      setInfos([]);
      alert('Gagal mengambil data info dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageFile) {
      alert('Judul dan gambar tidak boleh kosong!');
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      await axios.post('/api/v1/infos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Info baru berhasil ditambahkan!');
      setTitle('');
      setImageFile(null);
      setImagePreview('');
      if(e.target) e.target.reset();
      fetchInfos();
    } catch (error) {
      console.error("Gagal menyimpan info:", error);
      alert('Gagal menyimpan info baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (infoId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus info ini?')) {
      try {
        await axios.delete(`/api/v1/infos/${infoId}`);
        alert('Info berhasil dihapus.');
        fetchInfos();
      } catch (error) {
        console.error("Gagal menghapus info:", error);
        alert('Gagal menghapus info.');
      }
    }
  };

  // --- 4. Bungkus return dengan layout Sidebar ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={logout} />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manajemen Info</h1>
          <p className="text-gray-600 mt-1">Tambah dan hapus info yang tampil di aplikasi mobile.</p>
        </header>

        {/* Form untuk menambah info baru */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tambah Info Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Info</label>
              <input
                id="title" type="text" value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Info Beasiswa Terbaru"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gambar Info (Rasio 19:9)</label>
              <input
                id="image" type="file" accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img src={imagePreview} alt="Preview" className="w-full md:w-1/2 rounded-lg object-cover aspect-[19/9]" />
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Info'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Daftar Info yang Sudah Ada */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daftar Info Tersimpan</h2>
          {loading ? (
            <p>Memuat data info...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(infos) && infos.map(info => (
                <div key={info._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
                  <div className="aspect-[19/9] w-full overflow-hidden">
                    <img 
                      src={`${BACKEND_URL}/uploads/${info.imageUrl}`} 
                      alt={info.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{info.title}</h3>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleDelete(info._id)} className="text-sm text-red-600 hover:underline">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default InfoManagement;