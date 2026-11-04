import { useState } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import usePageTitle from "../hooks/usePageTitle";
import useTasks from "../hooks/useTasks";
import TaskList from "./TaskList";
import PageHeader from "./ui/PageHeader";
import PageShell from "./ui/PageShell";
import { Search } from "./Icons";
import { searchTasks } from "../lib/tasks";

export default function SearchScreen() {
  const { tasks } = useTasks();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  usePageTitle("Search");
  const results = searchTasks(tasks, debouncedQuery);
  const searching = debouncedQuery.trim().length > 0;

  return (
    <PageShell className="pb-20">
      <PageHeader title="Search" />
      <div className="flex h-[46px] items-center rounded border border-line bg-field px-3.5">
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a task"
          aria-label="Search for a task"
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
        />
        <Search className="h-[18px] w-[18px]" />
      </div>
      <div className="mt-3.5">
        <TaskList
          tasks={results}
          showDate
          emptyTitle={searching ? "No matching tasks" : "Find a task"}
          emptyHint={searching ? "Try a different keyword." : "Search by title or description."}
        />
      </div>
    </PageShell>
  );
}
