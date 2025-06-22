import React, { useState } from "react";
import { cn } from "@/lib/utils";

const Collapsible = ({ open, onOpenChange, children, ...props }) => {
    const [isOpen, setIsOpen] = useState(open || false);

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onOpenChange) {
            onOpenChange(newState);
        }
    };

    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    return (
        <div {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === CollapsibleTrigger) {
                        return React.cloneElement(child, {
                            onClick: handleToggle,
                            'aria-expanded': isOpen,
                        });
                    }
                    if (child.type === CollapsibleContent) {
                        return React.cloneElement(child, {
                            isOpen: isOpen,
                        });
                    }
                }
                return child;
            })}
        </div>
    );
};

const CollapsibleTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "flex items-center justify-between w-full text-left",
            className
        )}
        {...props}
    >
        {children}
    </button>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef(({ className, children, isOpen, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            className
        )}
        {...props}
    >
        <div className={isOpen ? "pb-2" : ""}>
            {children}
        </div>
    </div>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent }; 