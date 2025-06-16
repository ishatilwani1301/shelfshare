// src/pages/AddBookPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from "../api/axiosConfig.js";

// Define your book genres (adjust as per your backend enum: BookGenre)
const BOOK_GENRES = [
  'FICTION',
    'NON_FICTION',
    'SCIENCE',
    'HISTORY',
    'FANTASY',
    'MYSTERY',
    'BIOGRAPHY',
    'CLASSIC',
    'ROMANCE'
];

// Accept onBookAdded as a prop
const AddBookPage = ({ onShelfUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    bookGenre: '',
    publicationYear: '',
    noteContent: '',
    customizedTitle: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Basic validation
    if (!formData.bookTitle || !formData.authorName || !formData.bookGenre || !formData.publicationYear || !formData.noteContent || !formData.customizedTitle) {
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      setLoading(false); // Stop loading on validation error
      return;
    }

    // Validate publicationYear is a valid number and within a reasonable range
    const year = parseInt(formData.publicationYear, 10);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      toast.error('Please enter a valid publication year (e.g., 2023).', { position: 'top-right' });
      setLoading(false); // Stop loading on validation error
      return;
    }

    try {
      const response = await api.post('/books/addNewBook', formData);
      console.log('Response from backend:', response);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Book added successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });

        // Reset form data to empty state
        setFormData({
          bookTitle: '',
          authorName: '',
          bookGenre: '',
          publicationYear: '',
          noteContent: '',
          customizedTitle: '',
        });

        // *** IMPORTANT: Call the onBookAdded callback to trigger MyShelf refresh ***
        if (onShelfUpdate) {
          onShelfUpdate();
        }

        // Navigate back to My Shelf after successful addition and refresh trigger
        navigate('/dashboard/my-shelf');

      } else {
        toast.error(`Failed to add book: ${response.data?.message || 'Unknown server response.'}`, {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error adding book:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Failed to add book: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setLoading(false); // Always stop loading, regardless of success or error
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 w-full">
        <h2 className="text-[#171612] tracking-wide text-[32px] font-extrabold leading-tight">
          Add Book
        </h2>
        <button
          onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>

      {/* You had a duplicate H2 here previously. It's often good to remove it if the header covers it. */}
      {/* <h2 className="text-3xl font-bold mb-8 text-[#171612] self-start">Add New Book</h2> */}

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        {/* All your form fields */}
        <div className="mb-6">
          <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="bookTitle"
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
            Author Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter author's name"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">
            Book Genre <span className="text-red-500">*</span>
          </label>
          <select
            id="bookGenre"
            name="bookGenre"
            value={formData.bookGenre}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            required
          >
            <option value="">Select a genre</option>
            {BOOK_GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
            Publication Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="e.g., 2023"
            min="1000"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">
            Your Note about the Book <span className="text-red-500">*</span>
          </label>
          <textarea
            id="noteContent"
            name="noteContent"
            value={formData.noteContent}
            onChange={handleInputChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Write a brief note about this book (e.g., why you love it, condition, etc.)"
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="customizedTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Note Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customizedTitle"
            name="customizedTitle"
            value={formData.customizedTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="e.g., 'My thoughts on this classic'"
            required
          />
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-shelf')}
            className="px-6 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#f3ebd2] text-[#171612] font-semibold rounded-lg shadow-md hover:bg-[#e0d6c4] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] focus:ring-opacity-75"
            disabled={loading}
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookPage;