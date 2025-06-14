import React from 'react';
// Import icons from react-icons
import { FaUser, FaBookOpen, FaBook } from 'react-icons/fa'; // Example icons from Font Awesome collection
// You can also choose icons from other libraries like IoIcons, MdIcons, etc.
// import { IoBook } from 'react-icons/io5';
// import { MdOutlineLibraryBooks } from 'react-icons/md';


const Sidebar = ({ activeItem, onNavigate, isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <>
      {/* Overlay for mobile menu when open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div
        // Responsive classes:
        // Hidden on mobile by default, shown as a block on medium screens and up
        // When isMobileMenuOpen is true, it becomes fixed and visible on mobile
        className={`
          layout-content-container flex flex-col bg-white shadow-md
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-80 md:shadow-sm
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col justify-between bg-white p-4 overflow-y-auto">
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Profile */}
            <div
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer
                ${activeItem === 'profile' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
              `}
            >
              <div className="text-[#171612]">
                <FaUser size="24px" /> {/* React Icon */}
              </div>
              <p className="text-[#171612] text-sm font-medium leading-normal">Profile</p>
            </div>

            {/* Books Available */}
            <div
              onClick={() => onNavigate('booksAvailable')}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer
                ${activeItem === 'booksAvailable' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
              `}
            >
              <div className="text-[#171612]">
                <FaBookOpen size="24px" /> {/* React Icon */}
              </div>
              <p className="text-[#171612] text-sm font-medium leading-normal">Books Available</p>
            </div>

            {/* Anonymous Books */}
            <div
              onClick={() => onNavigate('anonymousBookOffers')}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer
                ${activeItem === 'anonymousBookOffers' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
              `}
            >
              <div className="text-[#171612]">
                <FaBookOpen size="24px" /> {/* Re-using FaBookOpen, choose a different one if preferred */}
              </div>
              <p className="text-[#171612] text-sm font-medium leading-normal">Anonymous Books</p>
            </div>

            {/* My Shelf */}
            <div
              onClick={() => onNavigate('myShelf')}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer
                ${activeItem === 'myShelf' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
              `}
            >
              <div className="text-[#171612]">
                <FaBook size="24px" /> {/* React Icon */}
              </div>
              <p className="text-[#171612] text-sm font-medium leading-normal">My Shelf</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;