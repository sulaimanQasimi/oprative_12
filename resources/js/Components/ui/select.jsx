import React, { createContext, forwardRef, useContext, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = createContext({});

const Select = ({ children, value, onValueChange, ...props }) => {
    const [open, setOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState("");

    return (
        <SelectContext.Provider value={{
            value,
            onValueChange,
            open,
            setOpen,
            displayValue,
            setDisplayValue
        }}>
            <div className="relative" {...props}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
    const { open, setOpen } = useContext(SelectContext);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (triggerRef.current && !triggerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen]);

    return (
        <button
            type="button"
            ref={(node) => {
                triggerRef.current = node;
                if (ref) {
                    if (typeof ref === 'function') ref(node);
                    else ref.current = node;
                }
            }}
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus:ring-blue-400",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
});

const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => {
    const { value, displayValue } = useContext(SelectContext);

    return (
        <span
            className={cn("block truncate text-left", className)}
            ref={ref}
            {...props}
        >
            {displayValue || value || <span className="text-gray-500">{placeholder}</span>}
        </span>
    );
});

const SelectContent = forwardRef(({ className, children, ...props }, ref) => {
    const { open } = useContext(SelectContext);

    if (!open) return null;

    return (
        <div
            className={cn(
                "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-80 mt-1 dark:bg-gray-800 dark:border-gray-600",
                className
            )}
            ref={ref}
            {...props}
        >
            <div className="max-h-60 overflow-auto p-1">
                {children}
            </div>
        </div>
    );
});

const SelectItem = forwardRef(
    ({ className, children, value, ...props }, ref) => {
        const {
            value: selectedValue,
            onValueChange,
            setOpen,
            setDisplayValue,
        } = useContext(SelectContext);
        const isSelected = selectedValue === value;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-700",
                    isSelected ? "bg-gray-100 dark:bg-gray-700" : "",
                    className
                )}
                onClick={() => {
                    onValueChange(value);
                    setDisplayValue(children);
                    setOpen(false);
                }}
                {...props}
            >
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
