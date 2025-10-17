import React, { useState, useEffect } from 'react';

interface SuccessBannerProps {
  message: string;
  onClose: () => void;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessBanner: React.FC<SuccessBannerProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const inTimer = setTimeout(() => setVisible(true), 50);

    const outTimer = setTimeout(() => {
      // Animate out
      setVisible(false);
      // Call onClose after animation ends
      setTimeout(onClose, 300); // Match this with transition duration
    }, 3000); // Display for 3 seconds

    return () => {
        clearTimeout(inTimer);
        clearTimeout(outTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center z-50 transition-all duration-300 ease-in-out transform
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
    >
      <SuccessIcon />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default SuccessBanner;
