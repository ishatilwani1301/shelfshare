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
    const fetchIncomingRequests = async () => {
      const AccessToken = localStorage.getItem('accessToken');
      if (!AccessToken) {
        setError('Access token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/user/borrowRequestsReceived', {
          headers: {
            Authorization: `Bearer ${AccessToken}`,
          },
        });
        console.log('Incoming response:', response.data);
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching incoming requests:', err);
        setError('Failed to load incoming requests. Please try again.');
        setLoading(false);
      }
    };

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
            <li key={request.bookId} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{request.bookTitle}</h3>
              <p className="text-gray-600">Author: {request.bookAuthor}</p>
              <p className="text-gray-600">Requested By: {request.requesterUsername}</p>
              <p className="text-gray-600">Email: {request.requesterEmail}</p>
              <p className="text-gray-600">Location: {`${request.requesterArea}, ${request.requesterCity}, ${request.requesterState}, ${request.requesterCountry} - ${request.requesterPincode}`}</p>
              <p className="text-gray-600">Requested On: {new Date(request.requestDate).toLocaleDateString()}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleApproveRequest(request.bookId, request.requesterUserId)}
                >
                  {approvingRequestId === request.borrowRequestId ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleRejectRequest(request.bookId, request.requesterUserId)}
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

const handleApproveRequest = async (bookId, requesterUserId) => {
  const AccessToken = localStorage.getItem('accessToken');
  if (!AccessToken) {
    alert('Access token not found. Please log in.');
    return;
  }

  try {
    await api.post(
      `/books/requests/approve`,
      {
        bookId: bookId,
        requesterUserId: requesterUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
    alert('Request approved successfully!');
    window.location.reload();
  } catch (err) {
    console.error('Error approving request:', err);
    alert('Failed to approve the request. Please try again.');
  }
};

const handleRejectRequest = async (bookId, requesterUserId) => {
  const AccessToken = localStorage.getItem('accessToken');
  if (!AccessToken) {
    alert('Access token not found. Please log in.');
    return;
  }

  try {
    await api.post(
      `/books/requests/reject`,
      {
        bookId: bookId,
        requesterUserId: requesterUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
    alert('Request rejected successfully!');
    window.location.reload();
  } catch (err) {
    console.error('Error rejecting request:', err);
    alert('Failed to reject the request. Please try again.');
  }
};

export default IncomingRequestsListPage;