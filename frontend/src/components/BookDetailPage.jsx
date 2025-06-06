import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

const BookDetailPage = () => {
  const { bookId } = useParams(); 
  const navigate = useNavigate(); 

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const requestUrl = `http://localhost:1234/books/${bookId}`;
        console.log("Fetching book details from:", requestUrl); 

        const response = await fetch(requestUrl);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`HTTP error! Status: ${response.status} - ${errorBody.message || response.statusText}`);
        }

        const backendBook = await response.json();

        const transformedBook = {
          id: backendBook.bookId,
          name: backendBook.bookTitle,
          author: backendBook.authorName,
          publicationYear: backendBook.publicationYear,
          genre: backendBook.bookGenre, 
          note: backendBook.noteContent,
          customizedTitle: backendBook.customizedTitle, 
          status: backendBook.bookStatus, 
          enlisted: backendBook.isEnlisted, 
          owner: {
            name: backendBook.currentOwnerName,
          },
          previousOwners: backendBook.previousOwners ? backendBook.previousOwners.map(ownerUsername => ({ name: ownerUsername })) : []
        };

        setBook(transformedBook);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(`Failed to load book details: ${err.message || "An unexpected error occurred."}`);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) { 
      fetchBookDetails();
    }
  }, [bookId]); 

 
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-700 text-sm">
        Loading book details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 text-sm">
        <p>{error}</p>
        <button
          onClick={() => navigate('/dashboard/books')} // Navigate back to the list
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Books
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-4 text-center text-gray-700 text-sm">
        <p>Book not found or data is empty.</p>
        <button
          onClick={() => navigate('/dashboard/books')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Books
        </button>
      </div>
    );
  }

  
  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-sans text-sm">
      <div className="mb-4">
        <button
          onClick={() => navigate('/dashboard/books')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Books
        </button>
      </div>

      <div className="text-center mb-6 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1 tracking-tight">
          {book.name || 'Untitled Book'}
        </h1>
        <p className="text-xl text-gray-700 font-medium">By {book.author || 'Unknown Author'}</p>
        {book.customizedTitle && (
            <p className="text-md text-gray-600 italic mt-1">"{book.customizedTitle}"</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-4 max-w-3xl mx-auto">

        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-fadeIn flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-yellow-300 pb-2">
            Book Details
          </h2>
          <div className="mb-6 space-y-2">
            <div className="flex items-center py-1 border-b border-gray-200">
              <span className="text-gray-600 w-28 font-medium text-sm">Genre:</span>
              <span className="text-gray-800 text-sm font-semibold">{book.genre || 'N/A'}</span>
            </div>
            <div className="flex items-center py-1 border-b border-gray-200">
              <span className="text-gray-600 w-28 font-medium text-sm">Pub. Year:</span>
              <span className="text-gray-800 text-sm font-semibold">{book.publicationYear || 'N/A'}</span>
            </div>
            <div className="flex items-center py-1 border-b border-gray-200">
              <span className="text-gray-600 w-28 font-medium text-sm">Status:</span>
              <span className="text-gray-800 text-sm font-semibold">
                {book.status ? book.status.replace(/_/g, ' ') : 'N/A'}
              </span>
            </div>
            <div className="flex items-center py-1 border-b border-gray-200">
              <span className="text-gray-600 w-28 font-medium text-sm">Enlisted:</span>
              <span className="text-gray-800 text-sm font-semibold">
                {book.enlisted ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
 
          <h3 className="text-lg font-bold text-gray-800 mb-3">Current Keeper</h3>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm mb-6">
            <p className="font-bold text-gray-900 text-lg">{book.owner.name || 'Unknown'}</p>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">About the Book</h3>
          <p className="text-gray-700 leading-snug text-sm mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-inner">
            {book.note || "No detailed description available."}
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            {book.status === 'AVAILABLE' ? (
              <button className="px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>Borrow This Book</span>
              </button>
            ) : (
              <p className="px-6 py-3 text-base font-bold text-gray-600 bg-gray-200 rounded-full">
                {book.status ? book.status.replace(/_/g, ' ') : 'Status N/A'}
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-purple-50 p-6 rounded-xl shadow-md border border-purple-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-yellow-300 pb-2">
            Readers' Log
          </h2>
          {book.previousOwners && book.previousOwners.length > 0 ? (
            <div className="pr-1">
              <ul className="list-none p-0 m-0 space-y-2 font-handwriting text-lg text-purple-900">
                {book.previousOwners.map((owner, index) => (
                  <li key={index} className="py-2 px-3 bg-purple-100 rounded-md border border-purple-200 hover:bg-purple-200 transition-colors duration-200 cursor-pointer shadow-sm">
                    <p className="font-semibold">{owner.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-3 text-sm font-handwriting">No previous readers yet.</p>
          )}
        </div>

      </div>

      <style jsx>{`
        /* Import Google Font for handwriting style */
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

export default BookDetailPage;