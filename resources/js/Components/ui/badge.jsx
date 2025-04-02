import React from 'react';

const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const variantClasses = {
    default: 'bg-purple-600 text-white',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    destructive: 'bg-red-600 text-white',
    outline: 'text-gray-800 border border-gray-200 dark:text-gray-300 dark:border-gray-700',
  };

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

export { Badge };
