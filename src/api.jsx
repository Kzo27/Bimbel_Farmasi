import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Interceptor untuk MENAMBAHKAN token ke setiap permintaan
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === PASTIKAN BLOK INI ADA ===
// Interceptor untuk MENANGANI error pada respons
api.interceptors.response.use(
  (response) => {
    // Jika respons sukses, tidak melakukan apa-apa
    return response;
  },
  (error) => {
    // Jika ada error, periksa apakah statusnya 401 (Unauthorized)
    // atau jika ada pesan 'token tidak valid'
    if ( (error.response && error.response.status === 401) || 
         (error.response && error.response.data.message?.includes('token tidak valid')) 
       ) {
      console.log("Sesi tidak valid atau kedaluwarsa. Melakukan logout otomatis.");
      
      // Hapus token yang salah dari localStorage
      localStorage.removeItem('token');
      
      // Arahkan pengguna ke halaman login dan refresh halaman
      // Tambahkan pengecekan agar tidak terjadi redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;