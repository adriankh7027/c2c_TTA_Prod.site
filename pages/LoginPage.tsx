import React, { useState, useMemo } from 'react';
import { User, Role } from '../types';
import Card from '../components/Card';
import PinInput from '../components/PinInput';

interface LoginPageProps {
  users: User[];
  onLogin: (identifier: string, pin: string) => Promise<User>;
  userListViewEnabled: boolean;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const AllocationAdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        <path d="M15.999 15.553a.5.5 0 01.447.894l-1.999 1a.5.5 0 01-.894-.447l1-1.999a.5.5 0 01.446-.448zM4.001 15.553a.5.5 0 00-.447.894l1.999 1a.5.5 0 00.894-.447l-1-1.999a.5.5 0 00-.446-.448z" />
    </svg>
);

const SystemAdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin, userListViewEnabled }) => {
  // State for List View
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [userForPin, setUserForPin] = useState<User | null>(null);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  // State for Form View
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Common State
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isDevDetailsVisible, setIsDevDetailsVisible] = useState(false);

  const handleLoginClick = (user: User) => {
    setPinError('');
    setPinValue('');
    setUserForPin(user);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForPin || isLoggingIn) return;

    setIsLoggingIn(true);
    setPinError('');
    try {
      await onLogin(userForPin.email || userForPin.name, pinValue);
      setUserForPin(null);
    } catch (error) {
      setPinError('Wrong PIN. Please try again.');
      setPinValue('');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError('');
    try {
      await onLogin(loginIdentifier, loginPin);
    } catch (error) {
      setLoginError('Invalid credentials. Please check your details and try again.');
      setLoginPin('');
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleCancelPin = () => {
    setUserForPin(null);
  };

  const getRoleInfo = (role: Role) => {
    switch (role) {
      case Role.SystemAdmin:
        return { icon: <SystemAdminIcon />, title: 'System Administrator' };
      case Role.AllocationAdmin:
        return { icon: <AllocationAdminIcon />, title: 'Allocation Administrator' };
      default:
        return { icon: <UserIcon />, title: 'User' };
    }
  };
  
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const roleOrder = {
          [Role.SystemAdmin]: 0,
          [Role.AllocationAdmin]: 1,
          [Role.User]: 2,
        };
        const roleA = roleOrder[a.role];
        const roleB = roleOrder[b.role];

        if (roleA !== roleB) {
          return roleA - roleB;
        }
        
        const nameComparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? nameComparison : -nameComparison;
      });
  }, [users, searchTerm, sortOrder]);
  
  const renderLoginContent = () => {
    if (userListViewEnabled) {
      return (
        <>
          <p className="text-slate-600 mb-8">Please select your profile to continue.</p>
          <div className="w-full max-w-4xl mb-6">
            <div className="flex gap-4 justify-end items-center">
              <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out`}>
                  <div className={`relative ${isSearchExpanded ? 'w-64' : 'w-0'}`}>
                      <input
                          type="text"
                          placeholder="Search for a user..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-opacity duration-300 ${isSearchExpanded ? 'opacity-100' : 'opacity-0'}`}
                          disabled={!isSearchExpanded}
                          autoFocus={isSearchExpanded}
                      />
                  </div>
                  <button
                      onClick={() => {
                          if (isSearchExpanded) {
                              setSearchTerm('');
                          }
                          setIsSearchExpanded(!isSearchExpanded);
                      }}
                      className="p-3 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                      title={isSearchExpanded ? "Close Search" : "Search Users"}
                  >
                      {isSearchExpanded ? <CloseIcon /> : <SearchIcon />}
                  </button>
              </div>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending (Z-A)' : 'Ascending (A-Z)'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 8a1 1 0 000 2h14a1 1 0 100-2H3zM3 13a1 1 0 000 2h14a1 1 0 100-2H3z" />
                </svg>
                <span className="font-semibold text-slate-700">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {filteredAndSortedUsers.map(user => {
              const { icon, title } = getRoleInfo(user.role);
              return (
                <Card key={user.id} className="text-center flex flex-col items-center justify-between transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                  {icon}
                  <p className="text-xl font-semibold text-slate-700 mt-4">{user.name}</p>
                  <p className="text-sm text-slate-500 mb-6">{title}</p>
                  <button
                    onClick={() => handleLoginClick(user)}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Login as {user.name.split(' ')[0]}
                  </button>
                </Card>
              );
            })}
          </div>
        </>
      );
    } else {
      return (
        <Card className="w-full max-w-md">
            <p className="text-slate-600 mb-6 text-center">Please enter your details to login.</p>
            <form onSubmit={handleFormLogin} className="space-y-6">
              <div>
                <label htmlFor="loginIdentifier" className="block text-sm font-medium text-slate-700 mb-2">
                  Name or Email
                </label>
                <input
                  id="loginIdentifier"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  PIN
                </label>
                <PinInput value={loginPin} onChange={setLoginPin} />
              </div>
              {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg disabled:bg-slate-400"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </form>
        </Card>
      );
    }
  };

  const renderHelpContent = () => (
    <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
      <div className="absolute top-4 right-4">
        <button onClick={() => setIsHelpVisible(false)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">
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
  );


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <main className="w-full flex-grow flex flex-col items-center justify-center">
            {isHelpVisible ? (
                renderHelpContent()
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome!</h2>
                    {renderLoginContent()}
                </>
            )}
        </main>
        
        <footer className="w-full text-center text-slate-500 text-sm p-4 mt-8">
            <span className="mx-2">© 2025</span> |
            <button onClick={() => setIsDevDetailsVisible(true)} className="mx-2 text-indigo-600 hover:underline font-semibold">
              Development Details
            </button> |
            <button onClick={() => setIsHelpVisible(true)} className="mx-2 text-indigo-600 hover:underline font-semibold">
              Help
            </button>
        </footer>
      </div>
      
      {userForPin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelPin}>
          <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Enter PIN for {userForPin.name}</h3>
            <p className="text-slate-500 mb-6">Please enter your 4-digit PIN to continue.</p>
            <form onSubmit={handlePinSubmit}>
              <PinInput value={pinValue} onChange={setPinValue} />
              {pinError && <p className="text-red-500 text-sm mt-4 text-center">{pinError}</p>}
              <div className="flex justify-end space-x-3 pt-4 mt-2">
                <button type="button" onClick={handleCancelPin} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                <button type="submit" disabled={isLoggingIn} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-slate-400">
                    {isLoggingIn ? 'Verifying...' : 'Enter'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isDevDetailsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsDevDetailsVisible(false)}>
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Development & Technology Stack</h3>
            <div className="space-y-4 text-slate-700">
              <div>
                <h4 className="font-bold text-indigo-600">Lead Developer</h4>
                <p>Sarath</p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-600">AI Collaboration</h4>
                <p>Google Gemini API was utilized for AI-assisted code generation, refactoring, and feature implementation.</p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-600">Core Technology Stack</h4>
                <ul className="list-disc list-inside">
                  <li><strong>Frontend Framework:</strong> React</li>
                  <li><strong>Language:</strong> TypeScript</li>
                  <li><strong>Styling:</strong> Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-indigo-600">Technical Details</h4>
                <ul className="list-disc list-inside">
                  <li><strong>State Management:</strong> Client-side state managed with React Hooks (`useState`, `useEffect`, `useMemo`).</li>
                  <li><strong>Data Persistence:</strong> Browser `localStorage` is used to maintain state across sessions.</li>
                  <li><strong>Architecture:</strong> A component-based architecture with separation of concerns (UI components, services, hooks).</li>
                  <li><strong>Environment:</strong> The application is built using modern web standards (ES Modules) and runs directly in the browser.</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button onClick={() => setIsDevDetailsVisible(false)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">Close</button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
