import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onProfileClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-slate-800">
            c2c Trip Planner
          </h1>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">
                Welcome,{' '}
                <button
                  onClick={onProfileClick}
                  className="font-semibold text-slate-800 hover:underline focus:outline-none disabled:no-underline disabled:cursor-default"
                  disabled={!onProfileClick}
                  title="Edit Profile"
                >
                  {currentUser.name}
                </button>
              </span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;