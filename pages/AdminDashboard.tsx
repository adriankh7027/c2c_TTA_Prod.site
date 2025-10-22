import React, { useState, useMemo, useEffect } from 'react';
import { Plan, Allocation } from '../types';
import Card from '../components/Card';
import Calendar from '../components/Calendar';

interface AdminDashboardProps {
  plans: Plan[];
  allocations: Allocation[];
  onAllocate: () => void;
  isLoading: boolean;
  updatedUsers: string[];
  tripLabels: { departure: string; arrival: string };
  holidays: string[];
  onUpdateHolidays: (holidays: string[]) => void;
  allocateForCurrentMonth: boolean;
}

const MinimizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
    </svg>
);

const MaximizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

const AllocationsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  plans, 
  allocations, 
  onAllocate, 
  isLoading, 
  updatedUsers, 
  tripLabels,
  holidays,
  // FIX: Corrected typo in prop name from onUpdateHoldays to onUpdateHolidays to match the interface.
  onUpdateHolidays,
  allocateForCurrentMonth
}) => {
  const [activeView, setActiveView] = useState<'allocations' | 'calendar'>('allocations');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  
  // State for Holiday Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>(holidays);

  useEffect(() => {
    setSelectedHolidays(holidays);
  }, [holidays]);

  const displayedPlans = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let targetMonth, targetYear;
    if (allocateForCurrentMonth) {
      targetMonth = currentMonth;
      targetYear = currentYear;
    } else {
      targetMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      targetYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    }
    
    return plans.filter(p => p.month === targetMonth && p.year === targetYear);
  }, [plans, allocateForCurrentMonth]);

  const plansMonthTitle = useMemo(() => {
    const targetDate = new Date();
    if (!allocateForCurrentMonth) {
        targetDate.setMonth(targetDate.getMonth() + 1);
    }
    return targetDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [allocateForCurrentMonth]);


  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const handleHolidayClick = (day: number) => {
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day));
    const dateString = date.toISOString();

    setSelectedHolidays(prev => 
        prev.some(d => d.startsWith(dateString.split('T')[0]))
            ? prev.filter(d => !d.startsWith(dateString.split('T')[0])) 
            : [...prev, dateString].sort()
    );
  };
  
  const currentlyVisibleSelectedHolidays = useMemo(() => {
    return selectedHolidays
        .map(dStr => new Date(dStr))
        .filter(d => d.getUTCFullYear() === currentDate.getFullYear() && d.getUTCMonth() === currentDate.getMonth())
        .map(d => d.getUTCDate());
  }, [selectedHolidays, currentDate]);

  const handleUpdateHolidays = () => {
    onUpdateHolidays(selectedHolidays);
  };

  const NavItem = ({ label, viewName, icon }: { label: string, viewName: 'allocations' | 'calendar', icon: React.ReactElement }) => (
    <li
      className={`relative group flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        activeView === viewName ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
      } ${isSidebarMinimized ? 'justify-center' : 'space-x-3'}`}
      onClick={() => setActiveView(viewName)}
    >
      {icon}
      {!isSidebarMinimized && <span className="whitespace-nowrap">{label}</span>}
      {isSidebarMinimized && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          {label}
        </div>
      )}
    </li>
  );

  return (
    <div className="flex">
      <aside className={`transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'w-20' : 'w-56'}`}>
        <Card className="p-4 h-full flex flex-col">
          <div className="flex-grow">
            <h2 className={`text-xl font-bold text-slate-800 mb-6 px-2 transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarMinimized ? 'opacity-0 h-0' : 'opacity-100'}`}>Admin Menu</h2>
            <ul className="space-y-2">
              <NavItem 
                label="Allocations" 
                viewName="allocations" 
                icon={<AllocationsIcon />}
              />
              <NavItem 
                label="Calendar" 
                viewName="calendar"
                icon={<CalendarIcon />}
              />
            </ul>
          </div>
           <div className="mt-auto">
            <button
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
              className="w-full flex items-center justify-center p-3 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
              title={isSidebarMinimized ? 'Expand Menu' : 'Minimize Menu'}
            >
              {isSidebarMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
            </button>
          </div>
        </Card>
      </aside>

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'ml-2' : 'ml-6'}`}>
        {activeView === 'allocations' && (
          <div className="space-y-8">
            <Card>
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Allocation Dashboard</h2>
                <button
                  onClick={onAllocate}
                  disabled={isLoading || displayedPlans.length === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Allocating...' : 'Allocate Bookings'}
                </button>
              </div>
              <p className="text-slate-600 mt-4">Review submitted travel plans and generate the booking allocation for all members.</p>
            </Card>

            {updatedUsers.length > 0 && (
              <Card className="bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="flex">
                      <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.008a1 1 0 011 1v3.012a1 1 0 01-1 1h-.008a1 1 0 01-1-1V5z" clipRule="evenodd" />
                          </svg>
                      </div>
                      <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                              Plan has been Updated Recently by <span className="font-bold">{updatedUsers.join(', ')}</span>.
                              <span className="block sm:inline sm:ml-1">
                                  Please Re-generate the Travel Schedule for the updated schedule.
                              </span>
                          </p>
                      </div>
                  </div>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Submitted Plans</h3>
                <p className="text-sm font-semibold text-indigo-600 mb-4">Showing plans for: {plansMonthTitle}</p>
                {displayedPlans.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {displayedPlans.map((plan, index) => {
                      const sortedDays = [...(plan.selectedDays || [])].sort((a, b) => a - b);
                      
                      return (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                          <p className="font-semibold text-slate-700">{plan.userName}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(plan.year, plan.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </p>
                          {sortedDays.length > 0 ? (
                            <p className="text-sm text-slate-600 mt-2">
                              Selected Days: <span className="font-bold text-slate-800">{sortedDays.join(', ')}</span>
                            </p>
                          ) : (
                             <p className="text-sm text-slate-500 mt-2">No days selected.</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No plans have been submitted for {plansMonthTitle} yet.</p>
                )}
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Master Allocation Schedule</h3>
                {allocations.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto pr-2">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-white">
                        <tr>
                          <th className="p-2 border-b-2 text-slate-600">Date</th>
                          <th className="p-2 border-b-2 text-slate-600 text-center">Type</th>
                          <th className="p-2 border-b-2 text-slate-600">Booker</th>
                          <th className="p-2 border-b-2 text-slate-600">Travelers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((alloc, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 text-slate-700">{alloc.date}</td>
                            <td className="p-2 text-center">
                              {alloc.tripType && (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  alloc.tripType === tripLabels.departure ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {alloc.tripType}
                                </span>
                              )}
                            </td>
                            <td className="p-2 font-semibold text-indigo-600">{alloc.bookerName}</td>
                            <td className="p-2 text-slate-500 text-sm">{alloc.travelers?.map(t => t.name).join(', ') || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No allocations generated. Click "Allocate Bookings" to start.</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Manage Holidays</h2>
            <p className="text-slate-600 mb-6">Select dates on the calendar to mark them as holidays. These days will be highlighted for all users during trip planning.</p>
            
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => handleMonthChange(-1)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">&lt; Prev</button>
              <h3 className="text-xl font-semibold text-slate-700">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => handleMonthChange(1)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Next &gt;</button>
            </div>

            <Calendar
              month={currentDate.getMonth()}
              year={currentDate.getFullYear()}
              selectedDays={currentlyVisibleSelectedHolidays}
              onDayClick={handleHolidayClick}
              holidays={selectedHolidays}
              selectionColor="bg-red-500"
            />

            <button
              onClick={handleUpdateHolidays}
              className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Update Calendar
            </button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;