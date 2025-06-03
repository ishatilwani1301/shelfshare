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

  // Define header height for padding consistently
  const HEADER_HEIGHT_PX = 80;

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    // --- TEMPORARILY SIMULATE SUCCESS FOR UI PREVIEW ---
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserData({ username: 'ShelfSharer' });
    setLoading(false);
    // --- END SIMULATION ---

    /*
    // --- UNCOMMENT THIS BLOCK AND REMOVE THE SIMULATION WHEN YOU HAVE A BACKEND ---
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('No access token found. Please log in.');
      navigate('/login');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('accessToken');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Failed to fetch user data: ${response.status} ${errorDetail}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // --- END ACTUAL FETCH LOGIC ---
    */
  };

  useEffect(() => {
    fetchUserData();
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
    // When typing in search, it makes sense to show books,
    // so let's automatically switch to 'booksAvailable' and highlight it.
    setActiveSidebarItem('booksAvailable');
  };

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
          <div className="flex flex-col items-center w-full p-8 bg-white"> {/* Changed background to white and adjusted padding/width as needed */}
              <h2 className="text-3xl font-bold mb-10 self-start">Profile Dashboard</h2> {/* Added title */}
  
              <div className="flex flex-col items-center mb-8"> {/* Container for image and name/username */}
                  <img
                      src={user} // Replace with actual image source or a dynamic variable
                      alt="Olivia Carter"
                      className="w-24 h-24 rounded-full mb-4 object-cover" // Circular image
                  />
                  <h3 className="text-xl font-semibold text-gray-800">Name</h3>
                  <p className="text-sm text-gray-500">username</p>
              </div>
  
              <div className="w-full max-w-md"> {/* Form container */}
                  <div className="mb-6">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                      </label>
                      <input
                          type="text"
                          id="username"
                          name="username"
                          // value={username} // Assuming you have a state for this
                          // onChange={handleInputChange} // Assuming you have a change handler
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                          placeholder="" // Placeholder can be empty as per UI
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
                          // value={email}
                          // onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                          placeholder=""
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
                          // value={pincode}
                          // onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                          placeholder=""
                      />
                  </div>
  
                  <div className="mb-8"> {/* Increased bottom margin before the button */}
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                      </label>
                      <input
                          type="password"
                          id="password"
                          name="password"
                          // value={password}
                          // onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                          placeholder=""
                      />
                  </div>
  
                  <div className="flex justify-center"> {/* Centering the button */}
                      <button
                          type="submit" // Or "button" if it doesn't submit a form
                          // onClick={handleUpdateProfile} // Assuming you have an update handler
                          className="px-8 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
                      >
                          Update
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
    } else if (activeSidebarItem === 'anonymousBooks') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
            Anonymous Books
          </h2>
          <p className="text-[#837c67] text-lg leading-normal max-w-lg">
            Explore books shared anonymously by others.
            <br />
            (Content coming soon!)
          </p>
        </div>
      );
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
