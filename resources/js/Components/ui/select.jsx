import React, { createContext, forwardRef, useContext, useState } from "react";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const SelectContext = createContext({});

const Select = ({ children, value, onValueChange, ...props }) => {
    const [open, setOpen] = useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
    const { value, open, setOpen } = useContext(SelectContext);

    return (
        <button
            type="button"
            ref={ref}
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
        </button>
    );
});

const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => {
    const { value } = useContext(SelectContext);

    return (
        <span className={cn("flex truncate", className)} {...props}>
            {value || placeholder}
        </span>
    );
});

const SelectContent = forwardRef(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => {
    const { open } = useContext(SelectContext);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg animate-in fade-in-80 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                position === "popper" ? "w-full" : "",
                className
            )}
            style={{
                top: `calc(100% + ${sideOffset}px)`,
                left: 0,
                right: 0
            }}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    );
});

const SelectItem = forwardRef(
    ({ className, children, value, ...props }, ref) => {
        const {
            value: selectedValue,
            onValueChange,
            setOpen,
        } = useContext(SelectContext);
        const isSelected = selectedValue === value;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700",
                    isSelected ? "bg-gray-100 dark:bg-gray-700" : "",
                    className
                )}
                onClick={() => {
                    onValueChange(value);
                    setOpen(false);
                }}
                {...props}
            >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                </span>
                {children}
            </div>
        );
    }
);

SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
