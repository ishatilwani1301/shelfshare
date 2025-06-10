import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AddBookPage from './AddBookPage';
import MyEnlistedBooksPage from './MyEnlistedBooksPage';
import api from '../api/axiosConfig';
import BorrowedBooksListPage from './BorrowedBooksListPage';
import IncomingRequestsListPage from './IncomingRequestsListPage';
import NotAvailablePage from './NotAvailablePage';

// Enhanced BookCard component
const BookCard = ({ title, description, buttonText, onClick, isLoading }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
    <div>
      <h3 className="text-[#171612] text-xl font-semibold mb-2">{title}</h3>
      {isLoading ? (
        <p className="text-[#837c67] text-base mb-4 animate-pulse">Loading...</p>
      ) : (
        <p className="text-[#837c67] text-base mb-4">{description}</p>
      )}
    </div>
    {buttonText && (
      <button
        onClick={onClick}
        // Applying the new button styles
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

  const [loadingEnlisted, setLoadingEnlisted] = useState(true);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const [loadingIncoming, setLoadingIncoming] = useState(true);

  const API_BASE_URL = 'http://localhost:1234/books';

  const fetchCounts = useCallback(async () => {
    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      setLoadingEnlisted(false);
      setLoadingBorrowed(false);
      setLoadingIncoming(false);
      return;
    }

    try {
      setLoadingEnlisted(true);
      const enlistedResponse = await api.get(`${API_BASE_URL}/my-books`);
      setMyEnlistedBooksCount(enlistedResponse.data.length);
    } catch (err) {
      console.error('Error fetching my enlisted books:', err);
      setMyEnlistedBooksCount(0);
    } finally {
      setLoadingEnlisted(false);
    }

    try {
      setLoadingBorrowed(true);
      const borrowedResponse = await api.get(`${API_BASE_URL}/borrowed`);
      setBorrowedBooksCount(borrowedResponse.data.length);
    } catch (err) {
      console.error('Error fetching borrowed books count:', err);
      setBorrowedBooksCount(0);
    } finally {
      setLoadingBorrowed(false);
    }

    try {
      setLoadingIncoming(true);
      const incomingResponse = await api.get(`${API_BASE_URL}/incoming-requests`);
      setIncomingBorrowRequestsCount(incomingResponse.data.length);
    } catch (err) {
      console.error('Error fetching incoming requests count:', err);
      setIncomingBorrowRequestsCount(0);
    } finally {
      setLoadingIncoming(false);
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
      await api.get(`${API_BASE_URL}/borrowed`);
      navigate('borrowed');
    } catch (err) {
      console.error('Error viewing borrowed books details:', err);
      navigate('not-available-books');
    } finally {
      setLoadingBorrowed(false);
    }
  };

  const handleViewIncomingRequests = async () => {
    setLoadingIncoming(true);
    try {
      await api.get(`${API_BASE_URL}/incoming-requests`);
      navigate('requests');
    } catch (err) {
      console.error('Error viewing incoming requests details:', err);
      navigate('not-available-request');
    } finally {
      setLoadingIncoming(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-center p-8 bg-gray-100 min-h-screen font-sans"> {/* Added font-sans for better default font */}
      <div className="w-full max-w-4xl">
        <Routes>
          <Route
            index
            element={
              <>
                <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200"> {/* Added bottom border for visual separation */}
                  <h2 className="text-[#171612] tracking-wide text-[36px] font-extrabold leading-tight"> {/* Slightly adjusted tracking and font weight */}
                    My Shelf
                  </h2>
                  <button
                    onClick={handleAddBookClick}
                    // Applied new button styles
                    className="bg-[#f3ebd2] text-[#171612] py-2 px-6 rounded-md text-lg font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
                  >
                    + Add Book
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <BookCard
                    title="My Enlisted Books"
                    description={`You have ${myEnlistedBooksCount} books currently listed.`}
                    buttonText="View All"
                    onClick={handleViewEnlistedBooks}
                    isLoading={loadingEnlisted}
                  />
                  <BookCard
                    title="Borrowed Books"
                    description={`You have borrowed ${borrowedBooksCount} books.`}
                    buttonText="View All"
                    onClick={handleViewBorrowedBooks}
                    isLoading={loadingBorrowed}
                  />
                  <BookCard
                    title="Incoming Borrow Requests"
                    description={`You have ${incomingBorrowRequestsCount} pending requests.`}
                    buttonText="Review Requests"
                    onClick={handleViewIncomingRequests}
                    isLoading={loadingIncoming}
                  />
                </div>
              </>
            }
          />
          <Route path="add-book" element={<AddBookPage />} />
          <Route path="enlisted" element={<MyEnlistedBooksPage onBookAction={fetchCounts} />} />
          <Route path="borrowed" element={<BorrowedBooksListPage />} />
          <Route path="/user/borrowRequestsReceived" element={<IncomingRequestsListPage />} />
          <Route path="not-available-request" element={<NotAvailablePage message="There are no incoming borrow requests at the moment." />} />
          <Route path="not-available-books" element={<NotAvailablePage message="You have not borrowed any books yet." />} />
          <Route path="*" element={<p className="text-[#837c67] text-center py-8">My Shelf Sub-Page Not Found</p>} />
        </Routes>
      </div>
    </div>
  );
});

export default MyShelf;