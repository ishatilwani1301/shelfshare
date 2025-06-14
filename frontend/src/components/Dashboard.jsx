import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import users from '../assets/users.png'; // Make sure this path is correct

// Import components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';
import BookDetailPage from './BookDetailPage';
import MyShelf from './Myshelf';
import AddBookPage from './AddBookPage'; // Keep for consistency, MyShelf can handle its own routing now

// --- InputField component (remains the same) ---
const InputField = React.memo(
  ({
    label,
    name,
    value,
    type = 'text',
    placeholder,
    disabled = false,
    onChange,
    isEditingProfile,
  }) => (
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
          onChange={onChange}
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
  )
);

// Component for the welcome message (remains the same)
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
      className="mt-8 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ebd2] pl-4 pr-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d6c4] transition-colors"
    >
      Start Exploring Books
    </button>
  </div>
));

// Component for the profile page (remains the same)
const ProfileContent = React.memo(
  ({
    formData,
    handleInputChange,
    handleAreaChange,
    isEditingProfile,
    handleEditProfileClick,
    handleSaveProfile,
    handleCancelEdit,
    username,
    availableAreas,
  }) => {
    return (
      <div className="flex flex-col items-center w-full p-8 bg-white rounded-lg shadow-md"> {/* Added rounded-lg and shadow-md */}
        <h2 className="text-3xl font-bold mb-10 self-start text-[#171612]">Profile Dashboard</h2>
        <div className="flex flex-col items-center mb-8">
          <img src={users} alt="Profile" className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200" /> {/* Added border */}
          <h3 className="text-xl font-semibold text-gray-800">{username || 'Name'}</h3>
        </div>
        <div className="w-full max-w-md">
          <InputField
            label="Username"
            name="username"
            value={formData.username}
            placeholder="Enter your username"
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            type="email"
            placeholder="Enter your email"
            disabled={true}
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          <InputField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            placeholder="Enter your pincode"
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          {/* Custom rendering for Area field */}
          <div className="mb-6">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            {isEditingProfile && availableAreas.length > 0 ? (
              <select
                id="area"
                name="area"
                value={formData.area}
                onChange={handleAreaChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select your area
                </option>
                {availableAreas.map((areaOption) => (
                  <option key={areaOption} value={areaOption}>
                    {areaOption}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-800">
                {formData.area || 'N/A'}
              </p>
            )}
          </div>
          {/* City, State, Country remain as disabled InputFields */}
          <InputField
            label="City"
            name="city"
            value={formData.city}
            placeholder="City will be filled automatically"
            disabled={true}
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          <InputField
            label="State"
            name="state"
            value={formData.state}
            placeholder="State will be filled automatically"
            disabled={true}
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          <InputField
            label="Country"
            name="country"
            value={formData.country}
            placeholder="Country will be filled automatically"
            disabled={true}
            onChange={handleInputChange}
            isEditingProfile={isEditingProfile}
          />
          <div className="flex justify-center mt-8 space-x-4">
            {isEditingProfile ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditProfileClick}
                className="px-6 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75 transition-colors"
              >
                Update Info
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState(() => {
    const path = window.location.pathname;
    if (path.includes('/dashboard/books')) return 'booksAvailable';
    if (path.includes('/dashboard/my-shelf')) return 'myShelf';
    if (path.includes('/dashboard/profile')) return 'profile';
    if (path.includes('/dashboard/anonymousbooks')) return 'anonymousBookOffers';
    return null; // Default to null or a welcome/home item
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookOfferId, setSelectedBookOfferId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile sidebar

  // Height of the Header component (adjust if your Header's actual height changes)
  const HEADER_HEIGHT_PX = 72; // Based on default py-3 (12px top/bottom) + element height

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
    country: '',
  });
  const [availableAreas, setAvailableAreas] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const AccessToken = localStorage.getItem('accessToken');

  const fetchUserDetails = useCallback(async () => {
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
        const errorData = response.status === 401 ? { message: 'Unauthorized' } : await response.json();
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
      if (data.area) {
        setAvailableAreas([data.area]);
      } else {
        setAvailableAreas([]);
      }
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
      if (
        error.message.includes('Unauthorized') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network Error') // Add network error check
      ) {
        localStorage.removeItem('accessToken');
        setUserData(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [AccessToken, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleInputChange = useCallback(
    async (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (name === 'pincode' && value.length === 6) {
        try {
          const response = await fetch(
            `http://localhost:1234/register/pincodeToAddress/${value}`,
            {
              method: 'GET',
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch address details');
          }
          const data = await response.json();
          let fetchedAreas = [];
          if (Array.isArray(data.area)) {
            fetchedAreas = data.area;
          } else if (typeof data.area === 'string' && data.area) {
            fetchedAreas = [data.area];
          }
          setAvailableAreas(fetchedAreas);
          setFormData((prevData) => ({
            ...prevData,
            area: fetchedAreas.length > 0 ? fetchedAreas[0] : '', // Automatically select first area if available
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
          }));
          toast.success('Address details fetched successfully!', { autoClose: 1500 });
        } catch (error) {
          console.error('Error fetching address details:', error);
          toast.error(`Failed to fetch address for pincode: ${error.message}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFormData((prevData) => ({
            ...prevData,
            area: '',
            city: '',
            state: '',
            country: '',
          }));
          setAvailableAreas([]);
        }
      } else if (name === 'pincode' && value.length < 6 && value.length > 0) { // Clear if incomplete
        setFormData((prevData) => ({
          ...prevData,
          area: '',
          city: '',
          state: '',
          country: '',
        }));
        setAvailableAreas([]);
      }
    },
    []
  );

  const handleAreaChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      area: value,
    }));
  }, []);

  const handleEditProfileClick = useCallback(() => {
    setIsEditingProfile(true);
    toast.info('You can now edit your profile information.', {
      position: 'top-right',
      autoClose: 2000,
    });
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!AccessToken) {
      toast.error('Authentication required to update profile. Please log in.', {
        position: 'top-right',
      });
      navigate('/login');
      return;
    }
    // Basic validation for required fields before saving
    if (!formData.username || !formData.email || !formData.pincode || !formData.area) {
      toast.error('Please fill all required profile fields.', { position: 'top-right' });
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
      console.log('Update result:', result);
      // Update local userData state with new formData values
      setUserData(formData);
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
  }, [AccessToken, formData, navigate, setUserData]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingProfile(false);
    // Revert formData to the original userData values
    setFormData({
      username: userData?.username || '',
      email: userData?.email || '',
      pincode: userData?.pincode || '',
      area: userData?.area || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || '',
    });
    // Reset availableAreas as well, unless the original user data had multiple areas
    if (userData?.area) {
        setAvailableAreas([userData.area]);
    } else {
        setAvailableAreas([]);
    }
    toast.info('Profile changes cancelled.', {
      position: 'top-right',
      autoClose: 2000,
    });
  }, [userData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUserData(null);
    navigate('/login');
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleSidebarNavigate = useCallback(
    (item) => {
      setActiveSidebarItem(item);
      setSearchQuery('');
      setSelectedBookOfferId(null);
      // Close mobile menu when navigating from sidebar
      if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
      }
      if (item === 'booksAvailable') {
        navigate('/dashboard/books');
      } else if (item === 'myShelf') {
        navigate('/dashboard/my-shelf');
      } else if (item === 'profile') {
        navigate('/dashboard/profile');
      } else if (item === 'anonymousBookOffers') {
        navigate('/dashboard/anonymousbooks');
      } else {
        navigate('/dashboard'); // Fallback to welcome/home
      }
    },
    [navigate, isMobileMenuOpen] // Add isMobileMenuOpen to dependencies
  );

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setSelectedBookOfferId(null);
  }, []);

  const handleBackToBookOffersList = useCallback(() => {
    setSelectedBookOfferId(null);
    navigate('/dashboard/anonymousbooks');
  }, [navigate]);

  const handleSelectBookOffer = useCallback((offerId) => {
    setSelectedBookOfferId(offerId);
    navigate(`/dashboard/anonymousbooks/${offerId}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-[#171612] text-lg">Loading ShelfShare...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative flex min-h-screen flex-col bg-gray-100 group/design-root" // Changed bg-white to bg-gray-100 for consistency
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <Header
          username={userData?.username || 'Guest'}
          onLogout={handleLogout}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          toggleMobileMenu={toggleMobileMenu} // Pass toggleMobileMenu
        />
        <main
          className="flex-grow flex items-center justify-center p-4 md:p-8"
          style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d6c4] transition-colors"
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
    <div
      className="relative flex min-h-screen flex-col bg-gray-100 group/design-root" // Changed bg-white to bg-gray-100 for consistency
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <ToastContainer />
      <Header
        username={username}
        onLogout={handleLogout}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        toggleMobileMenu={toggleMobileMenu} // Pass toggleMobileMenu
      />
      <div className="flex flex-1" style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}>
        {/* Pass mobile menu state and toggle function to Sidebar */}
        <Sidebar
          activeItem={activeSidebarItem}
          onNavigate={handleSidebarNavigate}
          isMobileMenuOpen={isMobileMenuOpen} // Pass the state
          toggleMobileMenu={toggleMobileMenu} // Pass the toggle function
        />
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6"> {/* Adjusted padding for mobile */}
          <div className="layout-content-container flex flex-col max-w-[960px] mx-auto flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <WelcomeContent
                    username={username}
                    handleSidebarNavigate={handleSidebarNavigate}
                  />
                }
              />
              <Route
                path="profile"
                element={
                  <ProfileContent
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleAreaChange={handleAreaChange}
                    isEditingProfile={isEditingProfile}
                    handleEditProfileClick={handleEditProfileClick}
                    handleSaveProfile={handleSaveProfile}
                    handleCancelEdit={handleCancelEdit}
                    username={username}
                    availableAreas={availableAreas}
                  />
                }
              />
              <Route
                path="books"
                element={
                  <BooksAvailablePage
                    searchQuery={searchQuery}
                    activeSidebarItem="booksAvailable"
                  />
                }
              />
              <Route path="books/:bookId" element={<BookDetailPage />} />
              {/* MyShelf now handles its own sub-routes */}
              <Route path="my-shelf/*" element={<MyShelf />} />
              
              {/* REMOVED: <Route path="/add-book" element={<AddBookPage />} /> - MyShelf handles this */}
              
              <Route
                path="anonymousbooks"
                element={
                  <AnonymousBooksAvailablePage
                    searchQuery={searchQuery}
                    onSelectBookOffer={handleSelectBookOffer}
                  />
                }
              />
              <Route
                path="anonymousbooks/:offerId"
                element={
                  <AnonymousBookDetailPage onBackToList={handleBackToBookOffersList} />
                }
              />
              <Route
                path="*"
                element={
                  <p className="text-[#837c67] col-span-full text-center py-8">
                    Page Not Found
                  </p>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;