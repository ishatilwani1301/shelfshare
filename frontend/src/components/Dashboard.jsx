import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import users from '../assets/users.png';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BooksAvailablePage from './BooksAvailablePage';
import AnonymousBooksAvailablePage from './AnonymousBooksAvailablePage';
import AnonymousBookDetailPage from './AnonymousBookDetailPage';
import BookDetailPage from './BookDetailPage';

// --- InputField component moved outside for better re-render optimization ---
const InputField = React.memo(({ label, name, value, type = 'text', placeholder, disabled = false, onChange, isEditingProfile }) => (
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
));


// Component for the welcome message
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
const ProfileContent = React.memo(({
  formData,
  handleInputChange,
  handleAreaChange, // New prop for area dropdown
  isEditingProfile,
  handleEditProfileClick,
  handleSaveProfile,
  handleCancelEdit,
  username,
  availableAreas, // New prop for area dropdown options
}) => {
  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h2 className="text-3xl font-bold mb-10 self-start">Profile Dashboard</h2>

      <div className="flex flex-col items-center mb-8">
        <img
          src={users}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
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
              onChange={handleAreaChange} // Use the specific area change handler
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            >
              <option value="" disabled>Select your area</option>
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
              className="px-6 py-2 bg-[#F3EBD2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#F3EBD2] focus:outline-none focus:ring-2 focus:ring-[#F3EBD2] focus:ring-opacity-75"
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
const MyShelfContent = React.memo(() => (
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
  const [userData, setUserData] = useState(null);
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

  // New state to hold available areas for the dropdown
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
      // If initial user data has an area, make it available as a selection
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
      if (error.message.includes('Unauthorized') || error.message.includes('Failed to fetch')) {
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

  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;

    // Update formData immediately to reflect typing
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the changed field is pincode and it has 6 digits, fetch address
    if (name === 'pincode' && value.length === 6) {
      try {
        const response = await fetch(`http://localhost:1234/register/pincodeToAddress/${value}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch address details');
        }

        const data = await response.json();
        let fetchedAreas = [];

        // Corrected: Check if the API returns an array directly under 'data.area'
        if (Array.isArray(data.area)) {
          fetchedAreas = data.area;
        } else if (typeof data.area === 'string' && data.area) {
          // Fallback for APIs that return a single area string directly
          fetchedAreas = [data.area];
        }

        setAvailableAreas(fetchedAreas); // Set the dropdown options

        setFormData((prevData) => ({
          ...prevData,
          area: fetchedAreas.length > 0 ? fetchedAreas[0] : '', // Pre-select the first area, or clear
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
        }));
        toast.success("Address details fetched successfully!", { autoClose: 1500 });
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
        // Clear address fields and available areas if fetch fails
        setFormData((prevData) => ({
          ...prevData,
          area: '',
          city: '',
          state: '',
          country: '',
        }));
        setAvailableAreas([]);
      }
    } else if (name === 'pincode' && value.length < 6) {
      // Clear address fields and available areas if pincode is incomplete or invalid
      setFormData((prevData) => ({
        ...prevData,
        area: '',
        city: '',
        state: '',
        country: '',
      }));
      setAvailableAreas([]);
    }
  }, []);

  // New handler specifically for the Area dropdown
  const handleAreaChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      area: value,
    }));
  }, []);


  const handleEditProfileClick = useCallback(() => {
    setIsEditingProfile(true);
    toast.info("You can now edit your profile information.", {
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
  }, [AccessToken, formData, navigate, setUserData]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingProfile(false);
    // Reset formData to the current userData
    setFormData({
      username: userData?.username || '',
      email: userData?.email || '',
      pincode: userData?.pincode || '',
      area: userData?.area || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || '',
    });
    // Clear available areas when cancelling edit
    setAvailableAreas([]);
    toast.info("Profile changes cancelled.", {
      position: 'top-right',
      autoClose: 2000,
    });
  }, [userData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUserData(null);
    navigate('/login');
  }, [navigate]);

  const handleSidebarNavigate = useCallback((item) => {
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
      navigate('/dashboard/anonymousbooks');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setSelectedBookOfferId(null);
  }, []);

  const handleSelectBookOffer = useCallback((offerId) => {
    setSelectedBookOfferId(offerId);

    navigate(`/dashboard/anonymous-offers/${offerId}`);
  }, [navigate]);

    navigate(`/dashboard/anonymousbooks/${offerId}`);
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
                    handleAreaChange={handleAreaChange} // Pass new area change handler
                    isEditingProfile={isEditingProfile}
                    handleEditProfileClick={handleEditProfileClick}
                    handleSaveProfile={handleSaveProfile}
                    handleCancelEdit={handleCancelEdit}
                    username={username}
                    availableAreas={availableAreas} // Pass available areas
                  />
                }
              />
              <Route path="books" element={<BooksAvailablePage searchQuery={searchQuery} activeSidebarItem="booksAvailable" />} />
              <Route path="books/:bookId" element={<BookDetailPage />} />
              <Route path="my-shelf" element={<MyShelfContent />} />
              <Route path="anonymousbooks" element={<AnonymousBooksAvailablePage searchQuery={searchQuery} onSelectBookOffer={handleSelectBookOffer} />} />
              <Route path="anonymousbooks/:offerId" element={<AnonymousBookDetailPage onBackToList={handleBackToBookOffersList} />} />
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