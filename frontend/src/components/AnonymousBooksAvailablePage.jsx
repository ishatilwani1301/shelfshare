import React, { useEffect, useState } from 'react';

const AnonymousBooksAvailablePage = ({ searchQuery, onSelectBookOffer }) => {
  const [allOffers, setAllOffers] = useState([]); 
  const [filteredAndPaginatedOffers, setFilteredAndPaginatedOffers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  
  const [uniqueLocations, setUniqueLocations] = useState(['All']);
  const [uniqueGenres, setUniqueGenres] = useState(['All']);
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

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


  // //Mock data for now
  // const allMockOffers = [
  //   {
  //     id: 'abo1',
  //     title: 'The Alchemist',
  //     description: 'A beautiful copy of Paulo Coelho\'s "The Alchemist". Read it last year, really resonated with me. Explores themes of destiny and following dreams. Highly recommended for introspective readers.',
  //     tags: ['Fiction', 'Spiritual', 'Self-help'],
  //     condition: 'Good',
  //     anonymousAuthor: 'Anonymous Seeker',
  //     datePosted: '2024-05-15',
  //     location: 'Bengaluru',
  //     genre: 'Fiction',
  //   },
  //   {
  //     id: 'abo2',
  //     title: 'Sapiens: A Brief History',
  //     description: 'Yuval Noah Harari\'s "Sapiens". Mind-blowing read, but I need to clear some shelf space. This book completely reshaped my understanding of human history.',
  //     tags: ['Non-fiction', 'History', 'Science'],
  //     condition: 'Very Good',
  //     anonymousAuthor: 'Anonymous Historian',
  //     datePosted: '2024-05-20',
  //     location: 'Delhi',
  //     genre: 'Non-fiction',
  //   },
  //   {
  //     id: 'abo3',
  //     title: 'Dune (First Book)',
  //     description: 'First book in the classic sci-fi series. Great condition. Offering it to someone who loves epic world-building. Must-read for any science fiction fan.',
  //     tags: ['Science Fiction', 'Fantasy', 'Classic'],
  //     condition: 'Good',
  //     anonymousAuthor: 'Anonymous Arrakis Fan',
  //     datePosted: '2024-05-22',
  //     location: 'Mumbai',
  //     genre: 'Science Fiction',
  //   },
  //   {
  //     id: 'abo4',
  //     title: 'Milk and Honey Collection',
  //     description: 'Poetry collection by Rupi Kaur. A very raw and emotional collection. Gently used, hoping it can inspire someone else. Explores themes of abuse, love, loss, and femininity.',
  //     tags: ['Poetry', 'Modern', 'Feminism'],
  //     condition: 'Fair',
  //     anonymousAuthor: 'Anonymous Poet',
  //     datePosted: '2024-05-25',
  //     location: 'Bengaluru',
  //     genre: 'Poetry',
  //   },
  //   {
  //     id: 'abo5',
  //     title: 'Educated: A Memoir',
  //     description: 'Tara Westover\'s memoir. An incredible story of resilience and self-invention. A compelling and inspiring read.',
  //     tags: ['Memoir', 'Biography', 'Non-fiction'],
  //     condition: 'Very Good',
  //     anonymousAuthor: 'Anonymous Scholar',
  //     datePosted: '2024-05-28',
  //     location: 'Chennai',
  //     genre: 'Non-fiction',
  //   },
  //   {
  //     id: 'abo6',
  //     title: 'The Midnight Library',
  //     description: 'A thought-provoking novel by Matt Haig about choices and parallel lives. Highly engaging and a quick read.',
  //     tags: ['Fiction', 'Fantasy', 'Philosophical'],
  //     condition: 'Excellent',
  //     anonymousAuthor: 'Anonymous Dreamer',
  //     datePosted: '2024-05-30',
  //     location: 'Bengaluru',
  //     genre: 'Fiction',
  //   },
  //   {
  //     id: 'abo7',
  //     title: 'Becoming by Michelle Obama',
  //     description: 'Michelle Obama\'s autobiography. An inspiring and candid look into her life, struggles, and triumphs. Great for motivation.',
  //     tags: ['Memoir', 'Biography', 'Inspirational'],
  //     condition: 'Good',
  //     anonymousAuthor: 'Anonymous Leader',
  //     datePosted: '2024-06-01',
  //     location: 'Delhi',
  //     genre: 'Non-fiction',
  //   },
  //   {
  //     id: 'abo8',
  //     title: '1984 by George Orwell',
  //     description: 'A dystopian social science fiction novel. A classic that makes you think about society and control.',
  //     tags: ['Dystopian', 'Classic', 'Fiction'],
  //     condition: 'Good',
  //     anonymousAuthor: 'Anonymous Thinker',
  //     datePosted: '2024-06-05',
  //     location: 'Hyderabad',
  //     genre: 'Fiction',
  //   },
  //   {
  //     id: 'abo9',
  //     title: 'Atomic Habits',
  //     description: 'An easy and proven way to build good habits & break bad ones. Very practical advice.',
  //     tags: ['Self-help', 'Productivity'],
  //     condition: 'Very Good',
  //     anonymousAuthor: 'Anonymous Achiever',
  //     datePosted: '2024-06-08',
  //     location: 'Bengaluru',
  //     genre: 'Non-fiction',
  //   },
  //   {
  //     id: 'abo10',
  //     title: 'The Great Gatsby',
  //     description: 'F. Scott Fitzgerald\'s timeless novel. A poignant story about the American Dream, wealth, and longing.',
  //     tags: ['Classic', 'Fiction', 'Romance'],
  //     condition: 'Fair',
  //     anonymousAuthor: 'Anonymous Dreamer',
  //     datePosted: '2024-06-10',
  //     location: 'Mumbai',
  //     genre: 'Fiction',
  //   }
  // ].map(offer => ({ 
  //   ...offer,
  //   color: getRandomColor(),
  //   rotation: getRandomRotation(),
  // }));

  
  // const uniqueLocations = ['All', ...new Set(allMockOffers.map(offer => offer.location))].sort();
  // const uniqueGenres = ['All', ...new Set(allMockOffers.map(offer => offer.genre))].sort();

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
          return {
            ...backendOffer,
            color: getRandomColor(),
            rotation: getRandomRotation(),
            location: 'Bengaluru',
            genre: 'Various',
            tags: [],
            datePosted: 'N/A',
            condition: 'N/A',
          };
        });

        setAllOffers(processedOffers);

        const fetchedLocations = new Set(['All']);
        const fetchedGenres = new Set(['All']);
        processedOffers.forEach(offer => {
            if (offer.location && offer.location !== 'N/A') fetchedLocations.add(offer.location);
            if (offer.genre && offer.genre !== 'N/A') fetchedGenres.add(offer.genre);
            offer.tags.forEach(tag => fetchedGenres.add(tag));
        });
        setUniqueLocations(Array.from(fetchedLocations).sort());
        setUniqueGenres(Array.from(fetchedGenres).sort());

      } catch (err) {
        setError(`Failed to load anonymous book offers: ${err.message || "An unexpected error occurred."}`);
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
        (offer.currentOwnerName && offer.currentOwnerName.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchQuery)))
      );
    }

    if (locationFilter !== 'All') {
      const lowerCaseLocationFilter = locationFilter.toLowerCase();
      tempFilteredOffers = tempFilteredOffers.filter(offer =>
        (offer.location && offer.location.toLowerCase() === lowerCaseLocationFilter)
      );
    }

    if (genreFilter !== 'All') {
      const lowerCaseGenreFilter = genreFilter.toLowerCase();
      tempFilteredOffers = tempFilteredOffers.filter(offer =>
        (offer.genre && offer.genre.toLowerCase() === lowerCaseGenreFilter) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseGenreFilter)))
      );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setFilteredAndPaginatedOffers(tempFilteredOffers.slice(indexOfFirstItem, indexOfLastItem));

  }, [allOffers, searchQuery, locationFilter, genreFilter, currentPage, itemsPerPage]);

  const currentFilteredCount = allOffers.filter(offer => {
      const lowerCaseSearchQuery = searchQuery ? searchQuery.toLowerCase() : '';
      const lowerCaseLocationFilter = locationFilter === 'All' ? '' : locationFilter.toLowerCase();
      const lowerCaseGenreFilter = genreFilter === 'All' ? '' : genreFilter.toLowerCase();

      const matchesSearch = !searchQuery ||
        (offer.CustomizedTitle && offer.CustomizedTitle.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.noteContent && offer.noteContent.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.currentOwnerName && offer.currentOwnerName.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchQuery)));

      const matchesLocation = locationFilter === 'All' || (offer.location && offer.location.toLowerCase() === lowerCaseLocationFilter);
      const matchesGenre = genreFilter === 'All' || (offer.genre && offer.genre.toLowerCase() === lowerCaseGenreFilter) ||
                           (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(lowerCaseGenreFilter)));

      return matchesSearch && matchesLocation && matchesGenre;
  }).length;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#171612]">Loading anonymous book offers...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-[#171612] tracking-wide text-[32px] font-bold leading-tight mb-6">
        Whispers on the Board
      </h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label htmlFor="location-filter" className="text-[#171612] text-sm font-medium">Location:</label>
        <select
          id="location-filter"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-2 rounded-full bg-[#f4f3f1] text-[#171612] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] cursor-pointer"
        >
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <label htmlFor="genre-filter" className="text-[#171612] text-sm font-medium">Genre:</label>
        <select
          id="genre-filter"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-3 py-2 rounded-full bg-[#f4f3f1] text-[#171612] focus:outline-none focus:ring-2 focus:ring-[#f3ebd2] cursor-pointer"
        >
          {uniqueGenres.map(genre => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {filteredAndPaginatedOffers.length === 0  ? (
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
                <p className="text-[#171612] text-base leading-normal line-clamp-4 mb-3">
                  {offer.noteContent || 'No description provided.'} {/* Added fallback for robustness */}
                </p>
                {offer.currentOwnerName && (
                    <p className="text-[#837c67] text-sm italic">
                        By {offer.currentOwnerName}
                    </p>
                )}
                
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
                disabled={currentPage === totalPages}
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