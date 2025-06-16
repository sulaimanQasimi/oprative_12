import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Switch = forwardRef(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                ref={ref}
                role="switch"
                aria-checked={checked}
                data-state={checked ? "checked" : "unchecked"}
                onClick={() => onCheckedChange(!checked)}
                className={cn(
                    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950",
                    checked
                        ? "bg-slate-900 dark:bg-slate-50"
                        : "bg-slate-200 dark:bg-slate-800",
                    className
                )}
                {...props}
            >
                <span
                    data-state={checked ? "checked" : "unchecked"}
                    className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-slate-950",
                        checked ? "translate-y-0" : "translate-x-0"
                    )}
                />
            </button>
        );
    }
);

Switch.displayName = "Switch";

export { Switch };
