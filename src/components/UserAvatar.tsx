import React from 'react';
import { User } from '../types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (username: string) => {
    if (!username) return '??';
    // Take first two characters of username
    return username.slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-100 text-gray-400 font-medium flex items-center justify-center`}
      >
        ??
      </div>
    );
  }

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.username}
        className={`${sizeClasses[size]} rounded-full object-cover`}
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.username
          )}&background=random`;
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-red-100 text-red-600 font-medium flex items-center justify-center`}
    >
      {getInitials(user.username)}
    </div>
  );
}