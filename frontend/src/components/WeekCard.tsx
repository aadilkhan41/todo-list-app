import type { DateString, Task } from "../types/task";
import { Right } from "./Icons";
import ProgressBar from "./ui/ProgressBar";
import { formatWeekRange, parseDate } from "../lib/dates";
import { taskStats } from "../lib/tasks";

type WeekCardProps = {
  weekKey: DateString;
  tasks: Task[];
  onOpen: (weekStart: Date) => void;
};

export default function WeekCard({ weekKey, tasks, onOpen }: WeekCardProps) {
  const { completed, pending, progress } = taskStats(tasks);

  return (
    <button
      type="button"
      onClick={() => onOpen(parseDate(weekKey))}
      className="mb-3 block w-full rounded border border-line bg-field p-4 text-left"
    >
      <div className="flex items-center font-semibold">
        <span>{formatWeekRange(parseDate(weekKey))}</span>
        <Right className="ml-auto h-[18px] w-[18px] text-mute" />
      </div>
      <div className="my-3 flex gap-8">
        <div>
          <strong className="block text-[22px] font-semibold leading-tight">{pending}</strong>
          <span className="text-[11px] text-mute">Open</span>
        </div>
        <div>
          <strong className="block text-[22px] font-semibold leading-tight">{completed}</strong>
          <span className="text-[11px] text-mute">Completed</span>
        </div>
      </div>
      <ProgressBar value={progress} className="h-1.5" trackClassName="" label="Week progress" />
    </button>
  );
}
