import React, { useEffect, useState } from 'react';

const AnonymousBookDetailPage = ({ bookOfferId, onBackToList }) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate fetching a single book offer by ID
    const mockOffers = [
      {
        id: 'abo1',
        title: 'Offering "The Alchemist"',
        description: 'A beautiful copy of Paulo Coelho\'s "The Alchemist". Read it last year, really resonated with me. Looking for someone who would appreciate it. It explores themes of destiny, personal legends, and the wisdom of following your dreams. Highly recommended for introspective readers.',
        tags: ['Fiction', 'Spiritual', 'Self-help', 'Adventure'],
        condition: 'Good',
        anonymousAuthor: 'Anonymous Seeker',
        datePosted: '2024-05-15',
      },
      {
        id: 'abo2',
        title: 'Looking to give away "Sapiens"',
        description: 'Yuval Noah Harari\'s "Sapiens: A Brief History of Humankind". Mind-blowing read, but I need to clear some shelf space. Hope it finds a good home. This book completely reshaped my understanding of human history and our place in the world.',
        tags: ['Non-fiction', 'History', 'Science', 'Anthropology'],
        condition: 'Very Good',
        anonymousAuthor: 'Anonymous Historian',
        datePosted: '2024-05-20',
      },
      {
        id: 'abo3',
        title: 'Free copy of "Dune"',
        description: 'First book in the classic sci-fi series. Great condition. Offering it to someone who loves epic world-building. A must-read for any science fiction fan, with intricate political intrigue and ecological themes.',
        tags: ['Science Fiction', 'Fantasy', 'Classic', 'Epic'],
        condition: 'Good',
        anonymousAuthor: 'Anonymous Arrakis Fan',
        datePosted: '2024-05-22',
      },
      {
        id: 'abo4',
        title: 'Poetry collection by Rupi Kaur',
        description: 'Milk and Honey. A very raw and emotional collection. Gently used, hoping it can inspire someone else. Explores themes of abuse, love, loss, and femininity.',
        tags: ['Poetry', 'Modern', 'Feminism'],
        condition: 'Fair',
        anonymousAuthor: 'Anonymous Poet',
        datePosted: '2024-05-25',
      },
    ];

    const foundOffer = mockOffers.find(o => o.id === bookOfferId);

    setTimeout(() => { 
      if (foundOffer) {
        setOffer(foundOffer);
      } else {
        setError('Book offer not found.');
      }
      setLoading(false);
    }, 500);
  }, [bookOfferId]); 

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
      return null; // Should not happen if error handled, but as a safeguard
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

        <div className="flex flex-wrap gap-2 mb-4">
          {offer.tags.map(tag => (
            <span key={tag} className="bg-[#f3ebd2] text-[#171612] text-sm font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[#171612] text-sm mb-2">
          <span className="font-semibold">Condition:</span> {offer.condition}
        </p>
        <p className="text-[#171612] text-sm mb-4">
          <span className="font-semibold">Posted by:</span> {offer.anonymousAuthor} on {offer.datePosted}
        </p>

      
        <button className="mt-4 flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3ebd2] pl-4 pr-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d8c0]">
          Request This Book
        </button>
      </div>
    </div>
  );
};

export default AnonymousBookDetailPage;
