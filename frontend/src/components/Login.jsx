import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Footer from './Footer';

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:1234/login/userLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }), // Send email as username
      });

      if (!response.ok) {
        // If the server response is not OK (e.g., 403 Forbidden, 400 Bad Request)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      console.error('Login successful:', data.jwt);

      // Store the access token (e.g., in localStorage)
      localStorage.setItem('accessToken', data.jwt);

      // Show success toast
      toast.success(data.message || 'Login successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to a protected page or dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard'); // Change '/dashboard' to your actual protected route
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message); // Display the error message to the user
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Toastify Container */}
      <ToastContainer />

      {/* Header Section */}
      <header className="py-4 px-6 md:px-10 bg-white shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
            ShelfShare
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl flex max-w-3xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-yellow-50 to-orange-100 flex flex-col items-center justify-center p-6 relative">
            <div className="relative z-10 flex flex-col items-center text-center">
              <img
                src="https://via.placeholder.com/200x150/FEECE2/E67E22?text=Bookshelf+Illustration"
                alt="Bookshelf and Reading Illustration"
                className="w-full max-w-[10rem] h-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-2">Welcome back</h2>
              <p className="text-sm text-gray-600 max-w-xs">
                Share your books with your community and discover new reads.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Login</h1>

            {/* Display error message */}
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition duration-200 ease-in-out text-gray-800 text-sm"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition duration-200 ease-in-out text-gray-800 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-3 focus:ring-yellow-300 transition duration-300 ease-in-out transform hover:scale-[1.01]"
              >
                Login
              </button>
            </form>
            <p className="text-center text-xs text-gray-600 mt-6">
              Don't have an account?{' '}
              <a href="/signup" className="text-yellow-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Login;