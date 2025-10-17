import React, { useState, useMemo, useEffect } from 'react';
import { User, Plan, Allocation } from '../types';
import Calendar from '../components/Calendar';
import Card from '../components/Card';
import PinInput from '../components/PinInput';

interface UserDashboardProps {
  user: User;
  plans: Plan[];
  allocations: Allocation[];
  onSubmitPlan: (plan: Omit<Plan, 'userName'>) => void;
  onUpdateUser: (user: User, newPin?: string, currentPin?: string) => void;
  tripLabels: { departure: string; arrival: string };
  tripPrice: number;
  holidays: string[];
  isProfileModalOpen: boolean;
  onCloseProfileModal: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  plans, 
  allocations, 
  onSubmitPlan, 
  onUpdateUser, 
  tripLabels, 
  holidays, 
  tripPrice,
  isProfileModalOpen,
  onCloseProfileModal
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  
  // Profile State
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email || '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [profileError, setProfileError] = useState('');


  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const existingPlan = useMemo(() => {
    return plans.find(p => p.userId === user.id && p.month === month && p.year === year);
  }, [plans, user.id, month, year]);

  useEffect(() => {
    if (existingPlan) {
      setSelectedDays(existingPlan.selectedDays);
    } else {
      setSelectedDays([]);
    }
  }, [existingPlan, month, year]);
  
  // Reset profile form when user or modal state changes
  useEffect(() => {
    setProfileName(user.name);
    setProfileEmail(user.email || '');
    setCurrentPin('');
    setNewPin('');
    setProfileError('');
  }, [user, isProfileModalOpen]);

  const handleDayClick = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) return;
    
    onSubmitPlan({ userId: user.id, month, year, selectedDays });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Name and email cannot be empty.');
      return;
    }
    
    const isChangingPin = currentPin || newPin;
    if (isChangingPin) {
      if (!/^\d{4}$/.test(currentPin)) {
        setProfileError('Current PIN must be exactly 4 digits.');
        return;
      }
      if (!/^\d{4}$/.test(newPin)) {
        setProfileError('New PIN must be exactly 4 digits.');
        return;
      }
    }
    
    const updatedUser: User = { ...user, name: profileName, email: profileEmail };
    onUpdateUser(updatedUser, isChangingPin ? newPin : undefined, isChangingPin ? currentPin : undefined);
    onCloseProfileModal();
  };

  const myTravels = useMemo(() => {
    return allocations
      .filter(alloc => alloc.travelers?.some(t => t.id === user.id))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allocations, user.id]);
  
  const myMonthlyTravels = useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return myTravels.filter(travel => {
        const travelDate = new Date(travel.date + 'T00:00:00Z');
        return travelDate.getUTCFullYear() === currentYear && travelDate.getUTCMonth() === currentMonth;
    });
  }, [myTravels, currentDate]);

  const monthlyExpense = myMonthlyTravels.length * tripPrice;

  return (
    <>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Plan Your Trips</h2>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => handleMonthChange(-1)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">&lt; Prev</button>
                <h3 className="text-xl font-semibold text-slate-700">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => handleMonthChange(1)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Next &gt;</button>
              </div>
              <Calendar
                month={month}
                year={year}
                selectedDays={selectedDays}
                onDayClick={handleDayClick}
                holidays={holidays}
              />
              {existingPlan && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 font-medium">
                    Your submitted plan for {currentDate.toLocaleString('default', { month: 'long' })}: 
                    <span className="font-bold text-slate-800 ml-2">{[...existingPlan.selectedDays].sort((a,b) => a-b).join(', ')}</span>
                  </p>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={selectedDays.length === 0}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {existingPlan ? 'Update Plan' : 'Submit Plan'} for {currentDate.toLocaleString('default', { month: 'long' })}
              </button>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">My Travel Schedule</h3>
              {myTravels.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {myTravels.map(alloc => (
                    <li key={alloc.date} className="bg-slate-50 p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-slate-800">
                          {new Date(alloc.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        {alloc.tripType && (
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            alloc.tripType === tripLabels.departure ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {alloc.tripType}
                          </span>
                        )}
                      </div>
                      <div className="text-sm mt-2 space-y-1">
                          <div>
                              <span className="font-semibold text-slate-600">Booker: </span>
                              {alloc.bookerId === user.id ? (
                                  <span className="font-bold text-green-700 bg-green-100 py-0.5 px-2 rounded-full text-xs align-middle">YOU</span>
                              ) : (
                                  <span className="font-semibold text-indigo-600">{alloc.bookerName}</span>
                              )}
                          </div>
                          <div>
                              <span className="font-semibold text-slate-600">Traveling With: </span>
                              <span className="text-slate-500">
                                  {alloc.travelers.filter(t => t.id !== user.id).map(t => t.name).join(', ') || 'Just me!'}
                              </span>
                          </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">You have no trips scheduled yet.</p>
              )}
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-2">My Monthly Expense</h3>
              <p className="text-3xl font-bold text-green-600">₹{monthlyExpense}</p>
              <p className="text-slate-500 text-sm">Based on {myMonthlyTravels.length} trips for {currentDate.toLocaleString('default', { month: 'long' })} at ₹{tripPrice} each.</p>
            </Card>
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCloseProfileModal}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleProfileSave}>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Edit My Profile</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="profileName" className="block text-sm font-medium text-slate-700">Your Name</label>
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
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Change PIN</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPin" className="block text-sm font-medium text-slate-700 mb-2">Current PIN</label>
                    <PinInput value={currentPin} onChange={setCurrentPin} />
                  </div>
                  <div>
                    <label htmlFor="newPin" className="block text-sm font-medium text-slate-700 mb-2">New PIN</label>
                    <PinInput value={newPin} onChange={setNewPin} />
                  </div>
                </div>
              </div>

              {profileError && <p className="text-red-500 text-sm mt-4 text-center">{profileError}</p>}
              
              <div className="flex justify-end space-x-3 pt-6">
                <button type="button" onClick={onCloseProfileModal} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold">Save Changes</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
