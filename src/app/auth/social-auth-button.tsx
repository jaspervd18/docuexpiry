"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SocialAuthButtonProps = {
    provider: "google" | "microsoft";
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

export function SocialAuthButton({
    label,
    icon,
    onClick,
    disabled,
}: SocialAuthButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            className={cn(
                "w-full justify-start gap-3 bg-background/80",
                "border-border/60 hover:bg-muted/50"
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="flex h-5 w-5 items-center justify-center">
                {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
}
