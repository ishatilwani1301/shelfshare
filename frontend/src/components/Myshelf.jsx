import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AddBookPage from './AddBookPage';
import MyEnlistedBooksPage from './MyEnlistedBooksPage';
import api from '../api/axiosConfig';
import BorrowedBooksListPage from './BorrowedBooksListPage';
import IncomingRequestsListPage from './IncomingRequestsListPage';
import NotAvailablePage from './NotAvailablePage';
// Import the new page component
import SentBorrowRequestsPage from './SentBorrowRequestsPage';
import myEnlistedBooksImage from '../assets/enlisted.jpg'; // Ejpgxample image
import borrowedBooksImage from '../assets/borrow1.jpg';     // Example image
import incomingRequestsImage from '../assets/reuest.jpg'; // Example image
import sentRequestsImage from '../assets/review.jpg';       // Example image

// Enhanced BookCard component with optional imreviewage
const BookCard = ({ title, description, buttonText, onClick, isLoading, imageSrc }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
    <div>
      <h3 className="text-[#171612] text-xl font-semibold mb-2">{title}</h3>
      {imageSrc && (
        <img src={imageSrc} alt={title} className="w-24 h-24 object-contain mx-auto mb-4" />
      )}
      {isLoading ? (
        <p className="text-[#837c67] text-base mb-4 animate-pulse">Loading...</p>
      ) : (
        <p className="text-[#837c67] text-base mb-4">{description}</p>
      )}
    </div>
    {buttonText && (
      <button
        onClick={onClick}
        className="mt-auto bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md hover:bg-[#e0d6c4] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#171612]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          buttonText
        )}
      </button>
    )}
  </div>
);

