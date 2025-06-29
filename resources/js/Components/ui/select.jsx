import React, { createContext, forwardRef, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const SelectContext = createContext({});

const Select = ({ children, value, onValueChange, open, onOpenChange, ...props }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen;
    const selectId = useRef(`select-${Math.random().toString(36).substr(2, 9)}`);

    return (
        <SelectContext.Provider value={{ 
            value, 
            onValueChange, 
            open: isOpen, 
            setOpen: setIsOpen,
            isControlled,
            selectId: selectId.current
        }}>
            <div className="relative" data-select-container data-select-id={selectId.current} {...props}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = forwardRef(({ className, children, disabled, ...props }, ref) => {
    const { open, setOpen, selectId } = useContext(SelectContext);

    return (
        <button
            type="button"
            ref={ref}
            disabled={disabled}
            data-select-trigger
            data-select-id={selectId}
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-800",
                open && "ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown 
                className={cn(
                    "h-4 w-4 opacity-50 transition-transform duration-200", 
                    open && "rotate-180"
                )} 
            />
        </button>
    );
});

const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => {
    const { value } = useContext(SelectContext);

    return (
        <span 
            ref={ref}
            className={cn("flex truncate", className)} 
            {...props}
        >
            {value || placeholder}
        </span>
    );
});

const SelectContent = forwardRef(({ 
    className, 
    children, 
    position = "popper", 
    sideOffset = 4,
    align = "start",
    side = "bottom",
    avoidCollisions = true,
    ...props 
}, ref) => {
    const { open, setOpen, selectId } = useContext(SelectContext);
    const contentRef = useRef(null);
    const triggerRef = useRef(null);
    const [positionStyle, setPositionStyle] = useState({});
    const [zIndex, setZIndex] = useState(9999);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            // Set a higher z-index for the most recently opened select
            const currentMaxZIndex = Math.max(
                9999,
                ...Array.from(document.querySelectorAll('[data-select-content]'))
                    .map(el => parseInt(el.style.zIndex) || 9999)
            );
            setZIndex(currentMaxZIndex + 1);
            
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [open, setOpen]);

    useEffect(() => {
        if (open) {
            // Find the specific trigger element for this select
            const triggerElement = document.querySelector(`[data-select-trigger][data-select-id="${selectId}"]`);
            if (triggerElement) {
                const rect = triggerElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                setPositionStyle({
                    position: 'fixed',
                    top: rect.bottom + scrollTop + sideOffset,
                    left: rect.left + scrollLeft,
                    width: rect.width,
                    zIndex,
                });
            }
        }
    }, [open, sideOffset, selectId, zIndex]);

    if (!open) return null;

    const content = (
        <div
            ref={(node) => {
                contentRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            }}
            className={cn(
                "fixed z-[9999] min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-900 shadow-lg animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                className
            )}
            style={positionStyle}
            data-select-content
            {...props}
        >
            <div className="p-1 max-h-[300px] overflow-y-auto">
                {children}
            </div>
        </div>
    );

    // Use portal to render at document body level for better z-index handling
    return createPortal(content, document.body);
});

const SelectItem = forwardRef(({ 
    className, 
    children, 
    value, 
    disabled = false,
    ...props 
}, ref) => {
    const {
        value: selectedValue,
        onValueChange,
        setOpen,
    } = useContext(SelectContext);
    
    const isSelected = selectedValue === value;

    const handleClick = () => {
        if (!disabled) {
            onValueChange(value);
            setOpen(false);
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-slate-700 dark:focus:bg-slate-700",
                isSelected && "bg-slate-100 dark:bg-slate-700",
            )}
            onClick={handleClick}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
            </span>
            {children}
        </div>
    );
});

const SelectGroup = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("p-1", className)}
            {...props}
        >
            {children}
        </div>
    );
});

const SelectLabel = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "py-1.5 pl-8 pr-2 text-sm font-semibold text-slate-900 dark:text-white",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

const SelectSeparator = forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-slate-700", className)}
            {...props}
        />
    );
});

// Display names for better debugging
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectGroup.displayName = "SelectGroup";
SelectLabel.displayName = "SelectLabel";
SelectSeparator.displayName = "SelectSeparator";

export { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator
};
