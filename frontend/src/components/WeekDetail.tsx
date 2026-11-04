import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import useTasks from "../hooks/useTasks";
import { useAppDispatch } from "../store/hooks";
import { openAdd } from "../store/uiSlice";
import DayStrip from "./DayStrip";
import StatCard from "./StatCard";
import TaskList from "./TaskList";
import { Check, Close, Left, Right } from "./Icons";
import FabButton from "./ui/FabButton";
import IconButton from "./ui/IconButton";
import PageHeader from "./ui/PageHeader";
import PageShell from "./ui/PageShell";
import ProgressBar from "./ui/ProgressBar";
import { addDays, formatWeekRange, parseDate } from "../lib/dates";
import {
  currentWeekStart,
  dayListTitle,
  defaultDayInWeek,
  filterByDay,
  filterByWeek,
  sortByDateTime,
  taskStats,
  tasksPath,
  todayString,
  weekBounds,
} from "../lib/tasks";

const WEEK_START_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function WeekDetail() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { weekStart: weekStartParam = "" } = useParams<{ weekStart: string }>();
  const { tasks } = useTasks();
  usePageTitle("Tasks");

  const weekParamValid = WEEK_START_RE.test(weekStartParam);
  const week = weekParamValid ? parseDate(weekStartParam) : currentWeekStart();
  const today = todayString();
  const { start: weekStart, end: weekEnd } = weekBounds(week);

  const [selectedDay, setSelectedDay] = useState(defaultDayInWeek(weekStart, weekEnd, today));
  const [showAllDays, setShowAllDays] = useState(false);

  useEffect(() => {
    setSelectedDay(defaultDayInWeek(weekStart, weekEnd, today));
    setShowAllDays(false);
  }, [weekStart, weekEnd, today]);

  if (!weekParamValid) {
    return <Navigate to={tasksPath()} replace />;
  }

  const weekTasks = filterByWeek(tasks, weekStart, weekEnd);
  const { completed, pending, progress } = taskStats(weekTasks);
  const visibleTasks = sortByDateTime(showAllDays ? weekTasks : filterByDay(weekTasks, selectedDay));
  const listTitle = showAllDays ? "All tasks this week" : dayListTitle(selectedDay, today);

  return (
    <PageShell>
      <PageHeader
        title={formatWeekRange(week)}
        backLabel="Back to weeks"
        end={
          <div className="flex items-center">
            <IconButton
              onClick={() => navigate(tasksPath(addDays(week, -7)))}
              aria-label="Previous week"
              size="sm"
            >
              <Left className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton
              onClick={() => navigate(tasksPath(addDays(week, 7)))}
              aria-label="Next week"
              size="sm"
            >
              <Right className="h-[18px] w-[18px]" />
            </IconButton>
          </div>
        }
      />

      <DayStrip
        week={week}
        today={today}
        selectedDay={selectedDay}
        tasks={weekTasks}
        onSelect={(day) => {
          setSelectedDay(day);
          setShowAllDays(false);
        }}
      />

      <div className="mb-5 mt-[18px] grid grid-cols-2 gap-3.5">
        <StatCard
          label="Task Complete"
          count={completed}
          cardClass="bg-tint"
          iconClass="bg-[#B9C4F8] text-navy"
          Icon={Check}
        />
        <StatCard
          label="Task Pending"
          count={pending}
          cardClass="bg-redtint"
          iconClass="bg-[#FFB8BB] text-danger"
          Icon={Close}
        />
      </div>

      <h2 className="text-[15px] font-semibold">Weekly Progress</h2>
      <ProgressBar value={progress} label="Weekly progress" />

      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">{listTitle}</h2>
        <button
          type="button"
          onClick={() => setShowAllDays(!showAllDays)}
          className="text-xs font-medium text-brand"
        >
          {showAllDays ? "View Day" : "View All"}
        </button>
      </div>

      <TaskList
        tasks={visibleTasks}
        showDate={showAllDays}
        emptyTitle="Nothing planned"
        emptyHint={`Tap + to add a task for this ${showAllDays ? "week" : "day"}.`}
      />

      <FabButton onClick={() => dispatch(openAdd(showAllDays ? weekStart : selectedDay))} />
    </PageShell>
  );
}
