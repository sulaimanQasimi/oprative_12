import React from 'react';

const Tabs = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className = '', value, active, onClick, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={() => onClick && onClick(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none
        ${active ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'hover:text-gray-900 dark:hover:text-white'}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className = '', value, activeValue, children, ...props }, ref) => {
  const isActive = value === activeValue;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      className={`mt-2 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
