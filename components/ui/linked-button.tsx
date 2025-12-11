import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ButtonProps } from "@/components/ui/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface LinkedButtonProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
  linkProps?: Omit<ComponentProps<typeof Link>, "href">;
}

export function LinkedButton({
  href,
  children,
  linkProps,
  className,
  ...buttonProps
}: LinkedButtonProps) {
  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        buttonVariants({ variant: buttonProps.variant }),
        className
      )}
    >
      {children}
    </Link>
  );
}
