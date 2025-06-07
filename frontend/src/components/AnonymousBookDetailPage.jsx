import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 

const AnonymousBookDetailPage = ({ onBackToList }) => {
  const { offerId } = useParams(); 
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(''); 

      if (!offerId) {
        setError('No book ID found in the URL to fetch details.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:1234/anonymous-books/${offerId}`); 

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText || response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched single book detail from backend:", data);

        if (!data || !data.bookId) {
          setError('Book offer not found for the provided ID.');
          setOffer(null);
          return;
        }

        const processedOffer = {
          bookId: data.bookId,
          title: data.CustomizedTitle || 'Untitled Offer',
          description: data.noteContent || 'No description provided.',
          tags: data.tags || [],
          
          anonymousAuthor: data.currentOwnerUsername, 
          datePosted: data.datePosted || 'N/A',
        };

        setOffer(processedOffer);

      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setError(`Failed to load book details: ${err.message || "An unexpected error occurred."}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [offerId]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#171612]">Loading offer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={onBackToList}
          className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Back to Offers List
        </button>
      </div>
    );
  }

  if (!offer) {
      return null;
  }

  return (
    <div className="p-4">
      <button
        onClick={onBackToList}
        className="mb-4 flex items-center gap-2 text-[#837c67] hover:text-[#171612] transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
        Back to Offers List
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-[#171612] tracking-light text-[32px] font-bold leading-tight mb-4">{offer.title}</h2>
        <p className="text-[#837c67] text-base mb-4">{offer.description}</p>

        {offer.tags && offer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {offer.tags.map(tag => (
              <span key={tag} className="bg-[#f3ebd2] text-[#171612] text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[#171612] text-sm mb-4">
          <span className="font-semibold">Posted by:</span> {offer.anonymousAuthor}
        </p>

        <button className="mt-4 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ebd2] pl-4 pr-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d8c0]">
          Request This Book
        </button>
      </div>
    </div>
  );
};

export default AnonymousBookDetailPage;