import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';

const BorrowedBooksListPage = () => {
  const navigate = useNavigate();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEnlistModal, setShowEnlistModal] = useState(false);
  const [currentBookToEnlist, setCurrentBookToEnlist] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [customizedTitle, setCustomizedTitle] = useState('');

  // New states for report confirmation modal
  const [showReportConfirmModal, setShowReportConfirmModal] = useState(false);
  const [bookToReport, setBookToReport] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await api.get('http://localhost:1234/books/booksBorrowed');
        if (Array.isArray(response.data)) {
          setBorrowedBooks(response.data);
        } else if (response.data && response.data[0]) {
          setBorrowedBooks(response.data[0]);
        } else {
          setBorrowedBooks([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching borrowed books:', err);
        setError('Failed to load borrowed books. Please try again.');
        toast.error('Failed to load borrowed books. Please try again.');
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleEnlistClick = (book) => {
    setCurrentBookToEnlist(book);
    setShowEnlistModal(true);
    setNoteContent('');
    setCustomizedTitle('');
  };

  const handleEnlistSubmit = async () => {
    if (!currentBookToEnlist) return;

    const loadingToastId = toast.loading('Enlisting book...');

    try {
      const response = await api.post(`http://localhost:1234/books/enlist/${currentBookToEnlist.id}`, {
        noteContent,
        customizedTitle,
      });
      toast.success(response.data.message || 'Book enlisted successfully!', { id: loadingToastId });
      // Optionally, refresh the list or remove the book from borrowed list if enlisted
      // setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== currentBookToEnlist.id));
    } catch (err) {
      console.error('Error enlisting book:', err);
      toast.error(err.response?.data?.message || 'Failed to enlist book.', { id: loadingToastId });
    } finally {
      setShowEnlistModal(false);
      setCurrentBookToEnlist(null);
    }
  };

  // Modified handleReportClick to open modal
  const handleReportClick = (book) => {
    setBookToReport(book); // Store the book object
    setShowReportConfirmModal(true); // Open the confirmation modal
  };

  // New function for confirming report within the modal
  const confirmReport = async () => {
    if (!bookToReport) return;

    const loadingToastId = toast.loading('Reporting book...');
    try {
      const response = await api.post(`http://localhost:1234/books/reportBook/${bookToReport.id}`);
      toast.success(response.data.message || 'Book reported successfully!', { id: loadingToastId });
      // Optionally, refresh the list or remove the reported book
      // setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== bookToReport.id));
    } catch (err) {
      console.error('Error reporting book:', err);
      toast.error(err.response?.data?.message || 'Failed to report book.', { id: loadingToastId });
    } finally {
      setShowReportConfirmModal(false); // Close the modal
      setBookToReport(null); // Clear the book
    }
  };


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
          onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <Toaster position="top-right" reverseOrder={false} />

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
              <h3 className="text-[#171612] text-xl font-semibold mb-2">{book.bookTitle}</h3>
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Author:</span> {book.authorName}
              </p>
              {/* <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Borrowed From:</span> {book.currentOwnerName}
              </p> */}
              {/* <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Genre:</span> {book.bookGenre}
              </p>
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Published:</span> {book.publicationYear}
              </p> */}
              {/* {book.customizedTitle && (
                <p className="text-[#837c67] text-base mb-1">
                  <span className="font-medium">Your Note Title:</span> {book.customizedTitle}
                </p>
              )}
              {book.noteContent && (
                <p className="text-[#837c67] text-base mb-1">
                  <span className="font-medium">Your Note:</span> {book.noteContent}
                </p>
              )} */}
              {/* <p className="text-[#171612] text-lg font-bold mt-3 mb-1">
                Status:{' '}
                <span className={`
                  ${book.bookStatus === 'BORROWED' ? 'text-blue-600' : 'text-gray-600'}
                `}>
                  {book.bookStatus}
                </span>
              </p> */}
              {book.previousOwners && book.previousOwners.length > 0 && (
                <p className="text-[#837c67] text-sm mt-2">
                  <span className="font-medium">Previous Owners:</span>{' '}
                  {book.previousOwners.join(', ')}
                </p>
              )}
              {/* <p className="text-[#837c67] text-sm mt-2">
                <span className="font-medium">Location:</span> {book.userArea}, {book.userCity}, {book.userState}
              </p> */}
              {/* {book.message && typeof book.message === 'string' && book.message.trim() !== '' && (
                <p className="text-[#837c67] text-sm mt-3 italic bg-gray-50 p-3 rounded-md border border-gray-200">
                  {book.message}
                </p>
              )} */}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleEnlistClick(book)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md"
                >
                  Enlist Book
                </button>
                <button
                  onClick={() => handleReportClick(book)} 
                  className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  Report Book
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Enlist Book Modal (remains the same) */}
      {showEnlistModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Enlist "{currentBookToEnlist?.bookTitle}"</h3>
            <div className="mb-4">
              <label htmlFor="customizedTitle" className="block text-sm font-medium text-gray-700">
                Customized Title (Optional)
              </label>
              <input
                type="text"
                id="customizedTitle"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={customizedTitle}
                onChange={(e) => setCustomizedTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700">
                Note Content (Optional)
              </label>
              <textarea
                id="noteContent"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEnlistModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEnlistSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Confirm Enlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Confirmation Modal */}
      {showReportConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h3 className="text-xl font-bold mb-4 text-red-700">Confirm Report</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to report the book "<strong>{bookToReport?.bookTitle}</strong>"? This action is typically irreversible and flags the book for review.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowReportConfirmModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-base font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReport}
                className="bg-red-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Report It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksListPage;