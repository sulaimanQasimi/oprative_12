import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                if (child.type === DropdownMenuTrigger) {
                    return React.cloneElement(child, {
                        onClick: () => setIsOpen(!isOpen),
                        "aria-expanded": isOpen,
                        "aria-haspopup": true,
                    });
                }

                if (child.type === DropdownMenuContent) {
                    return isOpen ? React.cloneElement(child, {
                        onClose: () => setIsOpen(false),
                    }) : null;
                }

                return child;
            })}
        </div>
    );
};

const DropdownMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
            className
        )}
        {...props}
    >
        {children}
    </button>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ className, align = "end", sideOffset = 4, children, onClose, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95",
            align === "end" ? "right-0" : "left-0",
            "mt-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
            className
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        {...props}
    >
        {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            if (child.type === DropdownMenuItem) {
                return React.cloneElement(child, {
                    onClick: (e) => {
                        child.props.onClick?.(e);
                        onClose?.();
                    },
                });
            }

            return child;
        })}
    </div>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, inset, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
            inset && "pl-8",
            className
        )}
        role="menuitem"
        tabIndex={0}
        {...props}
    >
        {children}
    </div>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = ({ children, ...props }) => (
    <div role="group" {...props}>
        {children}
    </div>
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuPortal = ({ children }) => children;
DropdownMenuPortal.displayName = "DropdownMenuPortal";

const DropdownMenuSub = ({ children }) => children;
DropdownMenuSub.displayName = "DropdownMenuSub";

const DropdownMenuSubContent = DropdownMenuContent;
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuSubTrigger = DropdownMenuItem;
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuRadioGroup = DropdownMenuGroup;
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

const DropdownMenuCheckboxItem = DropdownMenuItem;
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = DropdownMenuItem;
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuShortcut = ({ className, ...props }) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};
