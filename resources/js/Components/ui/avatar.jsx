import React from "react";

const Avatar = ({ className, ...props }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
      {...props}
    />
  );
};

const AvatarImage = ({ className, src, alt = "", ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className || ""}`}
      {...props}
    />
  );
};

const AvatarFallback = ({ className, ...props }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${className || ""}`}
      {...props}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
