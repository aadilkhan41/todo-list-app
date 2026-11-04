import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import type { TaskFormValues } from "../types/task";
import useTasks, { TasksProvider, useTaskUi } from "../hooks/useTasks";
import ConfirmDialog from "./ConfirmDialog";
import ErrorBanner from "./ErrorBanner";
import TaskModal from "./TaskModal";

function TasksShellInner() {
  const { modal, pendingDelete, closeModal, clearPendingDelete } = useTaskUi();
  const { error, loaded, reload, addTask, updateTask, removeTask } = useTasks();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (loaded) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    void reload(controller.signal);
    return () => controller.abort();
  }, [loaded, reload]);

  const saveTask = async (values: TaskFormValues) => {
    if (!modal) return false;
    const editing = modal.task;
    const ok = editing ? await updateTask(editing.id, values) : await addTask(values);
    if (ok) {
      closeModal();
      toast.success(editing ? "Task updated" : "Task added");
    }
    return ok;
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const task = pendingDelete;
    clearPendingDelete();
    const ok = await removeTask(task.id);
    if (ok) toast.success("Task deleted");
  };

  return (
    <>
      {error && <ErrorBanner error={error} onRetry={() => void reload()} />}
      <Outlet />
      {modal && (
        <TaskModal
          key={modal.task?.id ?? "new"}
          task={modal.task}
          date={modal.date}
          onSave={saveTask}
          onClose={closeModal}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`“${pendingDelete.title}” will be removed. This can’t be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => void confirmDelete()}
          onCancel={clearPendingDelete}
        />
      )}
    </>
  );
}

export default function TasksShell() {
  return (
    <TasksProvider>
      <TasksShellInner />
    </TasksProvider>
  );
}
