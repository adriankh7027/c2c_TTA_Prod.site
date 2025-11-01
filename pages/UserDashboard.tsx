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
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  plans,
  allocations,
  onSubmitPlan,
  tripLabels,
  tripPrice,
  holidays,
  currentDate,
  onMonthChange,
}) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  
  // Memoize the 1-based month to ensure consistency
  const currentMonthOneBased = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  useEffect(() => {
    // FIX: Correctly find the plan for the current month by comparing 1-based month values.
    // This ensures that when the UI displays a month (e.g., December), it correctly looks for a plan
    // with the corresponding 1-based month value (12) from the API data.
    const planForMonth = plans.find(p =>
      p.userId === user.id &&
      p.year === currentYear &&
      p.month === currentMonthOneBased
    );
    setSelectedDays(planForMonth?.selectedDays || []);
  }, [plans, user.id, currentYear, currentMonthOneBased]);

  const handleDayClick = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = () => {
    // FIX: Ensure the submitted plan uses a 1-based month, as the backend API expects it.
    // JavaScript's getMonth() is 0-indexed (0-11), so we add 1 to align with the database schema (1-12).
    const plan: Omit<Plan, 'userName'> = {
      userId: user.id,
      month: currentMonthOneBased,
      year: currentYear,
      selectedDays: selectedDays,
    };
    onSubmitPlan(plan);
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    onMonthChange(newDate);
  };
  
  const monthTitle = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const userAllocations = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // This is 0-indexed (0-11)

    return allocations
      .filter(alloc => {
        const [allocYear, allocMonth] = alloc.date.split('-').map(Number);
        
        // allocMonth is 1-based (1-12), so we subtract 1 for comparison
        const isCorrectMonth = allocYear === year && (allocMonth - 1) === month;
        if (!isCorrectMonth) {
          return false;
        }

        return alloc.travelers.some(t => t.id === user.id);
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allocations, user.id, currentDate]);

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
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {userAllocations.map(alloc => (
                  <div key={alloc.date} className="p-4 bg-slate-50 rounded-lg border">
                    <p className="font-bold text-slate-800 text-lg">{alloc.date}</p>
                    {alloc.tripType && (
                        <span className={`inline-block mt-1 px-2 py-0.5 text-sm font-semibold rounded-full text-white ${
                            alloc.tripType === tripLabels.departure ? 'bg-blue-600' : 'bg-violet-500'
                        }`}>
                            {alloc.tripType}
                        </span>
                    )}
                    <p className="text-sm text-slate-600 mt-3">
                        Booker: 
                        {alloc.bookerId === user.id ? (
                             <span className="ml-2 px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">
                                You!
                            </span>
                        ) : (
                            <span className="font-semibold text-indigo-600 ml-1">{alloc.bookerName}</span>
                        )}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        Traveling with: 
                        <span className="ml-1">{alloc.travelers.filter(t => t.id !== user.id).map(t => t.name).join(', ') || 'None'}</span>
                    </p>
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
            <p className="text-slate-500 text-sm mt-1">{userAllocations.length} trips × ₹{tripPrice.toFixed(2)}/trip</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;