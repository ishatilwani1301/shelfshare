import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import users from '../assets/users.png'; // Assuming this is a placeholder image for user profile

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';
import BookDetailPage from './BookDetailPage';

// --- Move these components OUTSIDE the Dashboard component ---

// Component for the welcome message
// Use React.memo if WelcomeContent has complex rendering or many props,
// but for simple components like this, it might not be strictly necessary,
// but good practice for consistency.
const WelcomeContent = React.memo(({ username, handleSidebarNavigate }) => (
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
));

// Component for the profile page
// Now wrapped with React.memo to prevent unnecessary re-renders
const ProfileContent = React.memo(({
  formData,
  handleInputChange,
  isEditingProfile,
  handleEditProfileClick,
  handleSaveProfile,
  handleCancelEdit,
  username,
  email,
}) => {
  // Helper component for input fields
  // Using React.memo here too for further optimization, though less critical
  // if InputField is simple and its parent (ProfileContent) is already memoized.
  const InputField = React.memo(({ label, name, value, type = 'text', placeholder, disabled = false }) => (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isEditingProfile ? (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <p className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-800">
          {value || 'N/A'}
        </p>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h2 className="text-3xl font-bold mb-10 self-start">Profile Dashboard</h2>

      <div className="flex flex-col items-center mb-8">
        {/* Placeholder profile image */}
        <img
          src={users}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
         <h3 className="text-xl font-semibold text-gray-800">{username || 'Name'}</h3>
        {/* <p className="text-sm text-gray-500">{email || 'Email'}</p>  */}
      </div>

      <div className="w-full max-w-md">
        <InputField label="Username" name="username" value={formData.username} placeholder="Enter your username" />
        {/* Email is usually not directly editable without separate verification */}
        <InputField label="Email" name="email" value={formData.email} type="email" placeholder="Enter your email" disabled={true} />
        <InputField label="Pincode" name="pincode" value={formData.pincode} placeholder="Enter your pincode" />
        <InputField label="Area" name="area" value={formData.area} placeholder="Enter your area" />
        <InputField label="City" name="city" value={formData.city} placeholder="Enter your city" />
        <InputField label="State" name="state" value={formData.state} placeholder="Enter your state" />
        <InputField label="Country" name="country" value={formData.country} placeholder="Enter your country" />

        <div className="flex justify-center mt-8 space-x-4">
          {isEditingProfile ? (
            <>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditProfileClick}
              className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Update Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// Component for My Bookshelf
const MyShelfContent = React.memo(() => ( // Memoize this too
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
));


// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Stores the authoritative user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState(() => {
    const path = window.location.pathname;
    if (path.includes('/dashboard/books')) return 'booksAvailable';
    if (path.includes('/dashboard/my-shelf')) return 'myShelf';
    if (path.includes('/dashboard/profile')) return 'profile';
    if (path.includes('/dashboard/anonymous-offers')) return 'anonymousBookOffers';
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookOfferId, setSelectedBookOfferId] = useState(null);

  const HEADER_HEIGHT_PX = 80;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
    country: '',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const AccessToken = localStorage.getItem('accessToken');

  const fetchUserDetails = useCallback(async () => { // Memoize fetchUserDetails
    if (!AccessToken) {
      setError('No access token found. Please log in.');
      setLoading(false);
      navigate('/login');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user details');
      }

      const data = await response.json();

      setUserData(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        pincode: data.pincode || '',
        area: data.area || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
      });
      setError('');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError(error.message || 'Failed to fetch user details.');
      toast.error(error.message || 'Failed to fetch user details.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (error.message.includes('Unauthorized') || error.message.includes('Failed to fetch')) {
        localStorage.removeItem('accessToken');
        setUserData(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [AccessToken, navigate]); // Dependencies for useCallback

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]); // Now depend on the memoized fetchUserDetails

  const handleInputChange = useCallback((e) => { // Memoize handleInputChange
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []); // No dependencies, as setFormData is stable

  const handleEditProfileClick = useCallback(() => { // Memoize handleEditProfileClick
    setIsEditingProfile(true);
    toast.info("You can now edit your profile information.", {
      position: 'top-right',
      autoClose: 2000,
    });
  }, []); // No dependencies, setIsEditingProfile is stable

  const handleSaveProfile = useCallback(async () => { // Memoize handleSaveProfile
    if (!AccessToken) {
      toast.error('Authentication required to update profile. Please log in.', {
        position: 'top-right',
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/user/changeUserDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AccessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      console.log("Update result:", result);

      setUserData(formData); // Update the main user data state with the new form data

      toast.success(result.message || 'Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [AccessToken, formData, navigate, setUserData]); // Dependencies for useCallback

  const handleCancelEdit = useCallback(() => { // Memoize handleCancelEdit
    setIsEditingProfile(false);
    setFormData({
      username: userData?.username || '',
      email: userData?.email || '',
      pincode: userData?.pincode || '',
      area: userData?.area || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || '',
    });
    toast.info("Profile changes cancelled.", {
      position: 'top-right',
      autoClose: 2000,
    });
  }, [userData]); // userData is a dependency because it's used to reset formData

  const handleLogout = useCallback(() => { // Memoize handleLogout
    localStorage.removeItem('accessToken');
    setUserData(null);
    navigate('/login');
  }, [navigate]);

  const handleSidebarNavigate = useCallback((item) => { // Memoize handleSidebarNavigate
    setActiveSidebarItem(item);
    setSearchQuery('');
    setSelectedBookOfferId(null);
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
  }, [navigate]);

  const handleSearchChange = useCallback((query) => { // Memoize handleSearchChange
    setSearchQuery(query);
    setSelectedBookOfferId(null);
  }, []);

  const handleSelectBookOffer = useCallback((offerId) => { // Memoize handleSelectBookOffer
    setSelectedBookOfferId(offerId);
    navigate(`/dashboard/anonymous-offers/${offerId}`);
  }, [navigate]);

  const handleBackToBookOffersList = useCallback(() => { // Memoize handleBackToBookOffersList
    setSelectedBookOfferId(null);
    navigate('/dashboard/anonymous-offers');
  }, [navigate]);

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

  const username = userData?.username || 'Guest';

  return (
    <div className="relative flex min-h-screen flex-col bg-white group/design-root" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <ToastContainer />
      <Header username={username} onLogout={handleLogout} onSearchChange={handleSearchChange} searchQuery={searchQuery} />

      <div className="flex flex-1" style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}>
        <Sidebar activeItem={activeSidebarItem} onNavigate={handleSidebarNavigate} />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] mx-auto flex-1">
            <Routes>
              <Route path="/" element={<WelcomeContent username={username} handleSidebarNavigate={handleSidebarNavigate} />} />
              <Route
                path="profile"
                element={
                  <ProfileContent
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isEditingProfile={isEditingProfile}
                    handleEditProfileClick={handleEditProfileClick}
                    handleSaveProfile={handleSaveProfile}
                    handleCancelEdit={handleCancelEdit}
                    username={username}
                    email={formData.email}
                  />
                }
              />
              <Route path="books" element={<BooksAvailablePage searchQuery={searchQuery} activeSidebarItem="booksAvailable" />} />
              <Route path="books/:bookId" element={<BookDetailPage />} />
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
}

export default Dashboard;