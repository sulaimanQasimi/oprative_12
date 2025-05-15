import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
    </div>
  );
};

const DialogContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full max-w-lg gap-4 border border-slate-200 bg-white p-6 shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0 md:w-full dark:border-slate-800 dark:bg-slate-950",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const DialogHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
));

const DialogFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
));

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900 dark:text-slate-50", className)}
    {...props}
  />
));

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));

const DialogTrigger = forwardRef(({ className, children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn("", className)}
    {...props}
  >
    {children}
  </button>
));

DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogTrigger.displayName = "DialogTrigger";

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
