import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
