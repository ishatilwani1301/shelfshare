import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Assuming your axios instance is here
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:1234';

const SentBorrowRequestsPage = () => {
  const navigate = useNavigate();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSentRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`${API_BASE_URL}/user/borrowRequestsSent`);
      // Ensure the data structure matches what's expected.
      // If response.data is an array, use it directly.
      if (Array.isArray(response.data)) {
        setSentRequests(response.data);
      } else {
        // If the backend sends an object with a list, adapt it.
        // Example: { requests: [...] }
        setSentRequests(response.data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching sent borrow requests:', err);
      setError(err.response?.data?.message || 'Failed to load sent requests. Please try again.');
      setSentRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  // IMPORTANT: For handleCancelRequest to work, your backend MUST provide a unique 'requestId'
  // in the sentRequests array. If not, cancellation won't work correctly.
  const handleCancelRequest = async (requestId) => { // This 'requestId' must come from the fetched data
    if (!window.confirm('Are you sure you want to cancel this borrow request?')) {
      return;
    }

    try {
      await api.post(`${API_BASE_URL}/user/borrowRequests/${requestId}/cancel`);
      toast.success('Borrow request cancelled successfully!', { position: 'top-right' });
      fetchSentRequests(); // Refresh the list to reflect the cancellation
    } catch (err) {
      console.error('Error cancelling borrow request:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel request.', { position: 'top-right' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171612]"></div>
        <p className="ml-4 text-lg text-[#171612]">Loading sent borrow requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchSentRequests}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <ToastContainer />
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
          {sentRequests.map((request, index) => (
            // Using index as key is generally not recommended if order can change,
            // but necessary if backend doesn't provide a unique ID in this response.
            // Ideally, your backend would include a 'requestId'.
            <div key={request.bookName + index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-[#171612] text-xl font-semibold mb-2">{request.bookName}</h3> {/* Changed from bookTitle */}
              <p className="text-[#837c67] text-base mb-2">
                Requested from: <span className="font-medium">{request.requestedFromUsername}</span> {/* Changed from ownerUsername */}
              </p>
              <p className="text-[#837c67] text-base mb-2">
                Author: <span className="font-medium">{request.author}</span> {/* Added author */}
              </p>
              <p className="text-[#837c67] text-base mb-2">
                Request Date:{' '}
                <span className="font-medium">
                  {new Date(request.requestedDate).toLocaleDateString()} {/* Changed from requestDate */}
                </span>
              </p>
              <p className="text-[#171612] text-lg font-bold mb-4">
                Status:{' '}
                <span
                  className={`
                    ${request.acceptanceStatus === 'PENDING' ? 'text-yellow-600' : ''} {/* Changed from status */}
                    ${request.acceptanceStatus === 'ACCEPTED' ? 'text-green-600' : ''}
                    ${request.acceptanceStatus === 'REJECTED' ? 'text-red-600' : ''}
                    ${request.acceptanceStatus === 'CANCELLED' ? 'text-gray-600' : ''}
                  `}
                >
                  {request.acceptanceStatus} {/* Changed from status */}
                </span>
              </p>
              {request.acceptanceStatus === 'PENDING' && ( // Check acceptanceStatus for button
                // Placeholder for requestId. If backend does not provide it,
                // cancellation for specific requests won't work reliably without
                // another API call to get the ID based on other details.
                // It's crucial for the backend to return requestId.
                <button
                  onClick={() => handleCancelRequest(request.requestId)} // This requestId must be available
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                  Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentBorrowRequestsPage;