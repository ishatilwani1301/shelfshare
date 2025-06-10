import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AnonymousBooksAvailablePage = ({ searchQuery, onSelectBookOffer }) => {
  const [allOffers, setAllOffers] = useState([]); 
  const [filteredAndPaginatedOffers, setFilteredAndPaginatedOffers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorFilter, setAuthorFilter] = useState('All'); 
  const [genreFilter, setGenreFilter] = useState('All');
  
  const [uniqueAuthors, setUniqueAuthors] = useState(['All']);
  const [uniqueGenres, setUniqueGenres] = useState(['All']);
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  const [currentFilteredOffers, setCurrentFilteredOffers] = useState([]);

  const navigate = useNavigate();

  const stickyNoteColors = [
    'bg-[#FFEC8B]', // Brighter Light Yellow
    'bg-[#C6F6D5]', // Pastel Mint Green
    'bg-[#A7D9FD]', // Lighter Sky Blue
    'bg-[#FFC4B0]', // Soft Peach Orange
    'bg-[#FBCFE8]', // Light Bubblegum Pink (New)
    'bg-[#D8B4FE]', // Lavender Purple
    'bg-[#81E6D9]', // Teal (existing)
    'bg-[#FCA5A5]', // Light Red/Pink (existing)
    'bg-[#FDE68A]', // Warm Yellow (New)
    'bg-[#86EFAC]', // Vivid Green (New)
    'bg-[#BAE6FD]', // Cyan Blue (New)
    'bg-[#FECDD3]', // Rose Pink (New)
    'bg-[#C7D2FE]', // Periwinkle Blue (New)
    'bg-[#B2F5EA]', // Aqua Green (New)
    'bg-[#D1D5DB]', // Light Gray (New)
  ];

  const stickyNoteRotations = [
    'rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-3', '-rotate-3', 'rotate-0'
  ];


  const getRandomColor = () => stickyNoteColors[Math.floor(Math.random() * stickyNoteColors.length)];
  const getRandomRotation = () => stickyNoteRotations[Math.floor(Math.random() * stickyNoteRotations.length)];


  

  useEffect(() => {
    const fetchAnonymousOffers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:1234/anonymous-books');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText || response.statusText}`);
        }
        const data = await response.json();

        const processedOffers = data.map(backendOffer => {
          const genre = backendOffer.bookGenre && backendOffer.bookGenre.trim() !== '' ? backendOffer.bookGenre.trim() : '';
          const author = backendOffer.bookAuthor && backendOffer.bookAuthor.trim() !== '' ? backendOffer.bookAuthor.trim() : '';

          return {
            ...backendOffer,
            color: getRandomColor(),
            rotation: getRandomRotation(),
            genre: genre,
            author: author,
            tags: Array.isArray(backendOffer.tags) ? backendOffer.tags.map(tag => tag.trim()).filter(tag => tag !== '') : [],
            datePosted: backendOffer.datePosted || 'N/A',
            condition: backendOffer.condition || 'N/A',
            bookId: backendOffer.bookId
          };
        });

        setAllOffers(processedOffers);

        const uniqueGenresSet = new Set(['All']);
        const uniqueAuthorsSet = new Set(['All']);
        
        processedOffers.forEach(offer => {
          if (offer.genre) {
            uniqueGenresSet.add(offer.genre);
          }
          if (offer.author) {
            uniqueAuthorsSet.add(offer.author);
          }
          offer.tags.forEach(tag => {
            if (tag) {
              uniqueGenresSet.add(tag);
            }
          });
        });

        setUniqueGenres(Array.from(uniqueGenresSet).sort());
        setUniqueAuthors(Array.from(uniqueAuthorsSet).sort());
      } catch (err) {
        setError(`Failed to load anonymous book offers: ${err.message || "An unexpected error occurred."}`);
        setUniqueGenres([]);
        setUniqueAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnonymousOffers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);

    let tempFilteredOffers = allOffers;

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      tempFilteredOffers = tempFilteredOffers.filter(offer =>
        (offer.CustomizedTitle && offer.CustomizedTitle.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.noteContent && offer.noteContent.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchQuery))) ||
        (offer.author && offer.author.toLowerCase().includes(lowerCaseSearchQuery))
      );
    }

    if (genreFilter !== 'All') {
      const lowerCaseGenreFilter = genreFilter.toLowerCase();
      tempFilteredOffers = tempFilteredOffers.filter(offer =>
        (offer.genre && offer.genre.toLowerCase() === lowerCaseGenreFilter) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseGenreFilter)))
      );
    }

    if (authorFilter !== 'All') {
      const lowerCaseAuthorFilter = authorFilter.toLowerCase();
      tempFilteredOffers = tempFilteredOffers.filter(offer =>
        (offer.author && offer.author.toLowerCase() === lowerCaseAuthorFilter)
      );
    }

    setCurrentFilteredOffers(tempFilteredOffers);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setFilteredAndPaginatedOffers(tempFilteredOffers.slice(indexOfFirstItem, indexOfLastItem));

  }, [allOffers, searchQuery, genreFilter, authorFilter, currentPage, itemsPerPage]);

  const currentFilteredCount = currentFilteredOffers.length;
  const totalPagesForFiltered = Math.ceil(currentFilteredCount / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage <  totalPagesForFiltered) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleSurpriseMe = () => {
    if (currentFilteredOffers.length > 0) {
      const randomIndex = Math.floor(Math.random() * currentFilteredOffers.length);
      const randomOffer = currentFilteredOffers[randomIndex];

      if (randomOffer && randomOffer.bookId) {
        navigate(`/dashboard/anonymousbooks/${randomOffer.bookId}`);
      } else {
        console.warn("Selected random offer has no valid bookId:", randomOffer);
        alert("Oops! Couldn't find a valid book ID for the surprise selection from the filtered list. Please try again or adjust your filters.");
      }
    } else {
      alert("No offers available with your current filters to surprise you with! Try adjusting your filters.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#171612]">Loading anonymous book offers...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-full text-red-600">
            <p>{error}</p>
        </div>
    );
  }

   return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#171612] tracking-wide text-[32px] font-bold leading-tight">
          Whispers on the Board
        </h2>
        <button
          onClick={handleSurpriseMe}
          className="flex h-10 shrink-0 items-center justify-center rounded-full bg-[#c2e7a4] px-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#aade85] transition-colors duration-200"
        >
          Surprise Me!
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="genre-select" className="text-[#5B400D] font-semibold text-base">Genre:</label>
          <select
            id="genre-select"
            value={genreFilter}
            onChange={(e) => {
              setGenreFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer"
          >
            <option value="All">All</option>
            {uniqueGenres.filter(g => g !== 'All').map(g => ( 
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="author-select" className="text-[#5B400D] font-semibold text-base">Author:</label>
          <select
            id="author-select"
            value={authorFilter}
            onChange={(e) => {
              setAuthorFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer"
          >
            <option value="All">All</option>
            {uniqueAuthors.filter(a => a !== 'All').map(a => ( 
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {(genreFilter !== 'All' || authorFilter !== 'All') && ( 
          <button
            onClick={() => {
              setGenreFilter('All'); 
              setAuthorFilter('All');
              setCurrentPage(1);
            }}
            className="flex h-10 shrink-0 items-center justify-center rounded-full bg-[#f3ebd2] px-4 text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d8c0] transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#171612]">Loading anonymous book offers...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-600">
          <p>{error}</p>
        </div>
      ) : filteredAndPaginatedOffers.length === 0 ? (
        <p className="text-[#837c67]">No anonymous notes found matching your criteria.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndPaginatedOffers.map(offer => (
              <div
                key={offer.id}
                className={`relative p-6 rounded-lg shadow-lg transition-transform duration-200 ${offer.color} transform ${offer.rotation}
                             hover:scale-105 hover:shadow-xl cursor-pointer`}
                style={{ minHeight: '180px', boxShadow: '5px 5px 15px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)' }}
                onClick={() => onSelectBookOffer(offer.bookId)}
              >
                <h3 className="text-[#171612] text-xl font-bold leading-tight mb-3">
                  {offer.CustomizedTitle || 'Untitled Offer'}
                </h3>
                {offer.author && (
                  <p className="text-[#5B400D] text-sm font-semibold mb-2">
                    by {offer.author}
                  </p>
                )}
                <p className="text-[#171612] text-base leading-normal line-clamp-4 mb-3">
                  {offer.noteContent || 'No description provided.'}
                </p>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-500 rounded-full shadow-inner"></div>
              </div>
            ))}
          </div>

          {totalPagesForFiltered > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-[#171612] font-medium">
                Page {currentPage} of {totalPagesForFiltered}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPagesForFiltered}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnonymousBooksAvailablePage;