import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Footer from './Footer';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      const response = await fetch('http://localhost:1234/register/createNewUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, pincode }), // Send pincode as well
      });

      if (!response.ok) {
        // If the response is not OK (e.g., 400, 500 status)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong during sign up.');
      }

      const data = await response.json();
      setSuccess(data.message || 'Account created successfully!');

      // Show success toast
      toast.success(data.message || 'Account created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Optionally, navigate to login page or a dashboard after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate after 2 seconds
    } catch (err) {
      setError(err.message);

      // Show error toast
      toast.error(err.message || 'Signup failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
          <div className="w-1/2 bg-gradient-to-br from-yellow-50 to-orange-100 flex flex-col items-center justify-center p-6 relative text-center">
            <div className="relative z-10 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/200x150/E0F2F7/3399FF?text=Join+Us!"
                alt="Join ShelfShare Community"
                className="w-full max-w-[10rem] h-auto mb-4"
              />
              <h2 className="text-2xl font-extrabold text-gray-800 leading-tight mb-2">
                Join the ShelfShare Community
              </h2>
              <p className="text-sm text-gray-600 max-w-xs">
                Connect with fellow book lovers.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Create Your Account
            </h1>

            {/* Display error and success messages */}
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center text-sm mb-4">{success}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
                />
              </div>

              {/* Pincode Field */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  placeholder="Your 6-digit pincode"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign Up
              </button>
            </form>

            {/* Link to Sign In Page */}
            <p className="text-center text-xs text-gray-600 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-yellow-500 font-semibold hover:underline hover:text-yellow-600 transition duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default SignUp;