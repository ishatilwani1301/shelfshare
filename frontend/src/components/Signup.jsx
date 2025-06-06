import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Footer from './Footer';
// import cors from 'cors'; // Import CORS for handling CORS issues

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePincodeChange = async (e) => {
    const enteredPincode = e.target.value;
    setPincode(enteredPincode);

    if (enteredPincode.length === 6) { // Validate pincode length
      try {
        // Use a public CORS proxy to bypass the restriction
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `http://www.postalpincode.in/api/pincode/${enteredPincode}`;
        const response = await fetch(`${proxyUrl}${apiUrl}`);
        const data = await response.json();

        if (data.Status === 'Success' && data.PostOffice.length > 0) {
          const location = data.PostOffice[0]; // Automatically select the first post office
          setArea(location.Name || '');
          setCity(location.District || '');
          setState(location.State || '');
          setCountry(location.Country || '');
        } else {
          toast.error('Invalid pincode or no post office found. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setArea('');
          setCity('');
          setState('');
          setCountry('');
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        toast.error('Failed to fetch location data. Please try again later.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

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
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          pincode, 
          area, 
          city, 
          state, 
          country // Include location data in the request body
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong during sign up.');
      }

      const data = await response.json();
      setSuccess(data.message || 'Account created successfully!');

      toast.success(data.message || 'Account created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate after 2 seconds
    } catch (err) {
      setError(err.message);

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
      <ToastContainer />

      <header className="py-4 px-6 md:px-10 bg-white shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-2xl font-bold text-gray-800 tracking-tight">
            ShelfShare
          </a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl flex max-w-3xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
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

          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Create Your Account
            </h1>

            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center text-sm mb-4">{success}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  onChange={handlePincodeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign Up
              </button>
            </form>

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

      <Footer />
    </div>
  );
};

export default SignUp;