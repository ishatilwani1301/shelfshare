import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import loginimg from '../assets/loginimg2.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- State for Forgot Password Modal ---
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isSecurityQuestionValidated, setIsSecurityQuestionValidated] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:1234/login/userLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      console.log('Login successful:', data.jwt);

      localStorage.setItem('accessToken', data.jwt);

      toast.success(data.message || 'Login successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  // --- Forgot Password Handlers ---

  const handleOpenForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    setForgotUsername('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setIsSecurityQuestionValidated(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotPasswordError('');
  };

  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleGetSecurityQuestion = async () => {
    setForgotPasswordError('');
    if (!forgotUsername) {
      setForgotPasswordError('Please enter your username.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:1234/login/securityQuestion/${forgotUsername}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not retrieve security question. User might not exist.');
      }
      const data = await response.json();
      setSecurityQuestion(data.message); // Assuming the security question is in data.message
      setIsSecurityQuestionValidated(false); // Reset validation on new question
    } catch (err) {
      console.error('Error fetching security question:', err);
      setSecurityQuestion('');
      setForgotPasswordError(err.message);
    }
  };

  const handleValidateSecurityAnswer = async () => {
    setForgotPasswordError('');
    if (!securityAnswer) {
      setForgotPasswordError('Please enter your security answer.');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/login/validateSecurityQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: forgotUsername,
          question: securityQuestion, // Send the question back for validation
          answer: securityAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Incorrect security answer.');
      }

      toast.success('Security question validated! You can now update your password.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsSecurityQuestionValidated(true);
    } catch (err) {
      console.error('Error validating security question:', err);
      setForgotPasswordError(err.message);
      setIsSecurityQuestionValidated(false);
    }
  };

  const handleUpdatePassword = async () => {
    setForgotPasswordError('');
    if (!newPassword || !confirmNewPassword) {
      setForgotPasswordError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) { // Example: enforce minimum password length
        setForgotPasswordError('New password must be at least 6 characters long.');
        return;
    }

    try {
      // NOTE: You need a new API endpoint in your Spring Boot controller for updating the password.
      // For demonstration, I'm assuming an endpoint like `/login/updatePassword`.
      // The backend should handle hashing the new password before saving it.
      const response = await fetch('http://localhost:1234/user/changeUserPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: forgotUsername,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }

      toast.success('Password updated successfully! Please log in with your new password.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsForgotPasswordModalOpen(false);
      // Optionally clear login form fields or redirect to login
      setEmail(forgotUsername); // Pre-fill username for convenience
      setPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setForgotPasswordError(err.message);
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
          {/* Left Section */}
          <div className="w-1/2 bg-white flex flex-col items-center justify-center p-6 relative">
            <div className="relative z-10 flex flex-col items-center text-center">
              <img
                src={loginimg}
                alt="Bookshelf and Reading Illustration"
                className="w-full max-w-[15rem] h-auto mb-4"
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
              <a href="/signup" className="text-yellow-500 hover:underline mr-4">
                Sign up
              </a>
              <button
                onClick={handleOpenForgotPasswordModal}
                className="text-yellow-500 hover:underline ml-4 focus:outline-none"
              >
                Forgot Password?
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* --- Forgot Password Modal --- */}
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
            <button
              onClick={handleCloseForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Forgot Password</h2>

            {forgotPasswordError && (
              <p className="text-red-500 text-center text-sm mb-4">{forgotPasswordError}</p>
            )}

            {!securityQuestion ? (
              // Step 1: Enter Username to get Security Question
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="forgotUsername" className="block text-gray-700 text-sm font-semibold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="forgotUsername"
                    placeholder="Enter your username"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-gray-800 text-sm"
                  />
                </div>
                <button
                  onClick={handleGetSecurityQuestion}
                  className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-3 focus:ring-yellow-300 transition duration-300 ease-in-out"
                >
                  Get Security Question
                </button>
              </div>
            ) : (
              // Step 2: Answer Security Question
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="securityQuestion" className="block text-gray-700 text-sm font-semibold mb-1">
                    Security Question:
                  </label>
                  <p id="securityQuestion" className="text-gray-900 font-medium break-words">{securityQuestion}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="securityAnswer" className="block text-gray-700 text-sm font-semibold mb-1">
                    Your Answer
                  </label>
                  <input
                    type="text"
                    id="securityAnswer"
                    placeholder="Enter your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-gray-800 text-sm"
                    disabled={isSecurityQuestionValidated} // Disable if already validated
                  />
                </div>
                {!isSecurityQuestionValidated && (
                  <button
                    onClick={handleValidateSecurityAnswer}
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-3 focus:ring-green-300 transition duration-300 ease-in-out"
                  >
                    Validate Answer
                  </button>
                )}

                {isSecurityQuestionValidated && (
                  // Step 3: Update Password
                  <div className="space-y-4 mt-6 border-t pt-4 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 text-center">Update Password</h3>
                    <div className="form-group">
                      <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-gray-800 text-sm"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-semibold mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-gray-800 text-sm"
                      />
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-3 focus:ring-yellow-300 transition duration-300 ease-in-out"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Login;