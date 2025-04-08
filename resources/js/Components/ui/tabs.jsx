import React from 'react';

const Tabs = React.forwardRef(({ className = '', children, value, onValueChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`w-full ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child, {
              activeValue: value,
              onValueChange
            });
          }
          return child;
        }
        return child;
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className = '', children, activeValue, onValueChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            active: child.props.value === activeValue,
            onValueChange
          });
        }
        return child;
      })}
    </div>
  );
});

TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className = '', value, active, onValueChange, children, ...props }, ref) => {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
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