const MyShelf = React.memo(() => {
  const navigate = useNavigate();

  const [myEnlistedBooksCount, setMyEnlistedBooksCount] = useState(0);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const [incomingBorrowRequestsCount, setIncomingBorrowRequestsCount] = useState(0);
  const [sentBorrowRequestsCount, setSentBorrowRequestsCount] = useState(0); // New state for sent requests

  const [loadingEnlisted, setLoadingEnlisted] = useState(true);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true); // New loading state

  const API_BASE_URL = 'http://localhost:1234';

  const fetchCounts = useCallback(async () => {
    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      setLoadingEnlisted(false);
      setLoadingBorrowed(false);
      setLoadingIncoming(false);
      setLoadingSent(false); // Make sure to set to false for new state
      return;
    }

    // Enlisted Books
    try {
      setLoadingEnlisted(true);
      const enlistedResponse = await api.get(`${API_BASE_URL}/books/my-books`);
      setMyEnlistedBooksCount(enlistedResponse.data.length);
    } catch (err) {
      console.error('Error fetching my enlisted books:', err);
      setMyEnlistedBooksCount(0);
    } finally {
      setLoadingEnlisted(false);
    }

    // Borrowed Books
    try {
      setLoadingBorrowed(true);
      const borrowedResponse = await api.get(`${API_BASE_URL}/books/booksBorrowed`);
      console.log('Borrowed books response:', borrowedResponse.data);
      setBorrowedBooksCount(borrowedResponse.data.length);
    } catch (err) {
      console.error('Error fetching borrowed books count:', err);
      setBorrowedBooksCount(0);
    } finally {
      setLoadingBorrowed(false);
    }

    // Incoming Requests
    try {
      setLoadingIncoming(true);
      const incomingResponse = await api.get(`${API_BASE_URL}/user/borrowRequestsReceived`);
      console.log('Incoming requests response:', incomingResponse.data);
      setIncomingBorrowRequestsCount(incomingResponse.data.length);
    } catch (err) {
      console.error('Error fetching incoming requests count:', err);
      setIncomingBorrowRequestsCount(0);
    } finally {
      setLoadingIncoming(false);
    }

    // NEW: Sent Borrow Requests
    try {
      setLoadingSent(true);
      const sentResponse = await api.get(`${API_BASE_URL}/user/borrowRequestsSent`); // Adjust this endpoint if needed
      console.log('Sent requests response:', sentResponse.data);
      setSentBorrowRequestsCount(sentResponse.data.length);
    } catch (err) {
      console.error('Error fetching sent requests count:', err);
      setSentBorrowRequestsCount(0);
    } finally {
      setLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleAddBookClick = () => {
    navigate('add-book');
  };

  const handleViewEnlistedBooks = () => {
    navigate('enlisted');
  };

  const handleViewBorrowedBooks = async () => {
    setLoadingBorrowed(true);
    try {
      await api.get(`${API_BASE_URL}/books/booksBorrowed`); // Pre-fetch to ensure data is there or catch error
      navigate('borrowed');
    } catch (err) {
      console.error('Error viewing borrowed books details:', err);
      // Removed the direct navigation to not-available-books here, as the BorrowedBooksListPage
      // should handle showing "no books" if the data is empty.
      navigate('borrowed'); // Still navigate to the page, it will handle the empty state.
    } finally {
      setLoadingBorrowed(false);
    }
  };

  const handleViewIncomingRequests = async () => {
    setLoadingIncoming(true);
    try {
      await api.get(`${API_BASE_URL}/user/borrowRequestsReceived`); // Pre-fetch
      navigate('requests');
    } catch (err) {
      console.error('Error viewing incoming requests details:', err);
      // Similar to borrowed books, the list page should handle empty state.
      navigate('requests');
    } finally {
      setLoadingIncoming(false);
    }
  };

  // NEW: Handler for Sent Borrow Requests
  const handleViewSentRequests = async () => {
    setLoadingSent(true);
    try {
      await api.get(`${API_BASE_URL}/user/borrowRequestsSent`); // Pre-fetch
      navigate('sent-requests'); // Navigate to the new page
    } catch (err) {
      console.error('Error viewing sent requests details:', err);
      navigate('sent-requests'); // Navigate to the page, it will handle the empty state.
    } finally {
      setLoadingSent(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-center p-8 bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w-6xl"> {/* Increased max-w-xl to accommodate 4 columns better */}
        <Routes>
          <Route
            index
            element={
              <>
                <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
                  <h2 className="text-[#171612] tracking-wide text-[36px] font-extrabold leading-tight">
                    My Shelf
                  </h2>
                  <button
                    onClick={handleAddBookClick}
                    className="bg-[#f3ebd2] text-[#171612] py-2 px-6 rounded-md text-lg font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
                  >
                    + Add Book
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"> {/* Adjusted grid for 4 columns */}
                  <BookCard
                    title="My Enlisted Books"
                    description={`You have ${myEnlistedBooksCount} books currently listed.`}
                    buttonText="View All"
                    onClick={handleViewEnlistedBooks}
                    isLoading={loadingEnlisted}
                    imageSrc={myEnlistedBooksImage} // Add image
                  />
                  <BookCard
                    title="Borrowed Books"
                    description={`You have borrowed ${borrowedBooksCount} books.`}
                    buttonText="View All"
                    onClick={handleViewBorrowedBooks}
                    isLoading={loadingBorrowed}
                    imageSrc={borrowedBooksImage} // Add image
                  />
                  <BookCard
                    title="Incoming Borrow Requests"
                    description={`You have ${incomingBorrowRequestsCount} pending requests.`}
                    buttonText="Review Requests"
                    onClick={handleViewIncomingRequests}
                    isLoading={loadingIncoming}
                    imageSrc={incomingRequestsImage} // Add image
                  />
                  {/* NEW: Sent Borrow Requests Card */}
                  <BookCard
                    title="Sent Borrow Requests"
                    description={`You have ${sentBorrowRequestsCount} requests sent.`}
                    buttonText="View Status"
                    onClick={handleViewSentRequests}
                    isLoading={loadingSent}
                    imageSrc={sentRequestsImage} // Add image
                  />
                </div>
              </>
            }
          />
          <Route path="add-book" element={<AddBookPage />} />
          <Route path="enlisted" element={<MyEnlistedBooksPage onBookAction={fetchCounts} />} />
          <Route path="borrowed" element={<BorrowedBooksListPage />} />
          <Route path="requests" element={<IncomingRequestsListPage />} />
          {/* NEW: Route for Sent Borrow Requests Page */}
          <Route path="sent-requests" element={<SentBorrowRequestsPage />} />
          {/* Removed specific "not-available" routes, let the list pages handle empty states */}
          <Route path="*" element={<p className="text-[#837c67] text-center py-8">My Shelf Sub-Page Not Found</p>} />
        </Routes>
      </div>
    </div>
  );
});

export default MyShelf;