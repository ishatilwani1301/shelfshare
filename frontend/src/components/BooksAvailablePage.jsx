import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BooksAvailablePage = ({ searchQuery }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [genres, setGenres] = useState([]);
  const [locations, setLocations] = useState([]);
  const [authors, setAuthors] = useState([]);


  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

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
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:1234/books');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);

        const uniqueGenres = new Set();
        const uniqueLocations = new Set();
        const uniqueAuthors = new Set();

        data.forEach(book => {
          if (book.bookGenre && book.bookGenre.trim() !== '') {
            uniqueGenres.add(book.bookGenre.trim());
          }

          if (book.location && book.location.trim() !== '') {
            uniqueLocations.add(book.location.trim());
          }
         
          if (book.authorName && book.authorName.trim() !== '') {
            uniqueAuthors.add(book.authorName.trim());
          }
        });

        setGenres(Array.from(uniqueGenres).sort());
        setLocations(Array.from(uniqueLocations).sort());
        setAuthors(Array.from(uniqueAuthors).sort());

      } catch (e) {
        console.error("Failed to fetch books:", e);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    const bookTitle = book.bookTitle || '';
    const authorName = book.authorName || '';
    const bookGenre = book.bookGenre || '';
    const location = book.location || '';

    const matchesSearch =
      searchQuery === '' ||
      bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === '' || bookGenre.toLowerCase() === selectedGenre.toLowerCase();

    const matchesLocation =
      selectedLocation === '' || location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesAuthor =
      selectedAuthor === '' || authorName.toLowerCase() === selectedAuthor.toLowerCase();


    return matchesSearch && matchesGenre && matchesLocation && matchesAuthor;
  });

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

      <div className="flex flex-wrap items-end gap-4 mb-6">
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
          <label htmlFor="location-select" className="text-[#5B400D] font-semibold text-base">Location:</label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-3 border border-[#d8c3a5] rounded-full bg-white text-[#171612] text-base focus:outline-none focus:ring-2 focus:ring-[#f8e0a1] cursor-pointer"
          >
            <option value="">All</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>


        {/* Clear Filters Button */}
        {(selectedGenre || selectedLocation || selectedAuthor) && (
          <button
            onClick={() => {
              setSelectedGenre('');
              setSelectedLocation('');
              setSelectedAuthor('');
            }}
            className="flex h-11 shrink-0 items-center justify-center rounded-md bg-[#f3ebd2] pl-4 pr-4 text-[#5B400D] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#e0d8c0] transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <Link
              key={book.id}
              to={`/dashboard/books/${book.id}`}
              className={`flex flex-col gap-2 pb-3 group cursor-pointer border rounded-lg p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${cardColors[index % cardColors.length]}`}
            >
              <div>
                <p className="text-[#171612] text-base font-bold leading-normal group-hover:text-[#5B400D] transition-colors duration-200">{book.bookTitle || 'Untitled Book'}</p>
                <p className="text-[#837c67] text-sm font-bold leading-normal">{book.authorName || 'Unknown Author'}</p>
                {book.location && <p className="text-[#837c67] text-xs leading-normal">Location: {book.location}</p>}
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