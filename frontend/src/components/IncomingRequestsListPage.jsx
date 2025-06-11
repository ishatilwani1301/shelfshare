import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import api from '../api/axiosConfig';

const IncomingRequestsListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingRequestId, setApprovingRequestId] = useState(null); // State to manage loading for approval
  const [rejectingRequestId, setRejectingRequestId] = useState(null); // State to manage loading for rejection

  // Function to fetch incoming requests
  const fetchIncomingRequests = useCallback(async () => {
    try {
      setLoading(true); // Set loading true before fetching
      const response = await api.get('/user/borrowRequestsReceived');
      // Ensure 'requests' array is updated with the correct structure from backend
      // Assuming each item in response.data is a request object
      setRequests(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
      setError('Failed to load incoming requests. Please try again.');
      setRequests([]); // Set requests to empty on error
    } finally {
      setLoading(false); // Always set loading to false
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]); // Re-run effect if fetchIncomingRequests changes (though useCallback prevents this often)

  const handleApproveRequest = async (bookId, requesterUserId, requestId) => {
    setApprovingRequestId(requestId); // Set loading state for this specific request
    try {
      const response = await api.post('/books/approve', {
        bookId: bookId,
        requesterUserId: requesterUserId,
      });
      alert(response.data.message || 'Request approved successfully!');
      // After successful approval, re-fetch the requests to update the list
      fetchIncomingRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      // More specific error message if available from backend, else a generic one
      alert(err.response?.data?.message || 'Failed to approve the request. Please try again.');
    } finally {
      setApprovingRequestId(null); // Clear loading state
    }
  };

  const handleRejectRequest = async (requestId) => {
    // IMPORTANT: You need a backend endpoint for rejecting requests.
    // The provided backend code only shows an /approve endpoint.
    // If you have a reject endpoint, uncomment and adjust the following.
    // For now, this is a placeholder.

    setRejectingRequestId(requestId); // Set loading state for this specific request
    try {
      // Assuming a similar reject endpoint like '/books/reject'
      // You might need to send bookId and requesterUserId here as well,
      // depending on your backend's reject endpoint requirements.
      // For demonstration, let's assume it also needs bookId and requesterUserId
      // You'll need to pass these from the JSX to handleRejectRequest as well.
      // Example: await api.post('/books/reject', { bookId: ..., requesterUserId: ... });
      alert('Reject functionality is not yet fully implemented on the backend or frontend.');
      console.warn('Reject functionality requires a backend endpoint and proper data structure.');
      // After "reject", you'd typically re-fetch or remove from UI
      // fetchIncomingRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.message || 'Failed to reject the request. Please try again.');
    } finally {
      setRejectingRequestId(null); // Clear loading state
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg py-8">Loading incoming requests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg py-8">{error}</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Incoming Borrow Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600 text-lg">No incoming requests at the moment. Check back later!</p>
      ) : (
        <ul className="space-y-6">
          {requests.map((request) => (
            // Use request.borrowRequestId as the key if available and unique
            // Otherwise, a combination of bookId and requesterUserId could be used.
            <li key={request.borrowRequestId || `${request.bookId}-${request.requesterUserId}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.bookTitle}</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Author:</span> {request.bookAuthor}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Requested By:</span> {request.requesterUsername} (ID: {request.requesterUserId})
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Requested On:</span> {new Date(request.requestDate).toLocaleDateString()}
              </p>
              {/* Ensure bookId and requesterUserId are passed to the handler */}
              <div className="mt-5 flex space-x-4">
                <button
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleApproveRequest(request.bookId, request.requesterUserId, request.borrowRequestId)}
                  disabled={approvingRequestId === request.borrowRequestId || rejectingRequestId === request.borrowRequestId}
                >
                  {approvingRequestId === request.borrowRequestId ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleRejectRequest(request.borrowRequestId)} // Pass borrowRequestId if available
                  disabled={approvingRequestId === request.borrowRequestId || rejectingRequestId === request.borrowRequestId}
                >
                  {rejectingRequestId === request.borrowRequestId ? 'Rejecting...' : 'Reject'}
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