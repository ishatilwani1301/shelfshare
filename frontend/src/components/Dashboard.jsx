import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';


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

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      // In a real app, this would be an API call to get user info
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setUserData({ username: 'ShelfSharer' }); // Set mock user data
    } catch (err) {
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
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
