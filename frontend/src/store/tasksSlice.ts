import { createAsyncThunk, createSlice, type Draft } from "@reduxjs/toolkit";
import { api } from "../lib/api";
import { isAbortError, toSerializableError, type SerializableError } from "../lib/ApiClientError";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";

type TasksState = {
  items: Task[];
  loading: boolean;
  error: SerializableError | null;
  loaded: boolean;
};

type ThunkReject = { rejectValue: SerializableError };

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  loaded: false,
};

function asRejectValue(error: unknown, fallback: string): SerializableError {
  if (isAbortError(error)) throw error;
  return toSerializableError(error, fallback);
}

export const fetchTasks = createAsyncThunk<Task[], AbortSignal | undefined, ThunkReject>(
  "tasks/fetch",
  async (signal, { rejectWithValue }) => {
    try {
      return await api.list(signal);
    } catch (error) {
      return rejectWithValue(asRejectValue(error, "Failed to load tasks"));
    }
  },
);

export const addTask = createAsyncThunk<Task, { input: CreateTaskInput; tempId: string }, ThunkReject>(
  "tasks/add",
  async ({ input }, { rejectWithValue }) => {
    try {
      return await api.create(input);
    } catch (error) {
      return rejectWithValue(asRejectValue(error, "Failed to add task"));
    }
  },
);

export const updateTask = createAsyncThunk<
  Task,
  { id: string; input: UpdateTaskInput; previous: Task },
  ThunkReject
>("tasks/update", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await api.update(id, input);
  } catch (error) {
    return rejectWithValue(asRejectValue(error, "Failed to update task"));
  }
});

export const toggleTask = createAsyncThunk<Task, { id: string; previousDone: boolean }, ThunkReject>(
  "tasks/toggle",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await api.toggle(id);
    } catch (error) {
      return rejectWithValue(asRejectValue(error, "Failed to toggle task"));
    }
  },
);

export const removeTask = createAsyncThunk<string, { id: string; previous: Task }, ThunkReject>(
  "tasks/remove",
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(asRejectValue(error, "Failed to delete task"));
    }
  },
);

function replaceById(items: Draft<Task>[], task: Task) {
  const index = items.findIndex((item) => item.id === task.id);
  if (index >= 0) items[index] = task;
  else items.push(task);
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.loaded = true;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        if (action.meta.aborted) return;
        state.error = action.payload ?? {
          status: 0,
          code: "UNKNOWN",
          message: "Failed to load tasks",
        };
      })

      .addCase(addTask.pending, (state, action) => {
        state.items.push({ ...action.meta.arg.input, id: action.meta.arg.tempId, done: false });
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tempId = action.meta.arg.tempId;
        const index = state.items.findIndex((task) => task.id === tempId);
        if (index >= 0) state.items[index] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.meta.arg.tempId);
      })

      .addCase(updateTask.pending, (state, action) => {
        const { id, input } = action.meta.arg;
        const index = state.items.findIndex((task) => task.id === id);
        if (index >= 0) state.items[index] = { ...state.items[index], ...input };
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        replaceById(state.items, action.payload);
      })
      .addCase(updateTask.rejected, (state, action) => {
        replaceById(state.items, action.meta.arg.previous);
      })

      .addCase(toggleTask.pending, (state, action) => {
        const task = state.items.find((item) => item.id === action.meta.arg.id);
        if (task) task.done = !task.done;
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        replaceById(state.items, action.payload);
      })
      .addCase(toggleTask.rejected, (state, action) => {
        const task = state.items.find((item) => item.id === action.meta.arg.id);
        if (task) task.done = action.meta.arg.previousDone;
      })

      .addCase(removeTask.pending, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.meta.arg.id);
      })
      .addCase(removeTask.rejected, (state, action) => {
        replaceById(state.items, action.meta.arg.previous);
      });
  },
});

export const { clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;
