import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:1234';

// Highlight: Accept onShelfUpdate as a prop
const IncomingRequestsListPage = ({ onShelfUpdate }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for confirmation modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Stores the request object for the modal

  const fetchIncomingRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      setError('Access token not found. Please log in.');
      setLoading(false);
      toast.error('Access token not found. Please log in.', { position: 'top-right' });
      return;
    }

    try {
      const response = await api.get(`${API_BASE_URL}/user/borrowRequestsReceived`, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });

      let incomingData = [];
      if (Array.isArray(response.data)) {
        incomingData = response.data;
      } else if (response.data && Array.isArray(response.data[0])) {
        incomingData = response.data[0];
      } else {
        console.warn('Received unexpected data format for incoming requests:', response.data);
        incomingData = [];
      }

      // Filter requests to show only PENDING ones and add `isProcessing` flag
      const pendingRequests = incomingData
        .filter((request) => request.borrowRequestStatuString === 'PENDING')
        .map((request) => ({
          ...request,
          isProcessing: false, // Initialize a new flag for each request
        }));

      setRequests(pendingRequests);
      console.log('Incoming PENDING requests with processing state:', pendingRequests);
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
      setError(err.response?.data?.message || 'Failed to load incoming requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  // --- Handlers for opening modals ---
  const handleOpenApproveModal = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  // --- Utility function to update the processing state of a specific request ---
  const updateRequestProcessingStatus = (requestId, status) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.borrowRequestId === requestId ? { ...req, isProcessing: status } : req
      )
    );
  };

  // --- Handlers for confirming actions within modals ---
  const confirmApproveRequest = async () => {
    if (!selectedRequest) return;

    const { bookId, requesterUserId, borrowRequestId } = selectedRequest;

    updateRequestProcessingStatus(borrowRequestId, true); // Set isProcessing to true for this request
    setShowApproveModal(false); // Close the modal immediately
    setSelectedRequest(null); // Clear selected request after closing modal

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      toast.error('Access token not found. Please log in.', { position: 'top-right' });
      updateRequestProcessingStatus(borrowRequestId, false); // Reset processing status on error
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      const response = await api.post(`${API_BASE_URL}/books/approve`, payload, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      toast.success(response.data.message || 'Request approved successfully!', { position: 'top-right' });

      // Remove the approved request from the list immediately for UI update
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.borrowRequestId !== borrowRequestId)
      );

      // Highlight: Call onShelfUpdate after successful approval
      if (onShelfUpdate) {
        onShelfUpdate();
      }

    } catch (err) {
      console.error('Error approving request:', err);
      toast.error(err.response?.data?.message || 'Failed to approve the request. Please try again.', { position: 'top-right' });
      updateRequestProcessingStatus(borrowRequestId, false); // Reset processing status on error
    }
    // No finally block needed here for processing status, as it's either removed or reset in catch.
  };

  const confirmRejectRequest = async () => {
    if (!selectedRequest) return;

    const { bookId, requesterUserId, borrowRequestId } = selectedRequest;

    updateRequestProcessingStatus(borrowRequestId, true); // Set isProcessing to true for this request
    setShowRejectModal(false); // Close the modal immediately
    setSelectedRequest(null); // Clear selected request after closing modal

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      toast.error('Access token not found. Please log in.', { position: 'top-right' });
      updateRequestProcessingStatus(borrowRequestId, false); // Reset processing status on error
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      await api.post(`${API_BASE_URL}/books/reject`, payload, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      toast.success('Request rejected successfully!', { position: 'top-right' });

      // Remove the rejected request from the list immediately for UI update
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.borrowRequestId !== borrowRequestId)
      );

      // Highlight: Call onShelfUpdate after successful rejection
      if (onShelfUpdate) {
        onShelfUpdate();
      }

    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error(err.response?.data?.message || 'Failed to reject the request. Please try again.', { position: 'top-right' });
      updateRequestProcessingStatus(borrowRequestId, false); // Reset processing status on error
    }
    // No finally block needed here for processing status, as it's either removed or reset in catch.
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171612]"></div>
        <p className="ml-4 text-lg text-[#171612]">Loading incoming requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-gray-100 min-h-screen font-sans">
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
      <ToastContainer />

      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
        <h2 className="text-[#171612] tracking-wide text-[32px] font-extrabold leading-tight">
          Incoming Borrow Requests
        </h2>
        <button
          onClick={() => navigate('/dashboard/my-shelf')}
          className="bg-[#f3ebd2] text-[#171612] py-2 px-4 rounded-md text-base font-medium hover:bg-[#e0d6c4] transition-colors duration-200 shadow-md"
        >
          &larr; Back to My Shelf
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-[#837c67] text-lg mt-16">
          No pending incoming requests at the moment. Check back later!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <li key={request.borrowRequestId} className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
              <h3 className="text-[#171612] text-xl font-semibold mb-2">{request.bookTitle}</h3>
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Author:</span> {request.bookAuthor}
              </p>
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Requested By:</span> {request.requesterUsername}
              </p>
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Email:</span> {request.requesterEmail}
              </p>
              <p className="text-[#171612] text-base mb-4">
                <span className="font-bold text-lg">Request Status:</span>{' '}
                <span className={`font-semibold ${request.borrowRequestStatuString === 'PENDING' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {request.borrowRequestStatuString}
                </span>
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                  onClick={() => handleOpenApproveModal(request)}
                  // Use request.isProcessing for this specific button
                  disabled={request.isProcessing || request.borrowRequestStatuString !== 'PENDING'}
                >
                  {request.isProcessing ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                  onClick={() => handleOpenRejectModal(request)}
                  // Use request.isProcessing for this specific button
                  disabled={request.isProcessing || request.borrowRequestStatuString !== 'PENDING'}
                >
                  {request.isProcessing ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h3 className="text-xl font-bold mb-4 text-green-700">Confirm Approval</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve the borrow request for "
              <strong>{selectedRequest.bookTitle}</strong>" by{' '}
              <strong>{selectedRequest.requesterUsername}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedRequest(null); // Clear selected request on cancel
                }}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-base font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproveRequest}
                className="bg-green-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h3 className="text-xl font-bold mb-4 text-red-700">Confirm Rejection</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to reject the borrow request for "
              <strong>{selectedRequest.bookTitle}</strong>" by{' '}
              <strong>{selectedRequest.requesterUsername}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null); // Clear selected request on cancel
                }}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-base font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectRequest}
                className="bg-red-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingRequestsListPage;