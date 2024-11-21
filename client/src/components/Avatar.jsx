import React from 'react';

const Avatar = ({ name, size = 'md' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div className={`avatar placeholder ${size === 'sm' ? 'avatar-sm' : ''}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center`}>
        <span className="font-bold text-white">
          {getInitials(name)}
        </span>
      </div>
    </div>
  );
};

export default Avatar; 