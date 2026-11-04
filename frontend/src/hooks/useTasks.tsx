import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { ApiClientError, isAbortError, toErrorMessage } from "../lib/ApiClientError";
import type { CreateTaskInput, DateString, Task, TaskModalState, UpdateTaskInput } from "../types/task";

export type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  error: ApiClientError | null;
  loaded: boolean;
  reload: (signal?: AbortSignal) => Promise<void>;
  clearError: () => void;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<boolean>;
  toggleTask: (id: string) => Promise<boolean>;
  removeTask: (id: string) => Promise<boolean>;
};

export type UseTaskUiResult = {
  modal: TaskModalState | null;
  pendingDelete: Task | null;
  openAdd: (date: DateString) => void;
  openEdit: (task: Task) => void;
  closeModal: () => void;
  requestDelete: (task: Task) => void;
  clearPendingDelete: () => void;
};

type TasksContextValue = UseTasksResult & UseTaskUiResult;

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<TaskModalState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const run = useCallback(async (action: () => Promise<void>, { notify = true } = {}) => {
    try {
      await action();
      return true;
    } catch (err) {
      if (isAbortError(err)) return false;
      if (notify) toast.error(toErrorMessage(err));
      return false;
    }
  }, []);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await api.list(signal);
      setItems(tasks);
      setLoaded(true);
    } catch (err) {
      if (!isAbortError(err)) {
        setError(ApiClientError.fromUnknown(err, "Failed to load tasks"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(
    (input: CreateTaskInput) => {
      const tempId = `tmp-${Date.now()}`;
      setItems((prev) => [...prev, { ...input, id: tempId, done: false }]);
      return run(async () => {
        try {
          const created = await api.create(input);
          setItems((prev) => {
            const index = prev.findIndex((task) => task.id === tempId);
            if (index >= 0) {
              const next = [...prev];
              next[index] = created;
              return next;
            }
            return [...prev, created];
          });
        } catch (err) {
          setItems((prev) => prev.filter((task) => task.id !== tempId));
          throw err;
        }
      });
    },
    [run],
  );

  const updateTask = useCallback(
    (id: string, input: UpdateTaskInput) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      setItems((prev) => prev.map((task) => (task.id === id ? { ...task, ...input } : task)));
      return run(async () => {
        try {
          const updated = await api.update(id, input);
          setItems((prev) => prev.map((task) => (task.id === id ? updated : task)));
        } catch (err) {
          setItems((prev) => prev.map((task) => (task.id === id ? previous : task)));
          throw err;
        }
      });
    },
    [items, run],
  );

  const toggleTask = useCallback(
    (id: string) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      setItems((prev) =>
        prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
      );
      return run(async () => {
        try {
          const updated = await api.toggle(id);
          setItems((prev) => prev.map((task) => (task.id === id ? updated : task)));
        } catch (err) {
          setItems((prev) =>
            prev.map((task) => (task.id === id ? { ...task, done: previous.done } : task)),
          );
          throw err;
        }
      });
    },
    [items, run],
  );

  const removeTask = useCallback(
    (id: string) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      setItems((prev) => prev.filter((task) => task.id !== id));
      return run(async () => {
        try {
          await api.remove(id);
        } catch (err) {
          setItems((prev) => {
            if (prev.some((task) => task.id === id)) return prev;
            return [...prev, previous];
          });
          throw err;
        }
      });
    },
    [items, run],
  );

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks: items,
      loading,
      error,
      loaded,
      reload,
      clearError: () => setError(null),
      addTask,
      updateTask,
      toggleTask,
      removeTask,
      modal,
      pendingDelete,
      openAdd: (date) => setModal({ date }),
      openEdit: (task) => setModal({ task, date: task.date }),
      closeModal: () => setModal(null),
      requestDelete: (task) => setPendingDelete(task),
      clearPendingDelete: () => setPendingDelete(null),
    }),
    [
      items,
      loading,
      error,
      loaded,
      reload,
      addTask,
      updateTask,
      toggleTask,
      removeTask,
      modal,
      pendingDelete,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

function useTasksContext(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

export default function useTasks(): UseTasksResult {
  const {
    tasks,
    loading,
    error,
    loaded,
    reload,
    clearError,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
  } = useTasksContext();
  return { tasks, loading, error, loaded, reload, clearError, addTask, updateTask, toggleTask, removeTask };
}

export function useTaskUi(): UseTaskUiResult {
  const {
    modal,
    pendingDelete,
    openAdd,
    openEdit,
    closeModal,
    requestDelete,
    clearPendingDelete,
  } = useTasksContext();
  return { modal, pendingDelete, openAdd, openEdit, closeModal, requestDelete, clearPendingDelete };
}
