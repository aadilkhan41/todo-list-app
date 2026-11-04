import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Back } from "../Icons";
import IconButton from "./IconButton";

type PageHeaderProps = {
  title: string;
  backTo?: string;
  backLabel?: string;
  end?: ReactNode;
};

export default function PageHeader({
  title,
  backTo = "/home",
  backLabel = "Back",
  end,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <nav className="mb-3 flex items-center gap-1">
      <IconButton
        onClick={() => navigate(backTo)}
        aria-label={backLabel}
        className="-ml-2"
      >
        <Back className="h-[22px] w-[22px]" />
      </IconButton>
      <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold">{title}</h1>
      {end}
    </nav>
  );
}
