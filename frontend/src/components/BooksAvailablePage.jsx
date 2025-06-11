import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const BooksAvailablePage = ({ searchQuery }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);


  const [availableAreas, setAvailableAreas] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const [stateCityAreaMap, setStateCityAreaMap] = useState({});

  // Define a set of Tailwind colors for different card backgrounds
  const cardColors = [
    'bg-[#fbe8e4]', // Light Coral/Peach - warm, inviting
    'bg-[#e2f0cb]', // Soft Mint Green - fresh, calming
    'bg-[#d2eaf7]', // Sky Blue - light, airy
    'bg-[#fff0b3]', // Pale Gold/Cream - bright, cheerful
    'bg-[#e6d8ed]', // Lavender Mist - soft, ethereal
    'bg-[#c8e6c9]', // Light Sage Green - earthy, sophisticated
    'bg-[#b3e5fc]', // Light Cyan - cool, crisp
    'bg-[#ffe0b2]', // Apricot - sunny, warm
    'bg-[#efdcd5]', // Dusty Rose - gentle, vintage
    'bg-[#d1c4e9]', // Muted Violet - soft, unique
  ];

  useEffect(() => {
    const fetchInitialFilterData = async () => {
      try {
        const response = await fetch('http://localhost:1234/books');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const uniqueGenres = new Set();
        const uniqueAuthors = new Set();
        const map = {}; 

        data.forEach(book => {
          if (book.bookGenre && book.bookGenre.trim() !== '') {
            uniqueGenres.add(book.bookGenre.trim());
          }
          if (book.authorName && book.authorName.trim() !== '') {
            uniqueAuthors.add(book.authorName.trim());
          }

          const state = book.userState?.trim();
          const city = book.userCity?.trim();
          const area = book.userArea?.trim();

          if (state) {
            if (!map[state]) {
              map[state] = {};
            }
            if (city) {
              if (!map[state][city]) {
                map[state][city] = new Set();
              }
              if (area) {
                map[state][city].add(area);
              }
            }
          }
        });

        setGenres(Array.from(uniqueGenres).sort());
        setAuthors(Array.from(uniqueAuthors).sort());
        setAvailableStates(Object.keys(map).sort());
        setStateCityAreaMap(map);

      } catch (e) {
        console.error("Failed to fetch initial data for filters:", e);
        setError("Failed to load filter options.");
      }
    };

    fetchInitialFilterData();
  }, []); 
  useEffect(() => {
    if (selectedState && stateCityAreaMap[selectedState]) {
      const citiesForState = Object.keys(stateCityAreaMap[selectedState]).sort();
      setAvailableCities(citiesForState);
      setSelectedCity('');
      setSelectedArea('');
    } else {
      setAvailableCities([]);
      setAvailableAreas([]);
      setSelectedCity('');
      setSelectedArea('');
    }
  }, [selectedState, stateCityAreaMap]);

 
  useEffect(() => {
    if (selectedState && selectedCity && stateCityAreaMap[selectedState]?.[selectedCity]) {
      const areasForCity = Array.from(stateCityAreaMap[selectedState][selectedCity]).sort();
      setAvailableAreas(areasForCity);
      setSelectedArea('');
    } else {
      setAvailableAreas([]);
      setSelectedArea('');
    }
  }, [selectedState, selectedCity, stateCityAreaMap]);


  const fetchAndFilterBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:1234/books');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allBooks = await response.json();

      const filteredBooks = allBooks.filter(book => {
        const bookTitle = book.bookTitle || '';
        const authorName = book.authorName || '';
        const bookGenre = book.bookGenre || '';
        const userState = book.userState || '';
        const userCity = book.userCity || '';
        const userArea = book.userArea || '';

        const matchesSearch =
          !searchQuery ||
          bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          authorName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGenre = !selectedGenre || bookGenre.toLowerCase() === selectedGenre.toLowerCase();

        const matchesAuthor = !selectedAuthor || authorName.toLowerCase() === selectedAuthor.toLowerCase();

        let matchesLocation = true; 

        if (selectedState) {
          matchesLocation = matchesLocation && userState.toLowerCase() === selectedState.toLowerCase();
          if (selectedCity) {
            matchesLocation = matchesLocation && userCity.toLowerCase() === selectedCity.toLowerCase();
            if (selectedArea) {
              matchesLocation = matchesLocation && userArea.toLowerCase() === selectedArea.toLowerCase();
            }
          }
        }

        return matchesSearch && matchesGenre && matchesAuthor && matchesLocation;
      });

      setBooks(filteredBooks); 

    } catch (e) {
      console.error("Failed to fetch or filter books:", e);
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, selectedAuthor, selectedState, selectedCity, selectedArea]); 

  
  useEffect(() => {
    fetchAndFilterBooks();
  }, [fetchAndFilterBooks]); 
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedAuthor('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedArea('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#837c67]">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#171612] mb-6">Available Books</h1>

      {(selectedGenre || selectedAuthor || selectedState || selectedCity || selectedArea) && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClearFilters}
            className="flex h-11 shrink-0 items-center justify-center rounded-md bg-[#f3ebd2] pl-4 pr-4 text-[#5B400D] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d8c0] transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4 mb-4">
        {/* State Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-select" className="text-[#5B400D] font-semibold text-base">State:</label>
          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer w-40"
          >
            <option value="">All</option>
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="city-select" className="text-[#5B400D] font-semibold text-base">City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer w-40"
            disabled={!selectedState || availableCities.length === 0}
          >
            <option value="">All</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="area-select" className="text-[#5B400D] font-semibold text-base">Area:</label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={handleAreaChange}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer w-40"
            disabled={!selectedCity || availableAreas.length === 0}
          >
            <option value="">All</option>
            {availableAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="author-select" className="text-[#5B400D] font-semibold text-base">Author:</label>
          <select
            id="author-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer"
          >
            <option value="">All</option>
            {authors.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="genre-select" className="text-[#5B400D] font-semibold text-base">Genre:</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer"
          >
            <option value="">All</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.length > 0 ? (
          books.map((book, index) => (
            <Link
              key={book.id}
              to={`/dashboard/books/${book.id}`}
              className={`flex flex-col gap-2 pb-3 group cursor-pointer border rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${cardColors[index % cardColors.length]}`}
            >
              <div>
                <p className="text-[#171612] text-base font-bold leading-normal group-hover:text-[#5B400D] transition-colors duration-200">{book.bookTitle || 'Untitled Book'}</p>
                <p className="text-[#837c67] text-sm font-bold leading-normal">{book.authorName || 'Unknown Author'}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-[#837c67] col-span-full text-center py-8">No books found matching your search and filters.</p>
        )}
      </div>
    </div>
  );
};

export default BooksAvailablePage;