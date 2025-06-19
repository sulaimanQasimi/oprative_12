import React from "react";
import { Slot } from "@radix-ui/react-slot";

const Button = ({
  className,
  variant = "default",
  size = "default",
  asChild,
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-600",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-600",
    outline: "border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
    link: "bg-transparent underline-offset-4 hover:underline text-gray-900 dark:text-gray-100 focus-visible:ring-gray-400",
  };

  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className || ""}`}
      {...props}
    >
      {children}
    </Comp>
  );
};

export { Button };
