import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Hardcoded book data - We're putting this back in for now!
const dummyBooks = [
  { id: 1, title: 'The Secret Garden', author: 'Frances Hodgson Burnett', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFppiKXKAnz-Qd6vCmGfpqcmXjbXlrCSyk2NY5spXZSkU2y72pScWmF-3tbWr-RhOzRzrGp-x4yTlQJ2IObaWYLdM0Bl0GxIrCQSWMznBcdqzESmR4aUWst3T39Sr33qFn5FmYkGkkow41FTDDwHd9b66N7CBwkdOOUMMx6AwAL53aygyiACkPUIkLCzCGbOLUHu64jcvgT2FwWQWRs4qy9QeFDRd487UvAxOC_1-idyyr2eZBkHLHdur1GW2lG1Tk9FMZUrHOrDc', description: 'A classic novel about a young orphan who discovers a hidden garden and brings it back to life.' },
  { id: 2, title: 'Pride and Prejudice', author: 'Clara Bennett', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA997Zq4W2sjuomcsC7KOW6eFjChbs2CPxkWJqsKyH2VewaU_qxxACEOtaH76bOPYGkhS-YJETp1sn5LFD81LxRmCa2ClNYpwuWhiP_TbZ4NBqMGCvpV_9igT12beUvOz97OzEdCkwR8Mn3uEn-w6B__cN5UQzd_7IkGFYr18K4NNQiFk7eyYzJMwbi_YJU6FJSV6QHjjNNdW4OwR2iaU7XpuW7ZadieDzQxf2k2xRPWA46ZA-FlQOBsyQIxAPcDq2fL_jE0yvd69I', description: 'A romantic novel of manners written by Jane Austen in 1813.' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiDVQToy4LDRuINckyZ6HSGbpM5YCiqy_jwmgMzHNT_pR8fiGGL11c9Hy4qQcYyAKYKWWHxBcuxPFNRmNdVnoqKMeuAs1iph9Mq44qFiGZR1VgdYBDfidoOt_4qPeKXzNm_OvH30ynBwtM4FzeQ3wn_zNJOQi7pbfMpC0HI4SOTGtxLdkebj7RMuA7WhfSlrBuaDSfoZ2kCpP4Shfw-q-GBU6Nwp3e3VbFBSNLmH5A2CGwrYugucspeoWL5ECfehUV0ravkN0ee3M', description: 'A novel by Harper Lee published in 1960. It was instantly successful, winning the Pulitzer Prize, and has become a classic of modern American literature.' },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvUGhhmJmhI_dxGo87pkUkpi_A8ghYGaa6p_H0w8ssO6I2EFJwdJmis8ez2LvPVWMSUAol4isKKkkwu8Hvssf7y2C7ZGPi1yLFFUAFj4YdzUUu384c8pVN6ppMpzFKIAO2HkVmrmVqJsdVT2ja2H_-UAbOhe3q7pmA4CZYx11AWPvDpFg0CH4bYPxJJDGu2ewU4TqfplHi9UH7Rtsx09lFpThJ-0DqORj0vQU06mVDK2N1wuBd110cc7wwpeRM53W4ALIrGfZkAk0', description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times remarked "gin was the national drink and sex the national obsession."' },
  { id: 5, title: '1984', author: 'George Orwell', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb_vq7KzgYSIB3Ekiox8EoBzfqOk88-dCOBheuBew_gtwuXLVL5Atcourh2E0YPV_DjYlMoppIAND8MtZJAfCXJ9T2RTfgcPsLYG8QqXwIEgTptU0i425QmdT1ZPki_6CuAcy3mTeZsj_h8k4J35zl9JkbrWg4g5Yz0aYFIi73qAfEU0mztm_zrFVWv1GW0-iarJfQMazaamBl2DcRJJKWUHDAHRnWJJaEFmSaS3tQj6GrAEHe2kT1Y40gcAyecO81pA0vNAzhwVk', description: 'A dystopian social science fiction novel and cautionary tale by English author George Orwell. It was published on 8 June 1949.' },
  { id: 6, title: 'The Catcher in the Rye', author: 'J.D. Salinger', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk9v3H5xRwhxUaMBhotDNxxgFBkrPHXA8eEOGbwzUvVZvIr5AtfVBQD3tRF4g6aEjQxWltmbQYIJZJFRRO66EdiPuVMz0AbHOVyh609FxhiS19srmcSGKqvCbf0EBGbEjJPpM-ZQt8sxeZIC1rtMInLp85rOopXckCtX_WPiju2S1joCuYi-6eE77q8iHO4T5seRUSSIvMtTuXJDoZ3p12mZg7tO4fYFt9yTkp9HSzBov4hwqH21Q0nb00RdJj74PSbRQnF0k1bcY', description: 'A novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951.' },
  { id: 7, title: 'Brave New World', author: 'Aldous Huxley', imageUrl: 'https://m.media-amazon.com/images/I/41xR7r82t9L._SY445_SX342_.jpg', description: 'A dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932.' },
  { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien', imageUrl: 'https://m.media-amazon.com/images/I/419dE-SjDUL._SY445_SX342_.jpg', description: 'A fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim.' },
  { id: 9, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', imageUrl: 'https://m.media-amazon.com/images/I/51wB7-O9LFL._SY445_SX342_.jpg', description: 'An epic high-fantasy novel by the English author and scholar J. R. R. Tolkien. Set in Middle-earth, the story began as a sequel to Tolkien\'s 1937 children\'s fantasy novel The Hobbit, but eventually developed into a much larger work.' },
  { id: 10, title: 'Dune', author: 'Frank Herbert', imageUrl: 'https://m.media-amazon.com/images/I/41yXwT3D40L._SY445_SX342_.jpg', description: 'A 1965 science fiction novel by American author Frank Herbert. It is the first in the Dune saga, and is often considered one of the greatest science fiction novels of all time.' },
  { id: 11, title: 'Foundation', author: 'Isaac Asimov', imageUrl: 'https://m.media-amazon.com/images/I/51+u8y4V6EL._SY445_SX342_.jpg', description: 'A science fiction novel by Isaac Asimov, first published in 1951. It is the first of seven books in the Foundation series.' },
  { id: 12, title: 'Neuromancer', author: 'William Gibson', imageUrl: 'https://m.media-amazon.com/images/I/51M3f2T0iOL._SY445_SX342_.jpg', description: 'A 1984 science fiction novel by American-Canadian writer William Gibson. It is considered one of the earliest and best-known works in the cyberpunk genre.' },
  { id: 13, title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', imageUrl: 'https://m.media-amazon.com/images/I/51wG3u3uYOL._SY445_SX342_.jpg', description: 'A satirical anti-war novel by Kurt Vonnegut, first published in 1969.' },
  { id: 14, title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', imageUrl: 'https://m.media-amazon.com/images/I/51I7s3tXyRL._SY445_SX342_.jpg', description: 'A comedy science fiction series created by Douglas Adams.' },
  { id: 15, title: 'Fahrenheit 451', author: 'Ray Bradbury', imageUrl: 'https://m.media-amazon.com/images/I/41J7L8+YfSL._SY445_SX342_.jpg', description: 'A dystopian novel by American writer Ray Bradbury, published in 1953.' },
  { id: 16, title: 'The Chronicles of Narnia', author: 'C.S. Lewis', imageUrl: 'https://m.media-amazon.com/images/I/51Y971L27OL._SY445_SX342_.jpg', description: 'A series of seven fantasy novels by C. S. Lewis.' },
  { id: 17, title: 'Catch-22', author: 'Joseph Heller', imageUrl: 'https://m.media-amazon.com/images/I/51+qPz9mHcL._SY445_SX342_.jpg', description: 'A satirical war novel by American author Joseph Heller.' },
  { id: 18, title: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez', imageUrl: 'https://m.media-amazon.com/images/I/51H57CjSjjL._SY445_SX342_.jpg', description: 'A landmark novel by Colombian author Gabriel García Márquez that tells the story of the Buendía family.' },
];


const BooksAvailablePage = ({ searchQuery, activeSidebarItem }) => {
  // Directly use dummyBooks for filtering since no backend is present
  const books = dummyBooks; // No fetch needed, so no loading/error states for this component

  // Filter books based on the search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Removed loading and error conditions as data is local

  return (
    <>
      <h2 className="text-[#171612] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
        {activeSidebarItem === 'myShelf' ? 'My Bookshelf' : (activeSidebarItem === 'anonymousBooks' ? 'Anonymous Shares' : 'Explore Books')}
      </h2>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f4f3f1] pl-4 pr-2">
          <p className="text-[#171612] text-sm font-medium leading-normal">Genre</p>
          <div className="text-[#171612]" data-icon="CaretDown" data-size="20px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        </button>
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f4f3f1] pl-4 pr-2">
          <p className="text-[#171612] text-sm font-medium leading-normal">Location</p>
          <div className="text-[#171612]" data-icon="CaretDown" data-size="20px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        </button>
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f4f3f1] pl-4 pr-2">
          <p className="text-[#171612] text-sm font-medium leading-normal">Sort</p>
          <div className="text-[#171612]" data-icon="CaretDown" data-size="20px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="flex flex-col gap-3 pb-3 group cursor-pointer">
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl shadow-md transition-shadow duration-200 group-hover:shadow-lg"
                style={{ backgroundImage: `url("${book.imageUrl}")` }}
              ></div>
              <div>
                <p className="text-[#171612] text-base font-medium leading-normal group-hover:text-[#5B400D] transition-colors duration-200">{book.title}</p>
                <p className="text-[#837c67] text-sm font-normal leading-normal">{book.author}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-[#837c67] col-span-full text-center py-8">No books found matching your search.</p>
        )}
      </div>
    </>
  );
};

export default BooksAvailablePage;