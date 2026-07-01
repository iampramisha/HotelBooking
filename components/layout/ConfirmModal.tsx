import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirm", message }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <div className="flex justify-center gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition text-sm font-semibold"
          >
            Yes, proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;