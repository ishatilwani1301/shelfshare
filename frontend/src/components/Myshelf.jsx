import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AddBookPage from './AddBookPage';
import MyEnlistedBooksPage from './MyEnlistedBooksPage';
import api from '../api/axiosConfig';
import BorrowedBooksListPage from './BorrowedBooksListPage';
import IncomingRequestsListPage from './IncomingRequestsListPage';
// import NotAvailablePage from './NotAvailablePage'; // Consider removing if not used or handling empty states directly
import SentBorrowRequestsPage from './SentBorrowRequestsPage';

// Import images for BookCards
import myEnlistedBooksImage from '../assets/enlisted.jpg';
import borrowedBooksImage from '../assets/borrow1.jpg';
import incomingRequestsImage from '../assets/reuest.jpg';
import sentRequestsImage from '../assets/review.jpg';

// Enhanced BookCard component with optional image
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
  const [sentBorrowRequestsCount, setSentBorrowRequestsCount] = useState(0);

  const [loadingEnlisted, setLoadingEnlisted] = useState(true);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);

  const API_BASE_URL = 'http://localhost:1234';

  const fetchCounts = useCallback(async () => {
    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      setLoadingEnlisted(false);
      setLoadingBorrowed(false);
      setLoadingIncoming(false);
      setLoadingSent(false);
      return;
    }

    // Set all loading states to true at the start of fetching
    setLoadingEnlisted(true);
    setLoadingBorrowed(true);
    setLoadingIncoming(true);
    setLoadingSent(true);

    try {
      const [
        enlistedResponse,
        borrowedResponse,
        incomingResponse,
        sentResponse
      ] = await Promise.allSettled([ // Use Promise.allSettled to handle individual errors without stopping others
        api.get(`${API_BASE_URL}/books/my-books`, { headers: { Authorization: `Bearer ${AccessToken}` } }),
        api.get(`${API_BASE_URL}/books/booksBorrowed`, { headers: { Authorization: `Bearer ${AccessToken}` } }),
        api.get(`${API_BASE_URL}/user/borrowRequestsReceived`, { headers: { Authorization: `Bearer ${AccessToken}` } }),
        api.get(`${API_BASE_URL}/user/borrowRequestsSent`, { headers: { Authorization: `Bearer ${AccessToken}` } }),
      ]);

      // Handle enlisted books
      if (enlistedResponse.status === 'fulfilled') {
        setMyEnlistedBooksCount(enlistedResponse.value.data.length);
      } else {
        console.error('Error fetching my enlisted books:', enlistedResponse.reason);
        setMyEnlistedBooksCount(0);
      }
      setLoadingEnlisted(false);

      // Handle borrowed books
      if (borrowedResponse.status === 'fulfilled') {
        setBorrowedBooksCount(borrowedResponse.value.data.length);
      } else {
        console.error('Error fetching borrowed books count:', borrowedResponse.reason);
        setBorrowedBooksCount(0);
      }
      setLoadingBorrowed(false);

      // Handle incoming requests
      if (incomingResponse.status === 'fulfilled') {
        const pendingOrRequested = incomingResponse.value.data.filter(
          (request) => request.borrowRequestStatuString === 'PENDING' || request.borrowRequestStatusString === 'REQUESTED'
        );
        setIncomingBorrowRequestsCount(pendingOrRequested.length);
      } else {
        console.error('Error fetching incoming requests count:', incomingResponse.reason);
        setIncomingBorrowRequestsCount(0);
      }
      setLoadingIncoming(false);

      // Handle sent requests
      if (sentResponse.status === 'fulfilled') {
        setSentBorrowRequestsCount(sentResponse.value.data.length);
      } else {
        console.error('Error fetching sent requests count:', sentResponse.reason);
        setSentBorrowRequestsCount(0);
      }
      setLoadingSent(false);

    } catch (error) {
      // This catch block handles unexpected errors with Promise.allSettled itself
      console.error('An unexpected error occurred during fetchCounts:', error);
      setLoadingEnlisted(false);
      setLoadingBorrowed(false);
      setLoadingIncoming(false);
      setLoadingSent(false);
    }
  }, [API_BASE_URL]); // `API_BASE_URL` is a constant, so `fetchCounts` itself remains stable.

  // Initial fetch on component mount
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]); // `fetchCounts` is wrapped in useCallback, so it's stable.

  const handleAddBookClick = () => {
    navigate('add-book');
  };

  const handleViewEnlistedBooks = () => {
    navigate('enlisted');
  };

  const handleViewBorrowedBooks = () => {
    navigate('borrowed'); // Navigate directly, let BorrowedBooksListPage fetch its own data.
  };

  const handleViewIncomingRequests = () => {
    navigate('requests'); // Navigate directly, let IncomingRequestsListPage fetch its own data.
  };

  const handleViewSentRequests = () => {
    navigate('sent-requests'); // Navigate directly, let SentBorrowRequestsPage fetch its own data.
  };

  // === MODIFIED: Generic callback function to refresh counts after any relevant action ===
  const handleShelfUpdate = useCallback(() => {
    console.log("Shelf data updated, refreshing MyShelf counts...");
    fetchCounts(); // Re-fetch all counts
  }, [fetchCounts]); // Dependency ensures this callback is stable

  return (
    <div className="flex flex-col items-center justify-start h-full text-center p-8 bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w-6xl">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  <BookCard
                    title="My Enlisted Books"
                    description={`You have ${myEnlistedBooksCount} books currently listed.`}
                    buttonText="View All"
                    onClick={handleViewEnlistedBooks}
                    isLoading={loadingEnlisted}
                    imageSrc={myEnlistedBooksImage}
                  />
                  <BookCard
                    title="Borrowed Books"
                    description={`You have borrowed ${borrowedBooksCount} books.`}
                    buttonText="View All"
                    onClick={handleViewBorrowedBooks}
                    isLoading={loadingBorrowed}
                    imageSrc={borrowedBooksImage}
                  />
                  <BookCard
                    title="Incoming Borrow Requests"
                    description={`You have ${incomingBorrowRequestsCount} pending requests.`}
                    buttonText="Review Requests"
                    onClick={handleViewIncomingRequests}
                    isLoading={loadingIncoming}
                    imageSrc={incomingRequestsImage}
                  />
                  <BookCard
                    title="Sent Borrow Requests"
                    description={`You have ${sentBorrowRequestsCount} requests sent.`}
                    buttonText="View Status"
                    onClick={handleViewSentRequests}
                    isLoading={loadingSent}
                    imageSrc={sentRequestsImage}
                  />
                </div>
              </>
            }
          />
          {/* Pass the handleShelfUpdate callback to all relevant pages */}
          <Route
            path="add-book"
            element={<AddBookPage onShelfUpdate={handleShelfUpdate} />} // Changed prop name to onShelfUpdate
          />
          <Route
            path="enlisted"
            element={<MyEnlistedBooksPage onShelfUpdate={handleShelfUpdate} />} // Changed prop name to onShelfUpdate
          />
          <Route
            path="borrowed"
            element={<BorrowedBooksListPage onShelfUpdate={handleShelfUpdate} />}
          />
          <Route
            path="requests"
            element={<IncomingRequestsListPage onShelfUpdate={handleShelfUpdate} />}
          />
          <Route
            path="sent-requests"
            element={<SentBorrowRequestsPage onShelfUpdate={handleShelfUpdate} />}
          />
          {/* <Route path="not-available-books" element={<NotAvailablePage />} /> */}
          <Route path="*" element={<p className="text-[#837c67] text-center py-8">My Shelf Sub-Page Not Found</p>} />
        </Routes>
      </div>
    </div>
  );
});

export default MyShelf;