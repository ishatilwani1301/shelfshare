import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const AnonymousBookDetailPage = ({  }) => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const commonToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!offerId) {
          setError('No offer ID found in the URL to fetch details.');
          setLoading(false);
          toast.error('No offer ID found in the URL.', commonToastOptions);
          return;
        }

        const requestUrl = `http://localhost:1234/anonymous-books/${offerId}`;
        console.log("Fetching anonymous book offer details from:", requestUrl);

        const response = await fetch(requestUrl);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`HTTP error! Status: ${response.status} - ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched single anonymous book offer from backend:", data);

        if (!data || !data.bookId) {
          setError('Anonymous book offer not found for the provided ID or data is incomplete.');
          setOffer(null);
          toast.error('Anonymous book offer not found or data is incomplete.', commonToastOptions);
          return;
        }

        const transformedOffer = {
          id: data.bookId,
          mainTitle: data.CustomizedTitle || 'Untitled Offer',
          note: data.noteContent || 'No description provided.',
          genre: data.bookGenre || 'N/A',
          keeperName: data.currentOwnerUsername || 'Anonymous User', 
          userArea: data.userArea || 'N/A',
          userCity: data.userCity || 'N/A',
          userState: data.userState || 'N/A',
        };

        setOffer(transformedOffer);
      } catch (err) {
        console.error("Error fetching anonymous book offer details:", err);
        setError(`Failed to load offer details: ${err.message || "An unexpected error occurred."}`);
        toast.error(`Failed to load offer details: ${err.message || "An unexpected error occurred."}`, commonToastOptions);
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId]);

  const handleRequestBook = async () => {
    try {
      const response = await fetch(`http://localhost:1234/books/borrow/${offerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorBody.message || 'Failed to send request for this book');
      }

      const result = await response.json();
      console.log('Request book response:', result);
      toast.success(result.message || 'Request sent successfully! The keeper will be notified.', commonToastOptions);
    } catch (error) {
      console.error('Error sending book request:', error);
      toast.error(error.message || 'An unexpected error occurred while sending the book request.', commonToastOptions);
    }
  };

  const handleBackToList = () => {
    navigate('/dashboard/anonymousbooks');
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-700 text-sm">
        Loading offer details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 text-sm">
        <p>{error}</p>
        <button
          onClick={handleBackToList}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Anonymous Notes
        </button>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-4 text-center text-gray-700 text-sm">
        <p>Offer not found or data is empty.</p>
        <button
          onClick={handleBackToList}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Anonymous Notes
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-sans text-sm">
      <ToastContainer />
      <div className="mb-4">
        <button
          onClick={handleBackToList}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Anonymous Notes
        </button>
      </div>

      <div className="text-center mb-6 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1 tracking-tight">
          {offer.mainTitle}
        </h1>
      </div>

      <div className="flex flex-col items-start px-6">

        <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-yellow-300 pb-2">
            Book Details
          </h2>
          <div className="mb-6 space-y-2">
            <div className="flex items-center py-1 border-b border-gray-200">
              <span className="text-gray-600 w-28 font-medium text-sm">Genre:</span>
              <span className="text-gray-800 text-sm font-semibold">{offer.genre}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">Current Keeper</h3>
          <div className="flex flex-col bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm mb-6">
            <p className="font-bold text-gray-900 text-lg mb-2">{offer.keeperName}</p>
            <div className="text-gray-700 text-sm space-y-1">
              {offer.userArea && offer.userArea !== 'N/A' && (
                <p>Area: <span className="font-semibold">{offer.userArea}</span></p>
              )}
              {offer.userCity && offer.userCity !== 'N/A' && (
                <p>City: <span className="font-semibold">{offer.userCity}</span></p>
              )}
              {offer.userState && offer.userState !== 'N/A' && (
                <p>State: <span className="font-semibold">{offer.userState}</span></p>
              )}
              {(!offer.userArea || offer.userArea === 'N/A') &&
               (!offer.userCity || offer.userCity === 'N/A') &&
               (!offer.userState || offer.userState === 'N/A') && (
                <p>Location: <span className="font-semibold">N/A</span></p>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">About the Book</h3>
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg mb-6 bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-inner">
            {offer.note}
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <button
              onClick={handleRequestBook}
              className="px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>Request This Book</span>
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');

        .font-handwriting {
          font-family: 'Caveat', cursive;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default AnonymousBookDetailPage;