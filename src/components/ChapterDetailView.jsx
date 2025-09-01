import React from 'react';

function ChapterDetailView({ chapter, onClose }) {
  if (!chapter) {
    return null;
  }

  // 1. Definisikan alamat dasar server backend
  const BACKEND_URL = 'http://localhost:5000';

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
      <p className="text-gray-600 mb-4 text-justify">{chapter.description}</p>
      
      {/* Tampilkan video jika videoUrl ada */}
      {chapter.videoUrl ? (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Video Materi:</h4>
          <video 
            // 2. Perbaiki URL video agar sesuai dengan struktur backend
            src={`${BACKEND_URL}/uploads/videos/${chapter.videoUrl}`}
            controls
            className="w-full max-h-96 rounded-lg shadow-md bg-black"
          />
        </div>
      ) : null}

      {/* 3. Tambahkan tampilan untuk file dokumen (jika ada) */}
      {chapter.documentUrl && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Dokumen Pendukung:</h4>
          <a
            href={`${BACKEND_URL}/uploads/documents/${chapter.documentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Unduh Dokumen
          </a>
        </div>
      )}

      {/* Pesan jika tidak ada media */}
      {!chapter.videoUrl && !chapter.documentUrl && (
        <p className="mt-4 text-gray-500 italic">Tidak ada video atau dokumen yang diunggah untuk bab ini.</p>
      )}

      <div className="flex justify-end mt-8 border-t pt-4">
        <button
          onClick={onClose}
          className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-300"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default ChapterDetailView;