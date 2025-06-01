import React from 'react';
import { useNavigate } from 'react-router-dom';

// Added onSearchChange and searchQuery props
const Header = ({ username, onLogout, onSearchChange, searchQuery }) => {
  const navigate = useNavigate();

  const handleSearchInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f3f1] px-6 md:px-10 py-3 fixed top-0 left-0 w-full z-50 bg-white">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#171612]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" />
            </svg>
          </div>
          <h2 className="text-[#171612] text-lg font-bold leading-tight tracking-[-0.015em]">ShelfShare</h2>
        </div>
        <div className="hidden md:flex items-center gap-9">
          <a
            className="text-[#171612] text-sm font-medium leading-normal cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Home
          </a>
          <a className="text-[#171612] text-sm font-medium leading-normal" href="#">Notifications</a>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <label className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div
              className="text-[#837c67] flex border-none bg-[#f4f3f1] items-center justify-center pl-4 rounded-l-xl border-r-0"
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
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#171612] focus:outline-0 focus:ring-0 border-none bg-[#f4f3f1] focus:border-none h-full placeholder:text-[#837c67] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchQuery} // Bind value to searchQuery prop
              onChange={handleSearchInputChange} // Add onChange handler
            
            />
          </div>
        </label>
        <div className="flex gap-2">
          {username ? (
            <button
              onClick={onLogout}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Logout</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f3ebd2] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f4f3f1] text-[#171612] text-sm font-bold leading-normal tracking-[0.015em]"
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