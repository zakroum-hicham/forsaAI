"use client"
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Key,
  Mail,
  Building2,
  Phone,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const data = [
          { key: 'emailNewApplications', label: 'Email me when new applications are received', desc: 'Get notified immediately when candidates apply to your jobs' },
          { key: 'emailJobUpdates', label: 'Email me about job posting updates', desc: 'Notifications about job status changes and expiration reminders' },
          { key: 'pushNotifications', label: 'Enable push notifications', desc: 'Receive browser notifications for important updates' },
          { key: 'weeklyReport', label: 'Weekly activity report', desc: 'Get a summary of your hiring activity every Monday' }
        ]

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Solutions',
    phone: '+1 (555) 123-4567'
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    "emailNewApplications": true,
    "emailJobUpdates": false,
    "pushNotifications": true,
    "weeklyReport": true
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '24'
  });

  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'password', label: 'Password', icon: Key }
  ];

  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          <p className="text-gray-600 text-sm">Update your personal details and contact information</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.firstName}
                  onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{profileData.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.lastName}
                  onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2">{profileData.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.company}
                onChange={(e) => setTempData({ ...tempData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profileData.company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={tempData.phone}
                onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{profileData.phone}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-gray-600 text-sm">Choose what notifications you&apos;d like to receive</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        {data.map((item) => (
          <div key={item.key} className="flex items-start space-x-3 py-3">
            <button
              onClick={() => handleNotificationChange(item.key as keyof typeof notifications)}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                notifications[item.key as keyof typeof notifications] 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              {notifications[item.key as keyof typeof notifications] && <Check className="w-3 h-3" />}
            </button>
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="text-gray-600 text-sm">Manage your account security preferences</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
            className={`px-4 py-2 rounded text-sm font-medium ${
              security.twoFactor 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {security.twoFactor ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="py-3">
          <label className="block font-medium text-gray-900 mb-2">
            Session Timeout
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Automatically log out after a period of inactivity
          </p>
          <select
            value={security.sessionTimeout}
            onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1">1 hour</option>
            <option value="8">8 hours</option>
            <option value="24">24 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PasswordSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Settings saved successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'password' && <PasswordSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;