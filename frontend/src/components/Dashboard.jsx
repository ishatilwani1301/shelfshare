import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('No access token found. Please log in.');
      navigate('/login'); // Redirect to login if no token
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual protected user data endpoint
      const response = await fetch('http://localhost:1234/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid, or forbidden access
        setError('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('accessToken'); // Clear invalid token
        navigate('/login'); // Redirect to login
        return;
      }

      if (!response.ok) {
        const errorDetail = await response.text(); // Get raw text for more info
        throw new Error(`Failed to fetch user data: ${response.status} ${errorDetail}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      
      // localStorage.removeItem('accessToken');
      // navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call fetchUserData when the component mounts
    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear access token
     navigate('/login'); // Redirect to login page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-gray-700 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
        <header className="py-4 px-6 md:px-10 bg-white shadow-sm">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <a href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
              ShelfShare
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </nav>
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Assuming `userData` contains `username` and potentially other fields like `totalBooks`, `booksShared` etc.
  const username = userData?.username || 'User'; // Fallback if username is not in userData

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Header Section */}
      <header className="py-4 px-6 md:px-10 bg-white shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
            ShelfShare
          </a>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-lg font-medium">Hello, {username}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area - Dashboard Elements */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
            Your ShelfShare Dashboard
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            Manage your books, connect with the community, and explore new reads.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats Card 1 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg shadow-md text-center border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Total Books Shared</h3>
              <p className="text-4xl font-extrabold text-yellow-600">{userData?.totalBooks || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Books you've made available</p>
            </div>

            {/* Quick Stats Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-100 p-6 rounded-lg shadow-md text-center border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Books Borrowed</h3>
              <p className="text-4xl font-extrabold text-blue-600">{userData?.booksBorrowed || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Books you've enjoyed from others</p>
            </div>

            {/* Quick Stats Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg shadow-md text-center border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community Rating</h3>
              <p className="text-4xl font-extrabold text-purple-600">{userData?.communityRating || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-2">Your average rating from others</p>
            </div>
          </div>
        </div>

        {/* Action Buttons / Navigation */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/add-book')}
              className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-green-300"
            >
              <i className="fas fa-plus-circle mr-2"></i> Add a New Book
            </button>
            <button
              onClick={() => navigate('/my-books')}
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-blue-300"
            >
              <i className="fas fa-book mr-2"></i> My Bookshelf
            </button>
            <button
              onClick={() => navigate('/find-books')}
              className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-purple-300"
            >
              <i className="fas fa-search mr-2"></i> Find Books to Borrow
            </button>
            <button
              onClick={() => navigate('/community')}
              className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-orange-300"
            >
              <i className="fas fa-users mr-2"></i> Community Forum
            </button>
          </div>
        </div>

        {/* Recent Activity Section (Example) */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm border border-gray-100">
              <i className="fas fa-exchange-alt text-blue-500 text-lg mr-3"></i>
              <p className="text-gray-700">You borrowed **"The Midnight Library"** from Jane Doe.</p>
              <span className="ml-auto text-sm text-gray-500">2 days ago</span>
            </li>
            <li className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm border border-gray-100">
              <i className="fas fa-upload text-green-500 text-lg mr-3"></i>
              <p className="text-gray-700">You added **"Project Hail Mary"** to your shared shelf.</p>
              <span className="ml-auto text-sm text-gray-500">5 days ago</span>
            </li>
            <li className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm border border-gray-100">
              <i className="fas fa-star text-yellow-500 text-lg mr-3"></i>
              <p className="text-gray-700">Sarah M. rated your book **"Dune"** 5 stars!</p>
              <span className="ml-auto text-sm text-gray-500">1 week ago</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Dashboard;