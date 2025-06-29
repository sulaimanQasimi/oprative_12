import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function ActionButton({ link, icon, text, variant = "outline", className = "" }) {
    const { t } = useLaravelReactI18n();

    return (
        <Link href={link}>
            <Button variant={variant} className={`gap-2 ${className}`}>
                {text}
                {icon}
            </Button>
        </Link>
    );
}