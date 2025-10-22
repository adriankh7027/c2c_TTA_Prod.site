import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Card from '../components/Card';
import PinInput from '../components/PinInput';

interface EditProfilePageProps {
  user: User;
  onUpdateUser: (user: User, newPin?: string, currentPin?: string) => void;
  onBack: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onUpdateUser, onBack }) => {
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email || '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (newPin || currentPin) {
      if (newPin && newPin.length !== 4) {
        setPinError('New PIN must be 4 digits.');
        return;
      }
      if (!currentPin) {
        setPinError('Current PIN is required to set a new PIN.');
        return;
      }
    }
    
    const updatedUser: User = { ...user, name: profileName, email: profileEmail };
    onUpdateUser(updatedUser, newPin || undefined, currentPin || undefined);
    onBack(); // Go back to dashboard after saving
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Edit My Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label htmlFor="profileName" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              id="profileName"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              id="profileEmail"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="pt-6 border-t">
            <p className="text-lg font-semibold text-slate-800 mb-2">Change PIN (Optional)</p>
            <p className="text-sm text-slate-500 mb-6">To change your PIN, you must provide your current PIN and a new 4-digit PIN. Leave these fields blank if you do not wish to change your PIN.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current PIN</label>
                    <PinInput value={currentPin} onChange={setCurrentPin} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New PIN</label>
                    <PinInput value={newPin} onChange={setNewPin} />
                </div>
            </div>
            {pinError && <p className="text-red-500 text-sm mt-4 text-center">{pinError}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onBack} className="bg-slate-200 text-slate-800 px-6 py-3 rounded-lg hover:bg-slate-300 font-bold">Back to Dashboard</button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-bold">Save Changes</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfilePage;
