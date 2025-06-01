import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';

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
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
                    Hello, {username}!
                </h2>
                <p className="text-[#837c67] text-lg leading-normal max-w-lg">
                    Your profile page is under construction. Stay tuned for updates!
                    <br />
                    (Content coming soon!)
                </p>
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
