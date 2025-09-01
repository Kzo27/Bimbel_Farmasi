import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import QuizForm from '../components/QuizForm';
import Sidebar from '../components/Sidebar';

function ManageQuiz() {
  const { id: chapterId } = useParams();
  const { token, logout } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // 1. State baru untuk key form
  const [quizFormKey, setQuizFormKey] = useState(Date.now());

  const fetchData = async () => {
    if (!token) {
      console.log('Token tidak tersedia, membatalkan fetch data.');
      return;
    }
    
    try {
      const chapterRes = await axios.get(`http://localhost:5000/api/v1/chapters/${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChapter(chapterRes.data.data);

      const questionsRes = await axios.get(`http://localhost:5000/api/v1/quizzes/for-chapter/${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(questionsRes.data.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, chapterId]);
  
  const handleQuizSubmit = async (formData) => {
    const method = formData._id ? 'put' : 'post';
    const url = formData._id
      ? `http://localhost:5000/api/v1/quizzes/${formData._id}`
      : `http://localhost:5000/api/v1/quizzes/for-chapter/${chapterId}`;

    const dataToSend = { 
      ...formData, 
      chapter: chapterId,
      subject: chapter.subject
    };

    try {
      await axios({
        method: method,
        url: url,
        data: dataToSend,
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setCurrentQuestion(null);

      // 2. Jika ini adalah soal baru, reset form dengan mengubah key
      if (!formData._id) {
        setQuizFormKey(Date.now());
      }
      
    } catch (error) {
      console.error('Gagal menyimpan pertanyaan:', error);
      alert('Gagal menyimpan pertanyaan. Silakan coba lagi.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Pertanyaan berhasil dihapus!');
        fetchData();
      } catch (error) {
        console.error('Gagal menghapus pertanyaan:', error);
        alert('Gagal menghapus pertanyaan.');
      }
    }
  };
  
  if (!chapter) {
    return (
      // Perbaiki layout juga untuk halaman loading
      <div className="flex bg-gray-100 h-screen overflow-hidden">
        <Sidebar onLogout={logout} />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-gray-500 text-lg">Memuat...</p>
        </main>
      </div>
    );
  }

  return (
    // 3. Perubahan layout utama untuk scrolling
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar onLogout={logout} />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Kuis Bab: {chapter.title}
          </h1>
          <Link 
            to={`/subject/${chapter.subject}`} 
            className="text-blue-600 hover:text-blue-800 transition duration-300 font-semibold"
          >
            &larr; Kembali ke Bab
          </Link>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {currentQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
            </h2>
            <QuizForm 
              key={quizFormKey} // 4. Terapkan key di sini
              onSubmit={handleQuizSubmit} 
              onClose={() => setCurrentQuestion(null)}
              initialData={currentQuestion}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daftar Pertanyaan</h2>
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div 
                    key={q._id} 
                    className="p-4 border border-gray-200 rounded-lg transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-900">Pertanyaan #{index + 1}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentQuestion(q)}
                          className="py-1 px-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition duration-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="py-1 px-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{q.question}</p>
                    <p className="text-sm mt-2">Jawaban: <span className="font-semibold text-green-600">{q.correctAnswer}</span></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Belum ada pertanyaan untuk bab ini.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ManageQuiz;