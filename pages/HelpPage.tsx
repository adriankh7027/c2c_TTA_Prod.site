import React, { useEffect } from 'react';
import Card from '../components/Card';

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  // FIX: Ensure the page scrolls to the top when it's rendered.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <main className="w-full flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
          <div className="absolute top-4 right-4">
            <button onClick={onBack} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">
              Back to Login
            </button>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">C2C Trip Planner: A Comprehensive Guide</h2>
          <div className="space-y-6 text-slate-700 text-base leading-relaxed pr-4">
            
            <section>
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">General & Login</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Dual Login Modes:</strong> The login screen can appear in two ways, controlled by the System Admin for security.
                  <ul className="list-['-_'] list-inside ml-6 mt-1">
                      <li><strong>List View:</strong> A visual grid of user profiles. Convenient but less private.</li>
                      <li><strong>Form View:</strong> A standard login form asking for your Name/Email and PIN. More secure.</li>
                  </ul>
                </li>
                <li><strong>PIN Security:</strong> All accounts are protected by a 4-digit PIN. After selecting your profile or entering your name, you must enter your PIN to log in.</li>
              </ul>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">User Dashboard</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-bold text-indigo-700">Trip Planning (Calendar)</h4>
                        <p>Navigate through months, click on dates to select/deselect your available travel days. Holidays are marked in red. Submit your plan for the month, and feel free to update it later as needed.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-indigo-700">My Travel Schedule</h4>
                        <p>This card is your finalized trip summary. It shows who is the designated <strong>Booker</strong> (responsible for making bookings) for each trip, who you're <strong>Traveling With</strong>, and the <strong>Trip Type</strong> (e.g., Departure/Arrival).</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-indigo-700">My Monthly Expense</h4>
                        <p>Get a quick estimate of your personal trip-related costs for the month, calculated as: (Number of your bookings) x (Trip Price set by Admin).</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-indigo-700">Profile Management</h4>
                        <p>Click your name in the header to edit your profile. You can update your name and email. You can also change your 4-digit PIN here for security by verifying your current PIN first.</p>
                    </div>
                </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">Allocation Admin Dashboard</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-indigo-700">Interface & Navigation</h4>
                  <p>The dashboard features a minimizable sidebar (it starts minimized). When collapsed, hover over icons to see tooltips for 'Allocations' or 'Calendar'.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-indigo-700">Allocations View</h4>
                  <p>This is your main control panel. Review <strong>Submitted Plans</strong> for the relevant month (current or upcoming, based on a system setting). Click <strong>Allocate Bookings</strong> to run the automated, fair assignment process. The finalized <strong>Master Schedule</strong> shows all details. If a user updates their plan after allocation, a prominent <strong>warning</strong> will appear, prompting you to re-allocate.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-indigo-700">Calendar View</h4>
                  <p>Manage global holidays here. Select dates on the calendar and click 'Update Calendar' to mark them as non-working days for everyone, preventing them from being selected in plans.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">System Admin Dashboard</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-indigo-700">User Management</h4>
                  <p>The central hub for all user accounts. You can <strong>Add</strong>, <strong>Edit</strong>, or <strong>Delete</strong> users. For each user, you can set their Name, Email, Role (User, Admin, etc.), and their 'Send Email' preference.</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-indigo-700">System Settings</h4>
                  <p>Customize the app's core behavior:
                    <ul className="list-disc list-inside ml-6 mt-1">
                        <li><strong>Trip Labels:</strong> Change the text for 'Departure' and 'Arrival'.</li>
                        <li><strong>Trip Price:</strong> Set the cost per trip used for expense calculations.</li>
                        <li><strong>Allocate For Current Month:</strong> A crucial toggle that controls the planning cycle. When ON, the admin manages the current month. When OFF, they manage the upcoming month.</li>
                        <li><strong>User List View:</strong> Toggles the main login screen between the visual user grid and the secure name/PIN form.</li>
                    </ul>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Card>
      </main>
       <footer className="w-full text-center text-slate-500 text-sm p-4 mt-8">
        <span className="mx-2">© 2025</span>
      </footer>
    </div>
  );
};

export default HelpPage;