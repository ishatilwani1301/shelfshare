import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../api/axiosConfig';

const BorrowedBooksListPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await api.get('/books/booksBorrowed');
        // The backend response is an array of objects.
        // If it's an object with a single key '0' containing the array,
        // you'd need to access response.data[0] or iterate the object.
        // Assuming response.data is directly the array as per your example structure.
        if (Array.isArray(response.data)) {
          setBorrowedBooks(response.data);
        } else if (response.data && response.data[0]) { // Handle cases where it might be {0: [...]}
          setBorrowedBooks(response.data[0]); // Access the array if wrapped in an object with key '0'
        } else {
          setBorrowedBooks([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching borrowed books:', err);
        setError('Failed to load borrowed books. Please try again.');
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171612]"></div>
        <p className="ml-4 text-lg text-[#171612]">Loading borrowed books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate('/dashboard/my-shelf')} // Navigate back on error retry
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
        <h2 className="text-[#171612] tracking-wide text-[32px] font-extrabold leading-tight">
          Borrowed Books
        </h2>
        <button
          onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>

      {borrowedBooks.length === 0 ? (
        <p className="text-center text-[#837c67] text-lg mt-16">
          You have not borrowed any books yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((book) => (
            <li key={book.id} className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
              {/* Book Title */}
              <h3 className="text-[#171612] text-xl font-semibold mb-2">{book.bookTitle}</h3>
              {/* Author Name */}
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Author:</span> {book.authorName}
              </p>
              {/* Current Owner (the person you borrowed from) */}
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Borrowed From:</span> {book.currentOwnerName}
              </p>
              {/* Book Genre */}
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Genre:</span> {book.bookGenre}
              </p>
              {/* Publication Year */}
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Published:</span> {book.publicationYear}
              </p>
              {/* Your Custom Note Title */}
              {book.customizedTitle && (
                <p className="text-[#837c67] text-base mb-1">
                  <span className="font-medium">Your Note Title:</span> {book.customizedTitle}
                </p>
              )}
              {/* Your Note Content */}
              {book.noteContent && (
                <p className="text-[#837c67] text-base mb-1">
                  <span className="font-medium">Your Note:</span> {book.noteContent}
                </p>
              )}
              {/* Book Status (should be BORROWED for this page, but good to display) */}
              <p className="text-[#171612] text-lg font-bold mt-3 mb-1">
                Status:{' '}
                <span className={`
                  ${book.bookStatus === 'BORROWED' ? 'text-blue-600' : 'text-gray-600'}
                `}>
                  {book.bookStatus}
                </span>
              </p>
              {/* Display Previous Owners (if any) */}
              {book.previousOwners && book.previousOwners.length > 0 && (
                <p className="text-[#837c67] text-sm mt-2">
                  <span className="font-medium">Previous Owners:</span>{' '}
                  {book.previousOwners.join(', ')}
                </p>
              )}
              {/* Location details of the current owner/book */}
              <p className="text-[#837c67] text-sm mt-2">
                <span className="font-medium">Location:</span> {book.userArea}, {book.userCity}, {book.userState}
              </p>
              {/* Display the top-level message from the backend if available and not empty */}
              {book.message && typeof book.message === 'string' && book.message.trim() !== '' && (
                <p className="text-[#837c67] text-sm mt-3 italic bg-gray-50 p-3 rounded-md border border-gray-200">
                  {book.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedBooksListPage;