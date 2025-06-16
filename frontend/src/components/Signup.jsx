import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import loginimg1 from '../assets/loginimg1.jpg'; // Import the login image

const SignUp = () => {
 const navigate = useNavigate();
 const [name, setName] = useState('');
 const [username, setUsername] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [pincode, setPincode] = useState('');

 const [availableAreas, setAvailableAreas] = useState([]);
 const [selectedArea, setSelectedArea] = useState('');

 const [city, setCity] = useState('');
 const [state, setState] = useState('');
 const [country, setCountry] = useState('');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 // States for security questions remain the same for input binding
 const [securityQuestion, setSecurityQuestion] = useState('');
 const [securityAnswer, setSecurityAnswer] = useState('');

 // Hardcoded list of security questions
 const securityQuestionsList = [
   { id: 1, question: "What is your mother's maiden name?" },
   { id: 2, question: "What was the name of your first pet?" },
   { id: 3, question: "What is your favorite book?" },
   { id: 4, question: "What city were you born in?" },
 ];

 // Ref for debouncing the pincode API call
 const pincodeTimeoutRef = useRef(null);

 const fetchAddressByPincode = async (currentPincode) => {
   setAvailableAreas([]);
   setSelectedArea('');
   setCity('');
   setState('');
   setCountry('');
   setError('');

   console.log('Fetching address for pincode:', currentPincode);

   if (currentPincode.length !== 6) {
     return;
   }

   try {
     const response = await fetch(`http://localhost:1234/register/pincodeToAddress/${currentPincode}`, {
       method: 'GET',
     });
     console.log('Response status:', response);
     if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: 'Pincode not found or invalid.' }));
       throw new Error(errorData.message || 'Pincode not found or invalid.');
     }

     const data = await response.json();

     if (data.area && Array.isArray(data.area) && data.area.length > 0) {
       setAvailableAreas(data.area);
       if (data.area.length === 1) {
         setSelectedArea(data.area[0]);
       } else {
         setSelectedArea('');
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

 const handlePincodeChange = (e) => {
   const newPincode = e.target.value;
   setPincode(newPincode);
   console.log('Pincode changed:', newPincode);

   if (pincodeTimeoutRef.current) {
     clearTimeout(pincodeTimeoutRef.current);
   }

   pincodeTimeoutRef.current = setTimeout(() => {
     fetchAddressByPincode(newPincode);
   }, 500);
 };

 const handleSubmit = async (e) => {
   e.preventDefault();

   setError('');
   setSuccess('');

   // Frontend Validation
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

   if (pincode && (!city || !state || !country || (availableAreas.length > 0 && !selectedArea))) {
       setError('Please ensure a valid pincode is entered and address details are populated.');
       toast.error('Please ensure a valid pincode is entered and address details are populated.', { position: 'top-right' });
       return;
   }

   if (!securityQuestion || !securityAnswer) {
     setError('Please select a security question and provide an answer.');
     toast.error('Please select a security question and provide an answer.', { position: 'top-right' });
     return;
   }

   // Prepare securityQuestionAnswers as a Map<String, String> (JavaScript object)
   const securityQuestionAnswersMap = {
     [securityQuestion]: securityAnswer
   };

   try {
     const response = await fetch('http://localhost:1234/register/createNewUser', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         name,
         username,
         email,
         password,
         pincode,
         area: selectedArea,
         city,
         state,
         country,
         securityQuestionAnswers: securityQuestionAnswersMap, // Send the Map
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
       autoClose: 1000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       progress: undefined,
     });

     setTimeout(() => {
       navigate('/login');
     }, 1000);
   } catch (err) {
     setError(err.message);
     toast.error(err.message || 'Signup failed. Please try again.', {
       position: 'top-right',
       autoClose: 2000,
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

     <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-3xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")} // Navigate to home or dashboard
          >

            ShelfShare
          </div>

          {/* Navigation Links and Buttons */}
          <nav className="space-x-4 sm:space-x-6 flex items-center">
            
          
            <button
              onClick={() => navigate("/signup")} // Navigate to Signup page
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")} // Navigate to Login page
              className="text-gray-600 hover:text-yellow-500 font-semibold py-2 px-4 text-sm sm:text-base transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

     <main className="flex-grow flex items-center justify-center p-3">
       <div className="bg-white rounded-xl shadow-2xl flex max-w-3xl w-full overflow-hidden transform transition-all duration-300 ease-in-out">
         <div className="w-1/2 bg-white flex flex-col items-center justify-center p-6 relative text-center">
           <div className="relative z-10 flex flex-col items-center">
             <img
               src={loginimg1}
               alt="Join ShelfShare Community"
               className="w-full max-w-[18rem] h-auto mb-4"
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
               <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                 Full Name
               </label>
               <input
                 type="text"
                 id="name"
                 name="name"
                 placeholder="Your full name"
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm placeholder-gray-400"
               />
             </div>

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

               {(city || state || country) && (
                 <p className="text-gray-600 text-xs mt-2">
                   City: {city}, State: {state}, Country: {country}
                 </p>
               )}

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
                     required={availableAreas.length > 1}
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

               {availableAreas.length === 1 && selectedArea && (
                 <p className="text-gray-600 text-xs mt-2">
                   Area: {selectedArea}
                 </p>
               )}
             </div>

             {/* Security Questions Section */}
             <div>
               <label htmlFor="securityQuestion" className="block text-sm font-semibold text-gray-700 mb-1">
                 Security Question
               </label>
               <select
                 id="securityQuestion"
                 name="securityQuestion"
                 required
                 value={securityQuestion}
                 onChange={(e) => setSecurityQuestion(e.target.value)}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition duration-200 ease-in-out text-gray-800 text-sm"
               >
                 <option value="">-- Select a security question --</option>
                 {securityQuestionsList.map((sq) => (
                   <option key={sq.id} value={sq.question}>
                     {sq.question}
                   </option>
                 ))}
               </select>
             </div>

             <div>
               <label htmlFor="securityAnswer" className="block text-sm font-semibold text-gray-700 mb-1">
                 Answer
               </label>
               <input
                 type="text"
                 id="securityAnswer"
                 name="securityAnswer"
                 placeholder="Your answer"
                 required
                 value={securityAnswer}
                 onChange={(e) => setSecurityAnswer(e.target.value)}
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
