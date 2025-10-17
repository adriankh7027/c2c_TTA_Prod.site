import React, { useState, useEffect } from 'react';
import { User, Role, SystemSettings } from '../types';
import Card from '../components/Card';

interface SystemAdminDashboardProps {
  currentUser: User;
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'pin'> & { role: Role }) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
}

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({
  currentUser,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  settings,
  onUpdateSettings,
}) => {
  // User Form State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<Role>(Role.User);
  const [userSendEmail, setUserSendEmail] = useState(true);

  // Settings Form State
  const [currentSettings, setCurrentSettings] = useState<SystemSettings>(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsAdding(false);
    setUserName(user.name);
    setUserEmail(user.email || '');
    setUserRole(user.role);
    setUserSendEmail(user.sendEmail ?? true);
  };

  const handleAddNewClick = () => {
    setEditingUser(null);
    setIsAdding(true);
    setUserName('');
    setUserEmail('');
    setUserRole(Role.User);
    setUserSendEmail(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    if (editingUser) {
      onUpdateUser({ ...editingUser, name: userName, role: userRole, email: userEmail, sendEmail: userSendEmail });
    } else if (isAdding) {
      onAddUser({ name: userName, role: userRole, email: userEmail, sendEmail: userSendEmail });
    }
    handleCancelEdit();
  };

  const handleSettingsFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(currentSettings);
  };

  const handleSettingChange = (field: keyof SystemSettings, value: any) => {
    setCurrentSettings(prev => ({ ...prev!, [field]: value }));
  };

  const getRoleName = (role: Role) => {
    switch (role) {
      case Role.SystemAdmin: return 'System Admin';
      case Role.AllocationAdmin: return 'Allocation Admin';
      default: return 'User';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold text-slate-800">System Administration</h2>
        <p className="text-slate-600">Manage users and system-wide settings.</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">User Management</h3>
            <button onClick={handleAddNewClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
              Add New User
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b-2 text-slate-600">Name</th>
                  <th className="p-2 border-b-2 text-slate-600">Email</th>
                  <th className="p-2 border-b-2 text-slate-600">Role</th>
                  <th className="p-2 border-b-2 text-slate-600 text-center">Send Email</th>
                  <th className="p-2 border-b-2 text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2 text-slate-700 font-semibold">{user.name}</td>
                    <td className="p-2 text-slate-500">{user.email || 'N/A'}</td>
                    <td className="p-2 text-slate-500">{getRoleName(user.role)}</td>
                    <td className="p-2 text-slate-500 text-center">{user.sendEmail ? '✔️' : '❌'}</td>
                    <td className="p-2 text-right space-x-2">
                      <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-800 font-semibold">Edit | </button>
                      {user.id !== currentUser.id && (
                        <button onClick={() => onDeleteUser(user.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">System Settings</h3>
          <form onSubmit={handleSettingsFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="departureLabel" className="block text-sm font-medium text-slate-700">Departure Label</label>
              <input
                id="departureLabel"
                type="text"
                value={currentSettings.departureLabel}
                onChange={(e) => handleSettingChange('departureLabel', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="arrivalLabel" className="block text-sm font-medium text-slate-700">Arrival Label</label>
              <input
                id="arrivalLabel"
                type="text"
                value={currentSettings.arrivalLabel}
                onChange={(e) => handleSettingChange('arrivalLabel', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="tripPrice" className="block text-sm font-medium text-slate-700">Trip Price (₹)</label>
              <input
                id="tripPrice"
                type="number"
                value={currentSettings.tripPrice}
                onChange={(e) => handleSettingChange('tripPrice', Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="0"
              />
            </div>
            <div className="flex items-center pt-2">
              <input
                id="allocateCurrentMonth"
                type="checkbox"
                checked={currentSettings.allocateForCurrentMonth}
                onChange={(e) => handleSettingChange('allocateForCurrentMonth', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="allocateCurrentMonth" className="ml-3 block text-sm font-medium text-slate-700">
                Allocate For Current Month
              </label>
            </div>
             <div className="flex items-center pt-2">
              <input
                id="userListViewEnabled"
                type="checkbox"
                checked={currentSettings.userListViewEnabled}
                onChange={(e) => handleSettingChange('userListViewEnabled', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="userListViewEnabled" className="ml-3 block text-sm font-medium text-slate-700">
                User List View in Main Screen
              </label>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold !mt-6">
              Save Settings
            </button>
          </form>
        </Card>
      </div>

      {(isAdding || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelEdit}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{isAdding ? 'Add New User' : 'Edit User'}</h3>
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-slate-700">User Name</label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
               <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="userRole" className="block text-sm font-medium text-slate-700">Role</label>
                <select
                  id="userRole"
                  value={userRole}
                  onChange={(e) => setUserRole(Number(e.target.value) as Role)}
                  disabled={editingUser?.id === currentUser.id}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-indigo-800 font-semibold bg-indigo-50 border-indigo-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value={Role.User}>User</option>
                  <option value={Role.AllocationAdmin}>Allocation Admin</option>
                  <option value={Role.SystemAdmin}>System Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="userSendEmail"
                  type="checkbox"
                  checked={userSendEmail}
                  onChange={(e) => setUserSendEmail(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="userSendEmail" className="ml-3 block text-sm font-medium text-slate-700">
                  Send Email
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold">Save User</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
