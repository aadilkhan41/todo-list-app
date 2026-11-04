import type { DateString, Task } from "../types/task";
import { WEEKDAYS, addDays, pad2, toDateString } from "../lib/dates";

type DayStripProps = {
  week: Date;
  today: DateString;
  selectedDay: DateString;
  tasks: Task[];
  onSelect: (day: DateString) => void;
};

export default function DayStrip({ week, today, selectedDay, tasks, onSelect }: DayStripProps) {
  return (
    <div className="grid grid-cols-7 gap-0.5">
      {WEEKDAYS.map((weekday, index) => {
        const day = addDays(week, index);
        const dayKey = toDateString(day);
        const isSelected = dayKey === selectedDay;
        const hasTasks = tasks.some((task) => task.date === dayKey);

        return (
          <button
            key={dayKey}
            type="button"
            onClick={() => onSelect(dayKey)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center rounded-sm pb-1.5 pt-2 text-[11px] ${
              isSelected ? "bg-brand text-white" : "text-mute"
            }`}
          >
            <span>{weekday}</span>
            <b
              className={`text-[15px] font-medium ${
                isSelected ? "text-white" : dayKey === today ? "text-brand" : "text-mute"
              }`}
            >
              {pad2(day.getDate())}
            </b>
            <i
              className={`mt-[3px] h-1 w-1 rounded-full ${
                hasTasks ? (isSelected ? "bg-white" : "bg-mute") : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
