import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const BorrowedBooksListPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await api.get('/books/borrowed');
        setBorrowedBooks(response.data);
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
    return <p className="text-center text-gray-500">Loading borrowed books...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p className="text-gray-500">You have not borrowed any books yet.</p>
      ) : (
        <ul className="space-y-4">
          {borrowedBooks.map((book) => (
            <li key={book.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-600">Borrowed On: {new Date(book.borrowedDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedBooksListPage;