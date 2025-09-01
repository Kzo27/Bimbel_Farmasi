import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out
        ${show ? 'bg-black/40' : 'bg-transparent'}`} // Sedikit penyesuaian untuk background lebih gelap
      onClick={handleClose}
    >
      <div
        // 1. Tambahkan max-h-[90vh] untuk membatasi tinggi modal
        className={`relative bg-white w-full max-w-lg mx-auto rounded-xl shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out max-h-[90vh]
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Tambahkan flex-1 agar area ini mengisi sisa ruang */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;