import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import useTasks from "../hooks/useTasks";
import { useAppDispatch } from "../store/hooks";
import { openAdd } from "../store/uiSlice";
import WeekCard from "./WeekCard";
import FabButton from "./ui/FabButton";
import PageShell from "./ui/PageShell";
import SectionTitle from "./ui/SectionTitle";
import { Search } from "./Icons";
import { currentWeekStartKey, groupTasksByWeek, tasksPath, todayString } from "../lib/tasks";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tasks, loading } = useTasks();
  usePageTitle("Home");

  const thisWeekKey = currentWeekStartKey();
  const tasksByWeek = groupTasksByWeek(tasks, thisWeekKey);
  const otherWeekKeys = Object.keys(tasksByWeek)
    .filter((weekKey) => weekKey !== thisWeekKey)
    .sort()
    .reverse();

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="flex h-[46px] w-full items-center rounded border border-line bg-field px-3.5 text-left text-xs text-mute"
      >
        <span className="flex-1">Search for a task</span>
        <Search className="h-[18px] w-[18px] text-ink" />
      </button>

      <SectionTitle>This Week</SectionTitle>
      {loading ? (
        <div aria-busy="true" className="mb-3 h-[118px] animate-pulse rounded border border-line bg-field" />
      ) : (
        <>
          <WeekCard
            weekKey={thisWeekKey}
            tasks={tasksByWeek[thisWeekKey]}
            onOpen={(weekStart) => navigate(tasksPath(weekStart))}
          />
          {otherWeekKeys.length > 0 && <SectionTitle>Other Weeks</SectionTitle>}
          {otherWeekKeys.map((weekKey) => (
            <WeekCard
              key={weekKey}
              weekKey={weekKey}
              tasks={tasksByWeek[weekKey]}
              onOpen={(weekStart) => navigate(tasksPath(weekStart))}
            />
          ))}
        </>
      )}

      <FabButton onClick={() => dispatch(openAdd(todayString()))} />
    </PageShell>
  );
}
