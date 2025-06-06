import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';
import BookDetailPage from './BookDetailPage'; 


const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookOfferId, setSelectedBookOfferId] = useState(null);

  const HEADER_HEIGHT_PX = 80;

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
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
    setSearchQuery(''); 
    if (item === 'booksAvailable') {
      navigate('/dashboard/books');
    } else if (item === 'myShelf') {
      navigate('/dashboard/my-shelf');
    } else if (item === 'profile') {
      navigate('/dashboard/profile');
    } else if (item === 'anonymousBookOffers') {
      navigate('/dashboard/anonymous-offers');
    } else {
      navigate('/dashboard'); 
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedBookOfferId(null); 
  };

  
  const handleSelectBookOffer = (offerId) => {
    setSelectedBookOfferId(offerId);
    navigate(`/dashboard/anonymous-offers/${offerId}`);
  };

  const handleBackToBookOffersList = () => {
    setSelectedBookOfferId(null);
    navigate('/dashboard/anonymous-offers');
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

  const WelcomeContent = () => (
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

  const ProfileContent = () => (
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

  const MyShelfContent = () => (
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


  // const renderMainContent = () => {
  //   if (activeSidebarItem === null) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-full text-center p-8">
  //         <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
  //           Welcome, {username}!
  //         </h2>
  //         <p className="text-[#837c67] text-lg leading-normal max-w-lg">
  //           Dive into your literary world. You can explore new books, manage your shelf, and connect with other readers.
  //         </p>
  //         <button
  //           onClick={() => handleSidebarNavigate('booksAvailable')}
  //           className="mt-8 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ebd2] pl-4 pr-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
  //         >
  //           Start Exploring Books
  //         </button>
  //       </div>
  //     );
  //   } else if (activeSidebarItem === 'profile') {
  //     return (
  //         <div className="flex flex-col items-center justify-center h-full text-center p-8">
  //             <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
  //                 Hello, {username}!
  //             </h2>
  //             <p className="text-[#837c67] text-lg leading-normal max-w-lg">
  //                 Your profile page is under construction. Stay tuned for updates!
  //                 <br />
  //                 (Content coming soon!)
  //             </p>
  //         </div>
  //     );
  // } else if (activeSidebarItem === 'booksAvailable') {
  //     return (
  //       <BooksAvailablePage
  //         searchQuery={searchQuery}
  //         activeSidebarItem={activeSidebarItem}
  //       />
  //     );
  //   } else if (activeSidebarItem === 'myShelf') {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-full text-center p-8">
  //         <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight mb-4">
  //           My Bookshelf
  //         </h2>
  //         <p className="text-[#837c67] text-lg leading-normal max-w-lg">
  //           This is where your personal collection will appear.
  //           <br />
  //           (Content coming soon!)
  //         </p>
  //       </div>
  //     );
  //   } else if (activeSidebarItem === 'anonymousBookOffers') {
  //     if (selectedBookOfferId) {
  //       return (
  //         <AnonymousBookDetailPage // Corrected component name
  //           bookOfferId={selectedBookOfferId}
  //           onBackToList={handleBackToBookOffersList}
  //         />
  //       );
  //     } else {
  //       return (
  //         <AnonymousBooksAvailablePage // Corrected component name
  //           searchQuery={searchQuery}
  //           onSelectBookOffer={handleSelectBookOffer}
  //         />
  //       );
  //     }
  //   }
  //   return null;
  // };

  return (
    <div className="relative flex min-h-screen flex-col bg-white group/design-root" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <Header username={username} onLogout={handleLogout} onSearchChange={handleSearchChange} searchQuery={searchQuery} />

      <div className="flex flex-1" style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}>
        <Sidebar activeItem={activeSidebarItem} onNavigate={handleSidebarNavigate} />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] mx-auto flex-1">
            <Routes>
              <Route path="/" element={<WelcomeContent />} />
              <Route path="profile" element={<ProfileContent />} />
              <Route path="books" element={<BooksAvailablePage searchQuery={searchQuery} activeSidebarItem="booksAvailable" />} />
              <Route path="books/:bookId" element={<BookDetailPage />} /> {/* New Route for book detail */}
              <Route path="my-shelf" element={<MyShelfContent />} />
              <Route path="anonymous-offers" element={<AnonymousBooksAvailablePage searchQuery={searchQuery} onSelectBookOffer={handleSelectBookOffer} />} />
              <Route path="anonymous-offers/:offerId" element={<AnonymousBookDetailPage onBackToList={handleBackToBookOffersList} />} />
              <Route path="*" element={<p className="text-[#837c67] col-span-full text-center py-8">Page Not Found</p>} />
            </Routes>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};


export default Dashboard;
