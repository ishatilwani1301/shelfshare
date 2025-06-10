import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAvailablePage = ({ message = "This page is coming soon or there is no data available yet." }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8 font-sans"> {/* Added font-sans for consistency */}
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-md w-full"> {/* Added a card-like container */}
        <h2 className="text-4xl font-extrabold text-[#171612] mb-4 tracking-tight"> {/* Larger, bolder, tighter tracking */}
          Content Not Available
        </h2>
        <p className="text-lg text-[#837c67] mb-8 leading-relaxed"> {/* Slightly more relaxed line-height */}
          {message}
        </p>
        <button
          onClick={handleGoBack}
          // Applying the new button styles
          className="bg-[#f3ebd2] text-[#171612] py-2 px-6 rounded-md text-lg font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotAvailablePage;