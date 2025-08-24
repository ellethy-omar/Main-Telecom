import React, { useState } from 'react';

const Alert = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm w-full transform transition-all duration-300 ease-in-out z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className={`p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{message}</p>
          <button 
            onClick={handleClose}
            className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert