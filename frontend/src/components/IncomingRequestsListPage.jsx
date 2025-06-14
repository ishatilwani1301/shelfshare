import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const API_BASE_URL = 'http://localhost:1234'; // Define base URL for consistency

const IncomingRequestsListPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to manage loading for approval/rejection of specific requests
  const [processingRequestId, setProcessingRequestId] = useState(null);
  // New state to store book borrow statuses
  const [bookStatuses, setBookStatuses] = useState({});

  // Function to fetch incoming requests and then their book statuses
  const fetchIncomingRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      setError('Access token not found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`${API_BASE_URL}/user/borrowRequestsReceived`, { // Use API_BASE_URL
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      setRequests(response.data);
      console.log('Incoming requests>>>>>>>>:', response.data); // Log the incoming requests for debugging

      // --- Fetch borrow status for each book in the requests ---
      const newBookStatuses = {};
      for (const request of response.data) {
        try {
          const statusResponse = await api.get(`${API_BASE_URL}/books/${request.bookId}/borrowStatus`, {
            headers: {
              Authorization: `Bearer ${AccessToken}`,
            },
          });
          console.log(`Status for book ${request.bookId}:`, statusResponse.data); // Log each status response
          newBookStatuses[request.bookId] = statusResponse.data; // Store status by bookId
        } catch (statusErr) {
          console.error(`Error fetching status for book ${request.bookId}:`, statusErr);
          newBookStatuses[request.bookId] = 'Status N/A'; // Default if status cannot be fetched
        }
      }
      setBookStatuses(newBookStatuses);

    } catch (err) {
      console.error('Error fetching incoming requests:', err);
      setError(err.response?.data?.message || 'Failed to load incoming requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect to call fetchIncomingRequests on component mount
  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  const handleApproveRequest = async (bookId, requesterUserId, borrowRequestId) => {
    setProcessingRequestId(borrowRequestId);

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      toast.error('Access token not found. Please log in.', { position: 'top-right' });
      setProcessingRequestId(null);
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      const response = await api.post(`${API_BASE_URL}/books/approve`, payload, { // Use API_BASE_URL
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      toast.success(response.data.message || 'Request approved successfully!', { position: 'top-right' });
      fetchIncomingRequests(); // Re-fetch the requests to update the list and statuses
    } catch (err) {
      console.error('Error approving request:', err);
      toast.error(err.response?.data?.message || 'Failed to approve the request. Please try again.', { position: 'top-right' });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRejectRequest = async (bookId, requesterUserId, borrowRequestId) => {
    setProcessingRequestId(borrowRequestId);

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      toast.error('Access token not found. Please log in.', { position: 'top-right' });
      setProcessingRequestId(null);
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      await api.post(`${API_BASE_URL}/books/reject`, payload, { // Use API_BASE_URL
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      toast.success('Request rejected successfully!', { position: 'top-right' });
      fetchIncomingRequests(); // Re-fetch the requests to update the list and statuses
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error(err.response?.data?.message || 'Failed to reject the request. Please try again.', { position: 'top-right' });
    } finally {
      setProcessingRequestId(null);
    }
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
      <ToastContainer /> {/* Add ToastContainer here */}
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
          No incoming requests at the moment. Check back later!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added grid for layout */}
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
              <p className="text-[#837c67] text-base mb-1">
                <span className="font-medium">Location:</span>{' '}
                {`${request.requesterArea}, ${request.requesterCity}, ${request.requesterState}, ${request.requesterCountry} - ${request.requesterPincode}`}
              </p>
              <p className="text-[#837c67] text-base mb-4">
                <span className="font-medium">Requested On:</span>{' '}
                {new Date(request.requestDate).toLocaleDateString()}
              </p>
              {/* --- Display Borrow Status --- */}
              <p className="text-[#171612] text-base mb-4">
                <span className="font-bold text-lg">Book Status:</span>{' '}
                <span className={`font-semibold ${bookStatuses[request.bookId] === 'Borrowed' ? 'text-red-600' : 'text-green-600'}`}>
                  {bookStatuses[request.bookId] || 'Loading...'}
                </span>
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                  onClick={() => handleApproveRequest(request.bookId, request.requesterUserId, request.borrowRequestId)}
                  disabled={processingRequestId === request.borrowRequestId || bookStatuses[request.bookId] === 'Borrowed'}
                >
                  {processingRequestId === request.borrowRequestId ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                  onClick={() => handleRejectRequest(request.bookId, request.requesterUserId, request.borrowRequestId)}
                  disabled={processingRequestId === request.borrowRequestId}
                >
                  {processingRequestId === request.borrowRequestId ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncomingRequestsListPage;