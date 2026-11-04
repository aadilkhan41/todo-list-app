import type { ComponentType } from "react";
import { pad2 } from "../lib/dates";

type StatCardProps = {
  label: string;
  count: number;
  cardClass: string;
  iconClass: string;
  Icon: ComponentType<{ className?: string }>;
};

export default function StatCard({ label, count, cardClass, iconClass, Icon }: StatCardProps) {
  return (
    <div className={`rounded-sm p-3.5 text-xs ${cardClass}`}>
      <div className="flex items-center">
        <span className={`mr-2 grid h-5 w-5 place-items-center rounded-sm ${iconClass}`}>
          <Icon className="h-3 w-3" />
        </span>
        {label}
      </div>
      <div className="mt-2.5 text-2xl font-semibold">
        {pad2(count)}
        <small className="ml-1 text-[9px] font-normal text-mute">This Week</small>
      </div>
    </div>
  );
}
