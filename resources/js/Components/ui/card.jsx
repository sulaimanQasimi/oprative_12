import React, { forwardRef } from "react";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${className || ""}`}
      {...props}
    />
  );
});

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`p-6 ${className || ""}`} {...props} />;
});

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-lg font-medium leading-6 text-gray-900 dark:text-white ${className || ""}`}
      {...props}
    />
  );
});

const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-gray-500 dark:text-gray-400 ${className || ""}`}
      {...props}
    />
  );
});

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />;
});

const CardFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 pt-0 border-t border-gray-200 dark:border-gray-800 ${className || ""}`}
      {...props}
    />
  );
});

// Add display names for better debugging
Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
