import React from 'react';

const colors = [
 '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
 '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
 '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
 '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#B71C1C'
];

function generateColor(name) {
 if (!name) return colors[0];
 let sumChars = 0;
 for (let i = 0; i < name.length; i++) {
   sumChars += name.charCodeAt(i);
 }
 return colors[sumChars % colors.length];
}

function getInitials(name) {
 if (!name) return '';
 const parts = name.split(' ').filter(Boolean);
 if (parts.length === 0) return '';
  if (parts.length === 1) {
   return parts[0].charAt(0).toUpperCase();
 }
 return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function UserAvatar({ username, size = 'w-24 h-24' }) {
 const displayUsername = username || 'User';
 const initials = getInitials(displayUsername);
 const bgColor = generateColor(displayUsername);

 return (
   <div
     className={`${size} rounded-full flex items-center justify-center text-white font-bold text-2xl select-none`}
     style={{ backgroundColor: bgColor }}
     title={displayUsername}
   >
     {initials}
   </div>
 );
}

export default UserAvatar;
