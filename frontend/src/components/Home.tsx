import { Link, useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { currentWeekStartKey, tasksPath } from "../lib/tasks";

export default function Home() {
  const navigate = useNavigate();
  const thisWeekKey = currentWeekStartKey();
  usePageTitle("Home");

  return (
    <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-white px-5 pb-8 pt-6">
      <h1 className="mb-4 text-xl font-semibold">Home</h1>
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="mb-4 flex h-[46px] w-full items-center rounded border border-line bg-field px-3.5 text-left text-xs text-mute"
      >
        Search for a task
      </button>
      <p className="mb-2 text-sm font-medium text-mute">This Week</p>
      <Link
        to={tasksPath(thisWeekKey)}
        className="rounded border border-line bg-field px-4 py-3 text-sm font-medium text-ink"
      >
        Open week {thisWeekKey}
      </Link>
    </div>
  );
}
