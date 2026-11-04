import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-9 w-9",
} as const;

export default function IconButton({
  children,
  size = "md",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`grid shrink-0 place-items-center ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
