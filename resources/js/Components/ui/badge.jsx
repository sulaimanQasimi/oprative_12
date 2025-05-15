import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
        {
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80":
            variant === "default",
          "border-transparent bg-indigo-500 text-slate-50 hover:bg-indigo-500/80":
            variant === "primary",
          "border-transparent bg-green-500 text-slate-50 hover:bg-green-500/80":
            variant === "success",
          "border-transparent bg-yellow-500 text-slate-50 hover:bg-yellow-500/80":
            variant === "warning",
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80":
            variant === "danger",
          "border-slate-200 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
