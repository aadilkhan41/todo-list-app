import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DateString, Task, TaskModalState } from "../types/task";

type UiState = {
  modal: TaskModalState | null;
  pendingDelete: Task | null;
};

const initialState: UiState = {
  modal: null,
  pendingDelete: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAdd(state, action: PayloadAction<DateString>) {
      state.modal = { date: action.payload };
    },
    openEdit(state, action: PayloadAction<Task>) {
      state.modal = { task: action.payload, date: action.payload.date };
    },
    closeModal(state) {
      state.modal = null;
    },
    requestDelete(state, action: PayloadAction<Task>) {
      state.pendingDelete = action.payload;
    },
    clearPendingDelete(state) {
      state.pendingDelete = null;
    },
  },
});

export const { openAdd, openEdit, closeModal, requestDelete, clearPendingDelete } = uiSlice.actions;
export default uiSlice.reducer;
