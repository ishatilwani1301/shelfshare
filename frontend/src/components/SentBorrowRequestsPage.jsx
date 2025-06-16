import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Assuming your axios instance is here
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:1234'; // Ensure this matches your backend API URL

// Highlight: Accept onShelfUpdate as a prop
const SentBorrowRequestsPage = ({ onShelfUpdate }) => {
  const navigate = useNavigate();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestIdToCancel, setRequestIdToCancel] = useState(null); // State to hold the ID of the request to cancel

  // Fetches the list of sent borrow requests from the backend
  const fetchSentRequests = useCallback(async () => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      const AccessToken = localStorage.getItem('accessToken');
      if (!AccessToken) {
        throw new Error("Access token not found. Please log in.");
      }
      const response = await api.get(`${API_BASE_URL}/user/borrowRequestsSent`, {
        headers: { Authorization: `Bearer ${AccessToken}` }
      });

      if (Array.isArray(response.data)) {
        setSentRequests(response.data);
      } else if (response.data && Array.isArray(response.data.requests)) {
        setSentRequests(response.data.requests);
      } else {
        console.warn('Unexpected data format for sent borrow requests:', response.data);
        setSentRequests([]);
      }
    } catch (err) {
      console.error('Error fetching sent borrow requests:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load sent requests. Please check your connection or try again.';
      setError(errorMessage);
      setSentRequests([]); // Clear requests on error
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false); // Always set loading to false after the request
    }
  }, [API_BASE_URL]); // Add API_BASE_URL to dependency array for useCallback

  // Effect hook to fetch requests when the component mounts
  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  // Handler to open the confirmation modal
  const handleOpenCancelModal = (borrowRequestId) => {
    setRequestIdToCancel(borrowRequestId);
    setShowConfirmModal(true);
  };

  // Handler to close the confirmation modal
  const handleCloseCancelModal = () => {
    setShowConfirmModal(false);
    setRequestIdToCancel(null);
  };

  // Handles cancelling a borrow request after confirmation
  const handleConfirmCancelRequest = async () => {
    if (!requestIdToCancel) return; // Should not happen if modal logic is correct

    handleCloseCancelModal(); // Close the modal immediately

    try {
      const AccessToken = localStorage.getItem('accessToken');
      if (!AccessToken) {
        throw new Error("Access token not found. Please log in.");
      }
      await api.delete(`${API_BASE_URL}/user/cancelBorrowRequest/${requestIdToCancel}`, {
        headers: { Authorization: `Bearer ${AccessToken}` }
      });
      toast.success('Borrow request cancelled successfully!', { position: 'top-right', autoClose: 2000 });

      fetchSentRequests(); // Refresh the list on this page to show the updated status

      // Highlight: Call onShelfUpdate after successful cancellation
      if (onShelfUpdate) {
        onShelfUpdate(); // Notify parent (MyShelf) to refresh its counts
      }
    } catch (err) {
      console.error('Error cancelling borrow request:', err);
      const errorMessage = err.response?.data?.message || 'Failed to cancel request. Please ensure it is pending and you are the requester.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171612]"></div>
        <p className="ml-4 text-lg text-[#171612]">Loading sent borrow requests...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="text-center p-8 bg-gray-100 min-h-screen font-sans">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchSentRequests} // Allows user to retry fetching
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <ToastContainer /> {/* Component for displaying toast notifications */}

      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
        <h2 className="text-[#171612] tracking-wide text-[32px] font-extrabold leading-tight">
          Sent Borrow Requests
        </h2>
        <button
         onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>

      {sentRequests.length === 0 ? (
        <p className="text-center text-[#837c67] text-lg mt-16">
          You haven't sent any borrow requests yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sentRequests.map((request) => (
            <div key={request.borrowRequestId} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-[#171612] text-xl font-semibold mb-2">{request.bookName}</h3>
              <p className="text-[#837c67] text-base mb-2">
                Author: <span className="font-medium">{request.author}</span>
              </p>
              <p className="text-[#837c67] text-base mb-2">
                Request Date:{' '}
                <span className="font-medium">
                  {new Date(request.requestedDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-[#171612] text-lg font-bold mb-4">
                Status:{' '}
                <span
                  className={`
                    ${request.acceptanceStatus === 'PENDING' ? 'text-yellow-600' : ''}
                    ${request.acceptanceStatus === 'ACCEPTED' ? 'text-green-600' : ''}
                    ${request.acceptanceStatus === 'REJECTED' ? 'text-red-600' : ''}
                    ${request.acceptanceStatus === 'CANCELLED' ? 'text-gray-600' : ''}
                  `}
                >
                  {request.acceptanceStatus}
                </span>
              </p>
              {request.acceptanceStatus === 'PENDING' && (
                <button
                  onClick={() => handleOpenCancelModal(request.borrowRequestId)} // Open modal on click
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                  Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Cancellation</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this borrow request? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseCancelModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancelRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentBorrowRequestsPage;