import React from 'react';
import { useNavigate } from 'react-router-dom';
// Optional: Import an icon for the hamburger menu if not already in Navbar
import { FaBars } from 'react-icons/fa'; // Assuming you have react-icons installed

// Added onSearchChange, searchQuery, and toggleMobileMenu props
const Header = ({ username, onLogout, onSearchChange, searchQuery, toggleMobileMenu }) => {
  const navigate = useNavigate();

  const handleSearchInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f3f1] px-4 md:px-10 py-3 fixed top-0 left-0 w-full z-50 bg-white">
      {/* Left section: Logo and Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Mobile Menu Toggle (Hamburger Icon) - visible only on small screens */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <FaBars size="24px" /> {/* Hamburger Icon */}
          </button>
        </div>

        {/* ShelfShare Logo */}
        <div className="flex items-center gap-2 text-[#171612]"> {/* Reduced gap for mobile */}
          <div className="size-4 md:size-6"> {/* Adjusted size for responsiveness */}
            <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" />
            </svg>
          </div>
          <h2 className="text-[#171612] text-base md:text-lg font-bold leading-tight tracking-[-0.015em]">ShelfShare</h2> {/* Adjusted text size */}
        </div>

        {/* Desktop Navigation Links - hidden on small screens */}
        <div className="hidden md:flex items-center gap-9">
          <a
            className="text-[#171612] text-sm font-medium leading-normal cursor-pointer hover:text-yellow-600 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Home
          </a>
          <a className="text-[#171612] text-sm font-medium leading-normal hover:text-yellow-600 transition-colors" href="#">Notifications</a>
        </div>
      </div>

      {/* Right section: Search bar and Auth buttons */}
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-8"> {/* Adjusted gap for mobile */}
        {/* Search Bar */}
        <label className="flex flex-col min-w-0 flex-grow max-w-40 md:max-w-64 !h-10"> {/* min-w-0 and flex-grow to allow shrinking */}
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div
              className="text-[#837c67] flex border-none bg-[#f4f3f1] items-center justify-center pl-2 md:pl-4 rounded-l-xl border-r-0" // Reduced padding for mobile
              data-icon="MagnifyingGlass"
              data-size="24px"
              data-weight="regular"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#171612] focus:outline-0 focus:ring-0 border-none bg-[#f4f3f1] focus:border-none h-full placeholder:text-[#837c67] px-2 md:px-4 rounded-l-none border-l-0 pl-1 text-sm md:text-base font-normal leading-normal" // Reduced padding and text size
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </label>
        {/* Auth Buttons */}
        <div className="flex gap-1 md:gap-2"> {/* Reduced gap for mobile */}
          {username ? (
            <button
              onClick={onLogout}
              className="flex min-w-[70px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 md:h-10 px-3 md:px-4 bg-[#f3ebd2] text-[#171612] text-xs md:text-sm font-bold leading-normal tracking-[0.015em]" // Adjusted height, padding, and text size
            >
              <span className="truncate">Logout</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex min-w-[70px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 md:h-10 px-3 md:px-4 bg-[#f3ebd2] text-[#171612] text-xs md:text-sm font-bold leading-normal tracking-[0.015em]" // Hidden on small phone, visible on sm and up
              >
                <span className="truncate">Login</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex min-w-[70px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 md:h-10 px-3 md:px-4 bg-[#f4f3f1] text-[#171612] text-xs md:text-sm font-bold leading-normal tracking-[0.015em]" // Adjusted height, padding, and text size
              >
                <span className="truncate">Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;