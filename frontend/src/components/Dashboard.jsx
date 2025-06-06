import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';
import BookDetailPage from './BookDetailPage'; 

// If 'user' is an image import, uncomment and provide the correct path:
// import user from '../path/to/your/user-placeholder-image.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookOfferId, setSelectedBookOfferId] = useState(null);

  const HEADER_HEIGHT_PX = 80;
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    pincode: '',
    password: '', // Password field for update, not for pre-filling
  });

  // AccessToken is retrieved once when the component mounts.
  const AccessToken = localStorage.getItem('accessToken');
  console.log('here is Token:', AccessToken);

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
    fetchUserDetails();
    // **CORRECTION 4:** Added AccessToken and navigate to dependency array.
    // AccessToken: if the token were to be updated during runtime (unlikely for localStorage),
    // this would re-fetch. It's safe to keep it for robustness.
    // navigate: generally stable, but including it prevents lint warnings if it were to change.
  }, [AccessToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    // Check if AccessToken exists before making the request
    if (!AccessToken) {
      alert('Authentication required to update profile. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/user/changeUserDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AccessToken}`, // **CORRECTION 5:** Use AccessToken here
        },
        body: JSON.stringify(formData),
      });
       // Log the response status for debugging

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      alert('Profile updated successfully!');
      // Optionally re-fetch user details to update the displayed profile data immediately
      fetchUserDetails();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

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
    // This line clears the selected book offer ID whenever a search query changes,
    // which is generally good behavior to ensure the list view is shown first.
    setSelectedBookOfferId(null);
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
        {/* Pass username to Header even in error state if userData might be partially available */}
        <Header username={userData?.username || 'Guest'} onLogout={handleLogout} onSearchChange={handleSearchChange} searchQuery={searchQuery} />
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

  const username = userData?.username || 'Guest'; // Will now correctly display username if fetched

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
          src="https://via.placeholder.com/150"
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
          <AnonymousBookDetailPage
            bookOfferId={selectedBookOfferId}
            onBackToList={handleBackToBookOffersList}
          />
        );
      } else {
        return (
          <AnonymousBooksAvailablePage
            searchQuery={searchQuery}
            onSelectBookOffer={handleSelectBookOffer}
          />
        );
      }
    }
    return null;
  };
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