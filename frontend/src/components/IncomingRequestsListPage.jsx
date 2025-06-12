import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';

const IncomingRequestsListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to manage loading for approval/rejection of specific requests
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // Function to fetch incoming requests
  // Use useCallback to memoize this function, preventing unnecessary re-renders
  const fetchIncomingRequests = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors before fetching

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
      // Assuming response.data is an array of request objects
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
      setError('Failed to load incoming requests. Please try again.');
      setRequests([]); // Set requests to empty on error
    } finally {
      setLoading(false); // Always set loading to false
    }
  }, []); // Empty dependency array means this function is created once

  // useEffect to call fetchIncomingRequests on component mount
  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]); // Dependency array includes fetchIncomingRequests

  const handleApproveRequest = async (bookId, requesterUserId, borrowRequestId) => {
    setProcessingRequestId(borrowRequestId); // Set loading state for this specific request

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      alert('Access token not found. Please log in.');
      setProcessingRequestId(null);
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      const response = await api.post(`/books/approve`, payload, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      alert(response.data.message || 'Request approved successfully!');
      // After successful approval, re-fetch the requests to update the list
      fetchIncomingRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err.response?.data?.message || 'Failed to approve the request. Please try again.');
    } finally {
      setProcessingRequestId(null); // Clear loading state
    }
  };

  const handleRejectRequest = async (bookId, requesterUserId, borrowRequestId) => {
    setProcessingRequestId(borrowRequestId); // Set loading state for this specific request

    const AccessToken = localStorage.getItem('accessToken');
    if (!AccessToken) {
      alert('Access token not found. Please log in.');
      setProcessingRequestId(null);
      return;
    }

    const payload = {
      bookId: bookId,
      requesterUserId: requesterUserId,
    };

    try {
      // Assuming your reject endpoint is /books/requests/reject and expects bookId and requesterUserId
      await api.post(`/books/requests/reject`, payload, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      alert('Request rejected successfully!');
      // After successful rejection, re-fetch the requests to update the list
      fetchIncomingRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.message || 'Failed to reject the request. Please try again.');
    } finally {
      setProcessingRequestId(null); // Clear loading state
    }
  };

  // --- Render Logic ---
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
            <li key={request.borrowRequestId} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{request.bookTitle}</h3>
              <p className="text-gray-600">Author: {request.bookAuthor}</p>
              <p className="text-gray-600">Requested By: {request.requesterUsername}</p>
              <p className="text-gray-600">Email: {request.requesterEmail}</p>
              <p className="text-gray-600">Location: {`${request.requesterArea}, ${request.requesterCity}, ${request.requesterState}, ${request.requesterCountry} - ${request.requesterPincode}`}</p>
              <p className="text-gray-600">Requested On: {new Date(request.requestDate).toLocaleDateString()}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleApproveRequest(request.bookId, request.requesterUserId, request.borrowRequestId)}
                  disabled={processingRequestId === request.borrowRequestId}
                >
                  {processingRequestId === request.borrowRequestId ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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