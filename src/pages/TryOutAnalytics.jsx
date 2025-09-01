import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Impor komponen Sidebar

function TryOutAnalytics() {
  const { id: tryOutId } = useParams();
  const { token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [tryOutTitle, setTryOutTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const tryOutRes = await axios.get(`http://localhost:5000/api/v1/tryouts/${tryOutId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTryOutTitle(tryOutRes.data.data.title);

        const res = await axios.get(`http://localhost:5000/api/v1/analytics/tryout/${tryOutId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil analisis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token, tryOutId]);

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar onLogout={logout} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-gray-500 text-lg">Memuat analisis...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Sidebar - Menggabungkan komponen Sidebar */}
      <Sidebar onLogout={logout} />

      {/* Konten Utama */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analisis Try Out</h1>
          <p className="text-xl text-gray-600">
            <span className="font-semibold">Judul:</span> {tryOutTitle}
          </p>
        </header>

        {/* Cek jika data tidak ada */}
        {!stats || stats.message || stats.participantCount === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold text-gray-700">Data analisis tidak ditemukan.</h2>
            <p className="text-gray-500 mt-2">Belum ada peserta yang mengikuti try out ini.</p>
          </div>
        ) : (
          <div>
            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-3xl font-bold text-gray-900">{stats.participantCount}</h3>
                <p className="text-gray-500 mt-2">Jumlah Peserta</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-3xl font-bold text-gray-900">{stats.averageScore?.toFixed(2)}</h3>
                <p className="text-gray-500 mt-2">Skor Rata-rata</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-3xl font-bold text-gray-900">{stats.highestScore?.toFixed(2)}</h3>
                <p className="text-gray-500 mt-2">Skor Tertinggi</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-3xl font-bold text-gray-900">{stats.lowestScore?.toFixed(2)}</h3>
                <p className="text-gray-500 mt-2">Skor Terendah</p>
              </div>
            </div>

            {/* Tabel Hasil per Siswa dengan Ranking */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Peringkat Peserta</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peringkat</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.participants
                      .sort((a, b) => b.score - a.score)
                      .map((p, index) => (
                        <tr key={p._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.score?.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TryOutAnalytics;