import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
// import cors from 'cors'; // Import CORS for handling CORS issues

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');

  // New state to store the array of available areas
  const [availableAreas, setAvailableAreas] = useState([]);
  // State for the selected area
  const [selectedArea, setSelectedArea] = useState('');

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ref for debouncing the pincode API call
  const pincodeTimeoutRef = useRef(null);

  // Function to fetch address details based on pincode
  const fetchAddressByPincode = async (currentPincode) => {
    // Clear previous address data and available areas when pincode changes
    setAvailableAreas([]);
    setSelectedArea('');
    setCity('');
    setState('');
    setCountry('');
    setError('');

    if (currentPincode.length !== 6) { // Assuming 6-digit pincode for India
      return;
    }

    try {
      const response = await fetch(`http://localhost:1234/register/pincodeToAddress/${currentPincode}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Pincode not found or invalid.' }));
        throw new Error(errorData.message || 'Pincode not found or invalid.');
      }

      const data = await response.json();

      if (data.area && Array.isArray(data.area) && data.area.length > 0) {
        setAvailableAreas(data.area);
        // If there's only one area, pre-select it
        if (data.area.length === 1) {
          setSelectedArea(data.area[0]);
        } else {
          setSelectedArea(''); // Force user to select if multiple
        }
      } else {
        setAvailableAreas([]);
        setSelectedArea('');
        toast.warn('No specific areas found for this pincode.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || '');

    } catch (err) {
      setError(err.message);
      setAvailableAreas([]);
      setSelectedArea('');
      setCity('');
      setState('');
      setCountry('');
      toast.error(err.message, {
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

  // Handle pincode input change with debouncing
  const handlePincodeChange = (e) => {
    const newPincode = e.target.value;
    setPincode(newPincode);

    // Clear previous timeout
    if (pincodeTimeoutRef.current) {
      clearTimeout(pincodeTimeoutRef.current);
    }

    // Set a new timeout to fetch address after a delay
    pincodeTimeoutRef.current = setTimeout(() => {
      fetchAddressByPincode(newPincode);
    }, 500); // Debounce for 500ms
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Validation: Ensure pincode is filled and if multiple areas are available, one is selected
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode.');
      toast.error('Please enter a valid 6-digit pincode.', { position: 'top-right' });
      return;
    }

    if (availableAreas.length > 1 && !selectedArea) {
      setError('Please select your area from the dropdown.');
      toast.error('Please select your area from the dropdown.', { position: 'top-right' });
      return;
    }

    // If pincode was entered and no address data was fetched (e.g., invalid pincode after fetch)
    if (pincode && (!city || !state || !country || (availableAreas.length > 0 && !selectedArea))) {
        setError('Please ensure a valid pincode is entered and address details are populated.');
        toast.error('Please ensure a valid pincode is entered and address details are populated.', { position: 'top-right' });
        return;
    }


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
          area: selectedArea, // Send the selected area
          city,
          state,
          country,
          // Add 'name' and 'securityQuestionAnswers' if your backend RegisterRequest requires them
          // name: username, // Assuming username can also be the name
          // securityQuestionAnswers: [] // Placeholder
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
      }, 2000);
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
              {/* Consider replacing this placeholder image with a local asset or a more reliable public URL */}
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

                {/* Display City, State, Country if available */}
                {(city || state || country) && (
                  <p className="text-gray-600 text-xs mt-2">
                    City: {city}, State: {state}, Country: {country}
                  </p>
                )}

                {/* Conditional rendering for Area dropdown */}
                {availableAreas.length > 1 && (
                  <div className="mt-4">
                    <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-1">
                      Select Your Area
                    </label>
                    <select
                      id="area"
                      name="area"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      required={availableAreas.length > 1} // Make required only if multiple options
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm"
                    >
                      <option value="">-- Please select an area --</option>
                      {availableAreas.map((areaOption) => (
                        <option key={areaOption} value={areaOption}>
                          {areaOption}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* If only one area, display it but no dropdown needed */}
                {availableAreas.length === 1 && selectedArea && (
                  <p className="text-gray-600 text-xs mt-2">
                    Area: {selectedArea}
                  </p>
                )}
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