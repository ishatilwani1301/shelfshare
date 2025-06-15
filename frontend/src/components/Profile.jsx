import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar'; // Assuming UserAvatar is in the same directory or adjust path accordingly
import api from '../api/axiosConfig'; // Import your axios instance
import { toast } from 'react-toastify'; // Import toast

function Profile() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', // Added username to state for password reset API
    email: '',
    pincode: '',
    // password field removed from main form data as it's only for update,
    // and we'll handle reset separately via modal.
  });
  const [loadingProfile, setLoadingProfile] = useState(true); // Loading state for initial profile fetch
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Loading state for profile update button

  // State for Password Reset Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false); // Loading state for reset password button

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoadingProfile(true);
      if (!token) {
        toast.error('Authentication token not found. Please log in.', { position: 'top-right' });
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await api.get('/user/userDetails', { // Use api (axios)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming data structure from API matches
        setFormData({
          fullName: response.data.name || '',
          username: response.data.username || '', // Essential for password reset API
          email: response.data.email || '',
          pincode: response.data.pincode || '',
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch user details.', { position: 'top-right' });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserDetails();
  }, [token]); // Depend on token

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    if (!token) {
      toast.error('Authentication token not found. Please log in.', { position: 'top-right' });
      setIsUpdatingProfile(false);
      return;
    }

    try {
      const payload = {
        name: formData.fullName, // Ensure your backend expects 'name' or adjust to 'fullName'
        email: formData.email,
        pincode: formData.pincode,
        // Do NOT send password field if it's empty or for update here.
        // This endpoint should only be for profile details.
      };

      const response = await api.put('http://localhost:1234/user/userDetails', payload, { // Use api (axios)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) { // Axios wraps response in .data
        toast.success(response.data?.message || 'Profile updated successfully!', { position: 'top-right' });
      } else {
        toast.error(response.data?.message || 'Failed to update profile.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.', { position: 'top-right' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleResetPassword = () => {
    setNewPassword('');
    setConfirmNewPassword('');
    setShowResetPasswordModal(true);
  };

  const confirmPasswordReset = async () => {
    if (newPassword.length < 6) { // Example: minimum password length
      toast.error('Password must be at least 6 characters long.', { position: 'top-right' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match.', { position: 'top-right' });
      return;
    }

    setIsResettingPassword(true);
    if (!token) {
      toast.error('Authentication token not found. Please log in.', { position: 'top-right' });
      setIsResettingPassword(false);
      return;
    }

    try {
      const payload = {
        username: formData.username, // Use the username fetched from user details
        newPassword: newPassword,
      };

      const response = await api.post('http://localhost:1234/changeUserPassword', payload, { // Use api (axios)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success(response.data?.message || 'Password changed successfully!', { position: 'top-right' });
        setShowResetPasswordModal(false); // Close modal on success
      } else {
        toast.error(response.data?.message || 'Failed to change password.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'An error occurred while changing password.', { position: 'top-right' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-64 w-full bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h2 className="text-3xl font-bold mb-10 self-start text-[#171612]">Profile Dashboard</h2>

      <div className="flex flex-col items-center mb-8">
        <UserAvatar username={formData.fullName || formData.email} size="w-24 h-24" />
        <h3 className="text-xl font-semibold text-gray-800 mt-4">
          {formData.fullName || 'User Name'}
        </h3>
        <p className="text-sm text-gray-500">{formData.username || 'Email'}</p>
      </div>

      <div className="w-full max-w-md">
        {/* Full Name */}
        <div className="mb-6">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>

        {/* Pincode */}
        <div className="mb-6">
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter your pincode"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="px-8 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? 'Updating...' : 'Update Details'}
          </button>
          <button
            type="button"
            onClick={handleResetPassword}
            className="px-8 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center">
            <h3 className="text-2xl font-bold mb-6 text-[#171612]">Change Password</h3>
            <div className="mb-4 text-left">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-6 text-left">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                disabled={isResettingPassword}
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordReset}
                className="px-6 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;