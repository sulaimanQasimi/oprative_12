import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Checkbox = forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-800 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900",
          className
        )}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
