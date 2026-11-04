import { useCallback } from "react";
import { toast } from "react-toastify";
import { ApiClientError, isAbortError, toErrorMessage } from "../lib/ApiClientError";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTask as addTaskThunk,
  clearTasksError,
  fetchTasks,
  removeTask as removeTaskThunk,
  toggleTask as toggleTaskThunk,
  updateTask as updateTaskThunk,
} from "../store/tasksSlice";

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

export default function useTasks(): UseTasksResult {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.tasks.items);
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);
  const loaded = useAppSelector((state) => state.tasks.loaded);

  const run = useCallback(async (promise: Promise<unknown>, { notify = true } = {}) => {
    try {
      await promise;
      return true;
    } catch (error) {
      if (isAbortError(error)) return false;
      if (notify) toast.error(toErrorMessage(error));
      return false;
    }
  }, []);

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      await run(dispatch(fetchTasks(signal)).unwrap(), { notify: false });
    },
    [dispatch, run],
  );

  const addTask = useCallback(
    (input: CreateTaskInput) =>
      run(dispatch(addTaskThunk({ input, tempId: `tmp-${Date.now()}` })).unwrap()),
    [dispatch, run],
  );

  const updateTask = useCallback(
    (id: string, input: UpdateTaskInput) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      return run(dispatch(updateTaskThunk({ id, input, previous })).unwrap());
    },
    [dispatch, items, run],
  );

  const toggleTask = useCallback(
    (id: string) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      return run(dispatch(toggleTaskThunk({ id, previousDone: previous.done })).unwrap());
    },
    [dispatch, items, run],
  );

  const removeTask = useCallback(
    (id: string) => {
      const previous = items.find((task) => task.id === id);
      if (!previous) return Promise.resolve(false);
      return run(dispatch(removeTaskThunk({ id, previous })).unwrap());
    },
    [dispatch, items, run],
  );

  return {
    tasks: items,
    loading,
    error: error ? ApiClientError.fromUnknown(error) : null,
    loaded,
    reload,
    clearError: () => dispatch(clearTasksError()),
    addTask,
    updateTask,
    toggleTask,
    removeTask,
  };
}
