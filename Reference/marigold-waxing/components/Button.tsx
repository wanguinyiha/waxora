import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type BaseProps = {
  variant?: "primary" | "outline" | "dark";
};

type LinkProps = BaseProps & ComponentPropsWithoutRef<typeof Link>;

const variants = {
  primary: "bg-primary text-on-primary hover:scale-[1.03]",
  outline: "border border-outline-strong text-on-background hover:border-primary hover:text-primary",
  dark: "bg-shell-base text-on-shell hover:scale-[1.03]",
};

export default function Button({ variant = "primary", className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-transform duration-150 ${variants[variant]} ${className}`}
    />
  );
}
