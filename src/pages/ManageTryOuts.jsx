import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ManageTryOuts() {
  const { token, logout } = useContext(AuthContext);
  const [tryOuts, setTryOuts] = useState([]);

  const fetchTryOuts = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/v1/tryouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTryOuts(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data Try Out:", error);
    }
  };

  useEffect(() => {
    fetchTryOuts();
  }, [token]);

  const handleDeleteTryOut = async (id) => {
    const result = await MySwal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/tryouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        MySwal.fire(
          'Dihapus!',
          'Paket Try Out berhasil dihapus.',
          'success'
        );
        fetchTryOuts();
      } catch (error) {
        console.error("Gagal menghapus Try Out:", error);
        MySwal.fire(
          'Gagal!',
          'Gagal menghapus paket Try Out.',
          'error'
        );
      }
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Try Out</h1>
          <Link to="/create-tryout">
            <button
              type="button"
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
            >
              + Buat Paket Baru
            </button>
          </Link>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Daftar Paket Try Out</h2>
          </div>
          {tryOuts.length > 0 ? (
            <div className="space-y-4">
              {tryOuts.map(to => (
                <div 
                  key={to._id} 
                  className="bg-white rounded-lg p-6 border border-gray-200 transition-shadow duration-300 hover:shadow-md"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{to.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{to.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link to={`/tryout/${to._id}/results`}>
                      <button
                        type="button"
                        className="py-2 px-4 bg-purple-600 text-white font-semibold text-sm rounded-md hover:bg-purple-700 transition duration-300"
                      >
                        Lihat Analisis & Hasil
                      </button>
                    </Link>
                    <button 
                      type="button"
                      onClick={() => handleDeleteTryOut(to._id)}
                      className="py-2 px-4 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Belum ada paket Try Out yang dibuat.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageTryOuts;