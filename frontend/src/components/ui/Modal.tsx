import type { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  align?: "center" | "bottom";
  panelClassName?: string;
  zClassName?: string;
  role?: "dialog" | "alertdialog";
  labelledBy?: string;
  describedBy?: string;
};

export default function Modal({
  children,
  onClose,
  align = "center",
  panelClassName = "",
  zClassName = "z-40",
  role = "dialog",
  labelledBy,
  describedBy,
}: ModalProps) {
  const alignClass =
    align === "bottom" ? "items-end justify-center" : "items-center justify-center px-6";

  return (
    <div className={`fixed inset-0 ${zClassName} flex ${alignClass} bg-black/45`} onClick={onClose}>
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onClick={(event) => event.stopPropagation()}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
}
