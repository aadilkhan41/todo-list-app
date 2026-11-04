import type { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 mt-5 text-[15px] font-semibold">{children}</h2>;
}
