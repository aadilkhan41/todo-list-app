import type { Task } from "../types/task";
import EmptyState from "./ui/EmptyState";
import TaskRow from "./TaskRow";

type TaskListProps = {
  tasks: Task[];
  showDate?: boolean;
  emptyTitle: string;
  emptyHint: string;
};

export default function TaskList({ tasks, showDate, emptyTitle, emptyHint }: TaskListProps) {
  if (!tasks.length) return <EmptyState title={emptyTitle} hint={emptyHint} />;

  return (
    <>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} showDate={showDate} />
      ))}
    </>
  );
}
