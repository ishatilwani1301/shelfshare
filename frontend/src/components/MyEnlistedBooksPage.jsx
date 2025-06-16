import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Ensure ToastContainer is rendered in your App.jsx or main layout
import api from '../api/axiosConfig'; // Your configured Axios instance

// Default image if no book image is available
const DEFAULT_BOOK_IMAGE = 'https://picsum.photos/200/300';
// You can replace this with a more branded placeholder if you have one

// Highlight: Accept onShelfUpdate as a prop
const MyEnlistedBooksPage = ({ onShelfUpdate }) => { // Changed prop name from onBookAction
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:1234/books';

  const fetchEnlistedBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const AccessToken = localStorage.getItem('accessToken');
      if (!AccessToken) {
        throw new Error("Access token not found. Please log in.");
      }
      const response = await api.get(`${API_BASE_URL}/my-books`, {
        headers: { Authorization: `Bearer ${AccessToken}` }
      });
      setBooks(response.data);
      console.log("Fetched Enlisted Books:", response.data);
    } catch (err) {
      console.error('Error fetching enlisted books:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load enlisted books.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnlistedBooks();
  }, []); // Fetch on component mount

  

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-8 bg-gray-100">
        <svg className="animate-spin h-10 w-10 text-[#171612] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-[#837c67]">Loading your enlisted books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-5 rounded-lg shadow-md max-w-md w-full text-center">
          <h3 className="font-bold text-xl mb-3">Error Loading Books</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchEnlistedBooks}
            className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md hover:bg-[#e0d6c4] transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-4xl font-extrabold text-[#171612] tracking-tight">My Enlisted Books</h2>
        <button
          onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-6 rounded-md text-lg font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
        >
          &larr; Back to My Shelf
        </button>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md mt-8">
          <p className="text-[#837c67] text-xl font-medium mb-4">You haven't enlisted any books yet.</p>
          <button
            onClick={() => navigate('/dashboard/my-shelf/add-book')}
            className="bg-[#f3ebd2] text-[#171612] py-2 px-6 rounded-md text-lg font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
          >
            + Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Book Image - Fixed small height with object-cover for consistency */}
              <img
                src={book.bookImageUrl || DEFAULT_BOOK_IMAGE}
                alt={book.bookTitle}
                className="w-full h-48 object-cover border-b border-gray-200" // h-48 makes it "small"
                onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_BOOK_IMAGE }}
              />
              <div className="p-4 flex flex-col flex-grow"> {/* Reduced padding slightly for more compact info */}
                {/* Book Title */}
                <h3 className="text-[#171612] text-lg font-bold mb-1 leading-tight line-clamp-2"> {/* Smaller text-lg, line-clamp for long titles */}
                    {book.bookTitle}
                </h3>
                {/* Author Name - Prominent */}
                <p className="text-[#837c67] text-sm mb-1">by <span className="font-semibold text-gray-700">{book.authorName}</span></p>
                {/* Genre and Year - Smaller and grouped */}
                <p className="text-[#837c67] text-xs mb-2">
                    <span className="font-medium">Genre:</span> {book.bookGenre.replace(/_/g, ' ')} | <span className="font-medium">Published:</span> {book.publicationYear}
                </p>

                {/* Note Content - If available */}
                {book.noteContent && (
                  <div className="bg-gray-50 p-2 rounded-md mb-3 border border-gray-100 flex-grow overflow-hidden"> {/* Reduced padding for note, flex-grow to push buttons down */}
                    <p className="font-semibold text-gray-700 text-sm mb-1">{book.customizedTitle || 'My Note'}</p>
                    <p className="text-gray-600 text-xs italic line-clamp-3">{book.noteContent}</p> {/* text-xs, line-clamp for long notes */}
                  </div>
                )}
                {!book.noteContent && <div className="flex-grow"></div>} {/* Spacer if no note */}

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnlistedBooksPage;