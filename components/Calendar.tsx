import React from 'react';

interface CalendarProps {
  month: number;
  year: number;
  selectedDays: number[];
  onDayClick: (day: number) => void;
  holidays?: string[];
  selectionColor?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  month, 
  year, 
  selectedDays, 
  onDayClick, 
  holidays = [],
  selectionColor = 'bg-blue-600'
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const days = [];
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="border rounded-md"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day));
      const dateString = date.toISOString().split('T')[0];
      
      const isSelected = selectedDays.includes(day);
      const isHoliday = holidays.includes(dateString);
      const isCurrentDate = new Date(year, month, day).getTime() === today.getTime();

      const dayClasses = `
        p-2 text-center border rounded-md cursor-pointer transition-all duration-200 flex flex-col justify-center items-center h-16
        ${isSelected ? `${selectionColor} text-white font-bold scale-105 shadow-lg` : 'bg-white hover:bg-blue-100'}
        ${isHoliday && !isSelected ? 'bg-red-100 text-red-700' : ''}
        ${isCurrentDate && !isSelected ? 'border-blue-500 border-2' : ''}
        ${!isSelected ? 'text-slate-700' : ''}
      `;

      days.push(
        <div key={day} className={dayClasses} onClick={() => onDayClick(day)}>
          {isHoliday && <span className="text-[9px] font-bold text-red-500 leading-tight">Holiday</span>}
          <span>{day}</span>
        </div>
      );
    }
    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map(day => (
          <div key={day} className="font-bold text-center text-slate-500">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;