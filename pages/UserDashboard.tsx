import React, { useState, useEffect, useMemo } from 'react';
import { User, Plan, Allocation } from '../types';
import Card from '../components/Card';
import Calendar from '../components/Calendar';

interface UserDashboardProps {
  user: User;
  plans: Plan[];
  allocations: Allocation[];
  onSubmitPlan: (plan: Omit<Plan, 'userName'>) => void;
  tripLabels: { departure: string; arrival: string };
  tripPrice: number;
  holidays: string[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  plans,
  allocations,
  onSubmitPlan,
  tripLabels,
  tripPrice,
  holidays,
}) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const planForMonth = plans.find(p =>
      p.userId === user.id &&
      p.year === currentDate.getFullYear() &&
      p.month === currentDate.getMonth()
    );
    setSelectedDays(planForMonth?.selectedDays || []);
  }, [plans, user.id, currentDate]);

  const handleDayClick = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = () => {
    const plan: Omit<Plan, 'userName'> = {
      userId: user.id,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      selectedDays: selectedDays,
    };
    onSubmitPlan(plan);
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const monthTitle = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const userAllocations = useMemo(() => {
    return allocations
      .filter(alloc => alloc.travelers.some(t => t.id === user.id))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allocations, user.id]);

  const monthlyExpense = userAllocations.length * tripPrice;

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold text-slate-800">Welcome, {user.name}!</h2>
        <p className="text-slate-600 mt-2">Here is your dashboard for trip planning and schedule overview.</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xl font-bold text-slate-800">Trip Planning for {monthTitle}</h3>
            <div className="flex items-center gap-2">
                <button onClick={() => handleMonthChange(-1)} className="px-3 py-1 bg-slate-200 rounded-lg hover:bg-slate-300 font-semibold">&lt; Prev</button>
                <button onClick={() => handleMonthChange(1)} className="px-3 py-1 bg-slate-200 rounded-lg hover:bg-slate-300 font-semibold">Next &gt;</button>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Select the days you are available for travel. Click "Submit Plan" to confirm.</p>
          <Calendar
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
            holidays={holidays}
          />
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Plan for {monthTitle}
          </button>
        </Card>

        <div className="space-y-8">
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">My Travel Schedule</h3>
            {userAllocations.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {userAllocations.map(alloc => (
                  <div key={alloc.date} className="p-3 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-700">{alloc.date}</p>
                      {alloc.tripType && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alloc.tripType === tripLabels.departure ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {alloc.tripType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Booker: <span className="font-semibold text-indigo-600">{alloc.bookerName}</span></p>
                    <p className="text-sm text-slate-500">Traveling with: {alloc.travelers.filter(t => t.id !== user.id).map(t => t.name).join(', ') || 'None'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">Your schedule will appear here once allocations are generated.</p>
            )}
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-slate-800">My Monthly Expense</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">₹{monthlyExpense.toFixed(2)}</p>
            <p className="text-slate-500 text-sm mt-1">Based on {userAllocations.length} trips for {currentDate.toLocaleString('default', { month: 'long' })} at ₹{tripPrice} each.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
