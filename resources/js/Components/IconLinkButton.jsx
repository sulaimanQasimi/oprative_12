 
import { Link } from "@inertiajs/react";

const IconLinkButton = ({
    href,
    icon: Icon,
    label,
    variant = "ghost",
    size = "sm",
    className = "h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors",
    iconClassName = "h-4 w-4",
    ...props
}) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            asChild
            {...props}
        >
            <Link href={href}>
                <Icon className={iconClassName} />
                <span className="sr-only">{label}</span>
            </Link>
        </Button>
    );
};

export default IconLinkButton; 