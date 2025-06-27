import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {ArrowLeft} from "lucide-react";
import { useLaravelReactI18n } from "laravel-react-i18n";

export default function BackButton({ link }) {
    const { t } = useLaravelReactI18n();

    return (
        <Link href={link}>
            <Button variant="outline" className="gap-2">
                {t("Back")}
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </Link>
    );
}