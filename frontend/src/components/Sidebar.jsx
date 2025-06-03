// src/Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeItem, onNavigate }) => {
  return (

    <div
      className="layout-content-container flex flex-col w-80 bg-white shadow-sm md:shadow-md"
    >
      <div className="flex h-full flex-col justify-between bg-white p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer
              ${activeItem === 'profile' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
            `}
          >
            <div className="text-[#171612]" data-icon="User" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </div>
            <p className="text-[#171612] text-sm font-medium leading-normal">Profile</p>
          </div>
          <div
            onClick={() => onNavigate('booksAvailable')}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer
              ${activeItem === 'booksAvailable' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
            `}
          >
            <div className="text-[#171612]" data-icon="BookOpen" data-size="24px" data-weight="fill">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,64V192a16,16,0,0,1-16,16H160a24,24,0,0,0-24,24,8,8,0,0,1-16,0,24,24,0,0,0-24-24H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48H88a32,32,0,0,1,32,32v88a8,8,0,0,0,16,0V80a32,32,0,0,1,32-32h56A16,16,0,0,1,240,64Z"></path>
              </svg>
            </div>
            <p className="text-[#171612] text-sm font-medium leading-normal">Books Available</p>
          </div>
          <div
            onClick={() => onNavigate('anonymousBookOffers')}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer
              ${activeItem === 'anonymousBookOffers' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
            `}
          >
            <div className="text-[#171612]" data-icon="BookOpen" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"></path>
              </svg>
            </div>
            <p className="text-[#171612] text-sm font-medium leading-normal">Anonymous Books</p>
          </div>
          <div
            onClick={() => onNavigate('myShelf')}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer
              ${activeItem === 'myShelf' ? 'rounded-full bg-[#f4f3f1]' : 'hover:rounded-full hover:bg-[#f4f3f1]'}
            `}
          >
            <div className="text-[#171612]" data-icon="Book" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z"></path>
              </svg>
            </div>
            <p className="text-[#171612] text-sm font-medium leading-normal">My Shelf</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;