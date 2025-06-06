import React, { useState, useEffect } from 'react';
import user from '../assets/user.jpg';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    pincode: '',
    password: '',
  });

  const token = localStorage.getItem('accessToken');
  console.log('here is Token:', token);
  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/user/userDetails', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        console.log('User details:', data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          pincode: data.pincode || '',
          password: '', // Do not pre-fill the password
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/user/userDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h2 className="text-3xl font-bold mb-10 self-start">Profile Dashboard</h2>

      <div className="flex flex-col items-center mb-8">
        <img
          src={user}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h3 className="text-xl font-semibold text-gray-800">{formData.username || 'Name'}</h3>
        <p className="text-sm text-gray-500">{formData.email || 'username'}</p>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter your username"
          />
        </div>

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

        <div className="mb-8">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="px-8 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;