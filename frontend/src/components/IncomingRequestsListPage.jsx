import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const IncomingRequestsListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const response = await api.get('/books/incoming-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching incoming requests:', err);
        setError('Failed to load incoming requests. Please try again.');
        setLoading(false);
      }
    };

    fetchIncomingRequests();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading incoming requests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Incoming Borrow Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No incoming requests at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{request.bookTitle}</h3>
              <p className="text-gray-600">Requested By: {request.requestedBy}</p>
              <p className="text-gray-600">Requested On: {new Date(request.requestedDate).toLocaleDateString()}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleApproveRequest(request.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleRejectRequest(request.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const handleApproveRequest = async (requestId) => {
  try {
    await api.post(`/books/requests/${requestId}/approve`);
    alert('Request approved successfully!');
    window.location.reload();
  } catch (err) {
    console.error('Error approving request:', err);
    alert('Failed to approve the request. Please try again.');
  }
};

const handleRejectRequest = async (requestId) => {
  try {
    await api.post(`/books/requests/${requestId}/reject`);
    alert('Request rejected successfully!');
    window.location.reload();
  } catch (err) {
    console.error('Error rejecting request:', err);
    alert('Failed to reject the request. Please try again.');
  }
};

export default IncomingRequestsListPage;