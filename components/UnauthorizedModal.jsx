import React from 'react';

export default function UnauthorizedModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 mb-6">
            {message || "You don't have permission to perform this action."}
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}