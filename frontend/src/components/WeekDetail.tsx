import { Link, Navigate, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { formatWeekRange, parseDate } from "../lib/dates";
import { tasksPath } from "../lib/tasks";

const WEEK_START_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function WeekDetail() {
  const { weekStart: weekStartParam = "" } = useParams<{ weekStart: string }>();
  usePageTitle("Tasks");

  if (!WEEK_START_RE.test(weekStartParam)) {
    return <Navigate to={tasksPath()} replace />;
  }

  const week = parseDate(weekStartParam);

  return (
    <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-white px-5 pb-8 pt-6">
      <Link to="/home" className="mb-4 text-xs font-medium text-brand">
        Back to weeks
      </Link>
      <h1 className="mb-2 text-xl font-semibold">{formatWeekRange(week)}</h1>
      <p className="text-xs text-mute">Week detail UI comes in a later step.</p>
    </div>
  );
}
