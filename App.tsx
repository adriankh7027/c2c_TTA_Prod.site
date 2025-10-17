import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Plan, Allocation, SystemSettings } from './types';
import * as api from './services/apiService';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import Header from './components/Header';
import SuccessBanner from './components/SuccessBanner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedUsers, setUpdatedUsers] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
  };

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedUsers, fetchedSettings] = await Promise.all([
        api.fetchUsers(),
        api.fetchSystemSettings()
      ]);
      setUsers(fetchedUsers);
      setSettings(fetchedSettings);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      alert("Could not connect to the server. Please ensure the backend API is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadDashboardData = useCallback(async () => {
    if (!settings) return;
    setIsLoading(true);
    try {
        const today = new Date();
        const targetMonth = settings.allocateForCurrentMonth ? today.getMonth() : (today.getMonth() + 1) % 12;
        const targetYear = !settings.allocateForCurrentMonth && today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();

        const [fetchedPlans, fetchedAllocations, fetchedHolidays, fetchedUpdatedUsers] = await Promise.all([
            api.fetchPlans(targetYear, targetMonth),
            api.fetchAllocations(),
            api.fetchHolidays(),
            api.fetchUpdatedUsers()
        ]);
        setPlans(fetchedPlans);
        setAllocations(fetchedAllocations);
        setHolidays(fetchedHolidays);
        setUpdatedUsers(fetchedUpdatedUsers);
    } catch (error) {
        console.error("Failed to load dashboard data", error);
    } finally {
        setIsLoading(false);
    }
  }, [settings]);


  useEffect(() => {
    const storedUserStr = sessionStorage.getItem('trip_planner_currentUser');
    if (storedUserStr) {
        setCurrentUser(JSON.parse(storedUserStr));
    }
    loadInitialData();
  }, [loadInitialData]);
  
  useEffect(() => {
    if (currentUser && settings) {
        loadDashboardData();
    }
  }, [currentUser, settings, loadDashboardData]);
  
  const handleLogin = async (identifier: string, pin: string): Promise<User> => {
    try {
        const user = await api.apiLogin(identifier, pin);
        setCurrentUser(user);
        sessionStorage.setItem('trip_planner_currentUser', JSON.stringify(user));
        showSuccess(`Welcome, ${user.name}!`);
        return user;
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('trip_planner_currentUser');
  };

  const handleUpdateUser = async (updatedUserData: User, newPin?: string, currentPin?: string) => {
    if (!currentUser) return;
    try {
        // FIX: Destructure user data to create a clean payload, omitting properties not needed in the body.
        const { id, pin, ...userDataPayload } = updatedUserData;
        await api.updateUser(updatedUserData.id, {
            ...userDataPayload,
            newPin,
            currentPin,
            actorUserId: currentUser.id
        });
        const updatedUsers = await api.fetchUsers();
        setUsers(updatedUsers);
        
        if (currentUser.id === updatedUserData.id) {
            const refreshedUser = updatedUsers.find(u => u.id === updatedUserData.id);
            if(refreshedUser) {
              setCurrentUser(refreshedUser);
              sessionStorage.setItem('trip_planner_currentUser', JSON.stringify(refreshedUser));
            }
        }
        showSuccess('User updated successfully!');
    } catch (error) {
        alert('Failed to update user. The current PIN may be incorrect.');
    }
  };
  
  const handleAddUser = async (newUser: Omit<User, 'id' | 'pin'>) => {
    if (!currentUser) return;
    try {
        await api.addUser({ ...newUser, actorUserId: currentUser.id });
        setUsers(await api.fetchUsers());
        showSuccess('User added successfully!');
    } catch (error) {
        alert('Failed to add user.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await api.deleteUser(userId);
            setUsers(await api.fetchUsers());
            showSuccess('User deleted successfully!');
        } catch (error) {
            alert('Failed to delete user.');
        }
    }
  };

  const handleSubmitPlan = async (plan: Omit<Plan, 'userName'>) => {
    try {
        await api.submitPlan(plan);
        await loadDashboardData();
        showSuccess('Plan submitted successfully!');
    } catch (error) {
        alert('Failed to submit plan.');
    }
  };

  const handleAllocate = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const newAllocations = await api.generateAllocations({ actorUserId: currentUser.id });
        setAllocations(newAllocations);
        setUpdatedUsers([]); // Clear updates locally for instant feedback
        showSuccess('Allocations generated successfully!');
    } catch (error) {
        alert('Failed to generate allocations.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleUpdateHolidays = async (newHolidays: string[]) => {
    if (!currentUser) return;
    try {
        await api.updateHolidays({ holidayDates: newHolidays, actorUserId: currentUser.id });
        setHolidays(newHolidays);
        showSuccess('Holidays updated successfully!');
    } catch (error) {
        alert('Failed to update holidays.');
    }
  };
  
  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    if (!currentUser) return;
    try {
        await api.updateSystemSettings({ ...newSettings, actorUserId: currentUser.id });
        setSettings(newSettings);
        showSuccess('Settings saved successfully!');
    } catch (error) {
        alert('Failed to save settings.');
    }
  };

  const renderDashboard = () => {
    if (!currentUser || !settings) return <div className="text-center">Loading dashboard...</div>;

    switch (currentUser.role) {
      case Role.User:
        return <UserDashboard
                  user={currentUser}
                  plans={plans}
                  allocations={allocations}
                  onSubmitPlan={handleSubmitPlan}
                  onUpdateUser={handleUpdateUser}
                  tripLabels={{ departure: settings.departureLabel, arrival: settings.arrivalLabel }}
                  tripPrice={settings.tripPrice}
                  holidays={holidays}
                  isProfileModalOpen={isProfileModalOpen}
                  onCloseProfileModal={() => setIsProfileModalOpen(false)}
                />;
      case Role.AllocationAdmin:
        return <AdminDashboard 
                  plans={plans}
                  allocations={allocations}
                  onAllocate={handleAllocate}
                  isLoading={isLoading}
                  updatedUsers={updatedUsers}
                  tripLabels={{ departure: settings.departureLabel, arrival: settings.arrivalLabel }}
                  holidays={holidays}
                  onUpdateHolidays={handleUpdateHolidays}
                  allocateForCurrentMonth={settings.allocateForCurrentMonth}
                />;
      case Role.SystemAdmin:
        return <SystemAdminDashboard
                  currentUser={currentUser}
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                />;
      default:
        return <p>Unknown user role.</p>;
    }
  };

  if (isLoading && !currentUser) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading application...</p></div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      {successMessage && <SuccessBanner message={successMessage} onClose={() => setSuccessMessage(null)} />}
        {currentUser && settings && (
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            onProfileClick={currentUser.role === Role.User ? () => setIsProfileModalOpen(true) : undefined}
          />
        )}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!currentUser ? (
          <LoginPage users={users} onLogin={handleLogin} userListViewEnabled={settings?.userListViewEnabled ?? true} />
        ) : (
          renderDashboard()
        )}
      </main>
    </div>
  );
};

export default App;