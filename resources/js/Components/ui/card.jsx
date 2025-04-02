import React from "react";

const Card = ({ className, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${className || ""}`}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }) => {
  return <div className={`p-6 ${className || ""}`} {...props} />;
};

const CardTitle = ({ className, ...props }) => {
  return (
    <h3
      className={`text-lg font-medium leading-6 text-gray-900 dark:text-white ${className || ""}`}
      {...props}
    />
  );
};

const CardDescription = ({ className, ...props }) => {
  return (
    <p
      className={`text-sm text-gray-500 dark:text-gray-400 ${className || ""}`}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }) => {
  return <div className={`p-6 pt-0 ${className || ""}`} {...props} />;
};

const CardFooter = ({ className, ...props }) => {
  return (
    <div
      className={`p-6 pt-0 border-t border-gray-200 dark:border-gray-800 ${className || ""}`}
      {...props}
    />
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
