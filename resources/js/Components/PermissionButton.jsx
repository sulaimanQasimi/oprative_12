import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function PermissionButton({ 
    hasPermission, 
    children, 
    onClick, 
    className = "", 
    variant = "default",
    size = "default",
    disabled = false,
    tooltip = "",
    ...props 
}) {
    const { t } = useLaravelReactI18n();

    if (!hasPermission) {
        return (
            <Button
                variant="outline"
                size={size}
                disabled={true}
                title={tooltip || t("You don't have permission for this action")}
                className={`${className} border-red-200 text-red-400 cursor-not-allowed hover:bg-red-50 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-900/10`}
                {...props}
            >
                <Lock className="h-4 w-4 mr-2 text-red-500" />
                {children}
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
} 