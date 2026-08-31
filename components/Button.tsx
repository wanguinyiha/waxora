import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type BaseProps = {
  variant?: "primary" | "outline" | "dark";
};

type LinkProps = BaseProps & ComponentPropsWithoutRef<typeof Link>;

const variants = {
  primary: "bg-primary text-on-primary hover:scale-[1.03]",
  outline: "border border-outline-strong text-on-background hover:border-primary hover:bg-primary/10 hover:text-primary",
  dark: "bg-primary text-on-primary hover:bg-primary-strong",
};

export default function Button({ variant = "primary", className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-transform duration-150 ${variants[variant]} ${className}`}
    />
  );
}
