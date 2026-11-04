import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({ children, className = "pb-32" }: PageShellProps) {
  return (
    <div className={`min-h-screen w-full max-w-[430px] bg-white px-4 pt-5 ${className}`}>
      {children}
    </div>
  );
}
