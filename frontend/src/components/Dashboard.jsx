import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import user from '../assets/user.jpg' // Placeholder for user profile image

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState(null); // null for initial welcome page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookOfferId, setSelectedBookOfferId] = useState(null);

  // Define header height for padding consistently
  const HEADER_HEIGHT_PX = 80;

  const AccessToken = localStorage.getItem('accessToken');

  const fetchUserDetails = async () => {
    if (!AccessToken) {
      setError('No access token found. Please log in.');
      setLoading(false);
      navigate('/login'); // Redirect to login if no token
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/user/userDetails', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json(); // Await the JSON parsing
        throw new Error(errorData.message || 'Failed to fetch user details');
      }

      const data = await response.json(); // Await the JSON parsing
      console.log('User details:', data); // This will log the resolved object

      setUserData(data); // Update the userData state
      setFormData({
        username: data.username || '',
        email: data.email || '',
        pincode: data.pincode || '',
        area: data.area || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        password: '', // Do not pre-fill the password for security reasons
      });
      setError('');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError(error.message || 'Failed to fetch user details.');
      if (error.message.includes('Unauthorized')) {
        localStorage.removeItem('accessToken');
        setUserData(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUserData(null);
    navigate('/login');
  };

  const handleSidebarNavigate = (item) => {
    setActiveSidebarItem(item);
    setSearchQuery(''); // Clear search when navigating sidebar
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (activeSidebarItem !== 'booksAvailable' && activeSidebarItem !== 'anonymousBookOffers') { 
    }
    setSelectedBookOfferId(null); 
  };

  
  const handleSelectBookOffer = (offerId) => {
    setSelectedBookOfferId(offerId);
    setActiveSidebarItem('anonymousBookOffers');
  };

  const handleBackToBookOffersList = () => {
    setSelectedBookOfferId(null);
  }; // <--- ADD THIS CLOSING CURLY BRACE

  // --- Loading and Error States --- // <--- This is where the 'if (loading)' block should begin.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <p className="text-[#171612] text-lg">Loading ShelfShare...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-white group/design-root" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
        <Header username={null} onLogout={handleLogout} onSearchChange={handleSearchChange} searchQuery={searchQuery} />
        <main className="flex-grow flex items-center justify-center p-4"
              style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}>
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const username = userData?.username || 'Guest';

  const renderMainContent = () => {
    if (activeSidebarItem === null) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
            Welcome, {username}!
          </h2>
          <p className="text-[#837c67] text-lg leading-normal max-w-lg">
            Dive into your literary world. You can explore new books, manage your shelf, and connect with other readers.
          </p>
          <button
            onClick={() => handleSidebarNavigate('booksAvailable')}
            className="mt-8 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ebd2] pl-4 pr-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Start Exploring Books
          </button>
        </div>
      );
    } else if (activeSidebarItem === 'profile') {
      return (
        <div className="flex flex-col items-center w-full p-8 bg-white">
          <h2 className="text-3xl font-bold mb-10 self-start">Profile Dashboard</h2>

          <div className="flex flex-col items-center mb-8">
            {/* Placeholder profile image */}
            <img
              src={user}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">{formData.username || 'Name'}</h3>
            <p className="text-sm text-gray-500">{formData.email || 'Email'}</p>
          </div>

          <div className="w-full max-w-md">
            {/* Username Field */}
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

            {/* Email Field */}
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

            {/* Pincode Field */}
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

            {/* Area Field */}
            <div className="mb-6">
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter your area"
              />
            </div>

            {/* City Field */}
            <div className="mb-6">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter your city"
              />
            </div>

            {/* State Field */}
            <div className="mb-6">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter your state"
              />
            </div>

            {/* Country Field */}
            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter your country"
              />
            </div>

            {/* Update Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="px-8 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      );
    } else if (activeSidebarItem === 'booksAvailable') {
      return (
        <BooksAvailablePage
          searchQuery={searchQuery}
          activeSidebarItem={activeSidebarItem}
        />
      );
    } else if (activeSidebarItem === 'myShelf') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
            My Bookshelf
          </h2>
          <p className="text-[#837c67] text-lg leading-normal max-w-lg">
            This is where your personal collection will appear.
            <br />
            (Content coming soon!)
          </p>
        </div>
      );
    } else if (activeSidebarItem === 'anonymousBookOffers') {
      if (selectedBookOfferId) {
        return (
          <AnonymousBookDetailPage // Corrected component name
            bookOfferId={selectedBookOfferId}
            onBackToList={handleBackToBookOffersList}
          />
        );
      } else {
        return (
          <AnonymousBooksAvailablePage // Corrected component name
            searchQuery={searchQuery}
            onSelectBookOffer={handleSelectBookOffer}
          />
        );
      }
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white group/design-root" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      {/* Header is fixed at the top */}
      <Header username={username} onLogout={handleLogout} onSearchChange={handleSearchChange} searchQuery={searchQuery} />

      {/* This flex container holds the Sidebar and the Main Content. */}
      {/* It pushes down by HEADER_HEIGHT_PX and stretches to fill remaining height */}
      <div className="flex flex-1" style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}>
        {/* Sidebar is now part of the flex flow, not fixed */}
        <Sidebar activeItem={activeSidebarItem} onNavigate={handleSidebarNavigate} />

        {/* Main content area - takes remaining space, has overflow-y-auto */}
        <main
          className="flex-1 overflow-y-auto px-6 py-5"
          // Removed marginLeft, flex handles the spacing
        >
          {/* Inner container for main content with max width and centered */}
          <div className="layout-content-container flex flex-col max-w-[960px] mx-auto flex-1">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Footer is placed at the very bottom of the flex column, spanning full width */}
      <Footer />
    </div>
  );
};


export default Dashboard;
