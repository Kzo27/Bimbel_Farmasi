import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

function CreateTryOut() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);

  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', '', ''], correctAnswer: '', explanation: '' }
  ]);
  
  const [loading, setLoading] = useState(false);

  // ... (fungsi handleQuestionChange, handleOptionChange, addQuestion, removeQuestion tetap sama)
  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };
  
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };
  
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', '', ''], correctAnswer: '', explanation: '' }]);
  };
  
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (questions.some(q => !q.question || !q.correctAnswer || q.options.some(opt => !opt))) {
      alert('Semua pertanyaan dan opsi jawaban harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const tryoutData = {
        title,
        description,
        duration,
        questions // Mengirim array pertanyaan lengkap, bukan hanya ID
      };

      // Hanya satu kali POST ke endpoint Try Out
      await axios.post('http://localhost:5000/api/v1/tryouts', tryoutData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Paket Try Out dan pertanyaan berhasil dibuat!');
      navigate('/tryouts');
      
    } catch (err) {
      alert('Gagal membuat Try Out: ' + (err.response?.data.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  // ... (JSX tetap sama)
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buat Paket Try Out Baru</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Kolom Kiri: Detail Try Out */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detail Try Out</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Try Out</label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Contoh: Try Out UTBK 2024"
                      required
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Deskripsi singkat tentang paket try out ini."
                      required
                      rows="4"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Durasi (menit)</label>
                    <input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="Durasi (menit)"
                      required
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Input Pertanyaan */}
              <div className="lg:border-l lg:border-gray-200 lg:pl-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buat Pertanyaan</h2>
                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 p-6 rounded-md shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Pertanyaan #{qIndex + 1}</h3>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-600 hover:text-red-800 transition duration-200"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700">Pertanyaan</label>
                          <textarea
                            id={`question-${qIndex}`}
                            value={q.question}
                            onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)}
                            rows="3"
                            required
                            placeholder="Tuliskan pertanyaan di sini..."
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pilihan Jawaban</label>
                          <div className="space-y-2 mt-1">
                            {q.options.map((option, oIndex) => (
                              <input
                                key={oIndex}
                                type="text"
                                value={option}
                                onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`correct-answer-${qIndex}`} className="block text-sm font-medium text-gray-700">Jawaban Benar</label>
                          <select
                            id={`correct-answer-${qIndex}`}
                            value={q.correctAnswer}
                            onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          >
                            <option value="">-- Pilih Jawaban Benar --</option>
                            {q.options.map((option, oIndex) => (
                              <option key={oIndex} value={option}>{String.fromCharCode(65 + oIndex)}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor={`explanation-${qIndex}`} className="block text-sm font-medium text-gray-700">Pembahasan (opsional)</label>
                          <textarea
                            id={`explanation-${qIndex}`}
                            value={q.explanation}
                            onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            rows="4"
                            placeholder="Tuliskan pembahasan di sini..."
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
                  >
                    Tambah Pertanyaan Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-semibold rounded-md transition duration-300 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Simpan Paket Try Out'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateTryOut;