import { useState, type ChangeEvent } from "react";
import type { DateString, Priority, Task, TaskFormValues } from "../types/task";
import { Close } from "./Icons";
import IconButton from "./ui/IconButton";
import Modal from "./ui/Modal";

const inputClass = "h-[42px] w-full rounded-[2px] border border-line bg-field px-3 text-xs";
const labelClass = "mb-1.5 mt-4 block text-[11px] text-mute";
const PRIORITY_OPTIONS: Exclude<Priority, "">[] = ["Low", "Medium", "High"];

type TaskModalProps = {
  task?: Task;
  date: DateString;
  onSave: (values: TaskFormValues) => Promise<boolean>;
  onClose: () => void;
};

export default function TaskModal({ task, date, onSave, onClose }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormValues>({
    title: task?.title ?? "",
    start: task?.start ?? "",
    end: task?.end ?? "",
    date: task?.date ?? date,
    pri: task?.pri ?? "",
    desc: task?.desc ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField =
    (field: keyof TaskFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: event.target.value });

  const submit = async () => {
    if (saving) return;
    if (!form.title.trim()) return setError("Title is required");

    setError("");
    setSaving(true);
    const ok = await onSave({ ...form, title: form.title.trim(), desc: form.desc.trim() });
    setSaving(false);
    if (!ok) setError("Couldn't save. Try again.");
  };

  return (
    <Modal
      onClose={onClose}
      align="bottom"
      zClassName="z-20"
      labelledBy="task-modal-title"
      panelClassName="max-h-[94vh] w-full max-w-[430px] overflow-auto bg-sheet px-[18px] pb-5 pt-5"
    >
      <div className="flex items-center justify-between">
        <h3 id="task-modal-title" className="text-base font-medium">
          {task ? "Edit Task" : "Add New Task"}
        </h3>
        <IconButton onClick={onClose} aria-label="Close" size="sm" className="h-7 w-7">
          <Close className="h-[18px] w-[18px]" />
        </IconButton>
      </div>
      <label className={labelClass} htmlFor="task-title">
        Task title
      </label>
      <input
        id="task-title"
        autoFocus
        className={inputClass}
        value={form.title}
        onChange={updateField("title")}
        maxLength={120}
        placeholder="Doing Homework"
      />
      <label className={labelClass}>Set Time</label>
      <div className="grid grid-cols-2 gap-3.5">
        <input
          className={inputClass}
          type="time"
          aria-label="Start time"
          value={form.start}
          onChange={updateField("start")}
        />
        <input
          className={inputClass}
          type="time"
          aria-label="End time (optional)"
          value={form.end}
          onChange={updateField("end")}
        />
      </div>
      <label className={labelClass} htmlFor="task-date">
        Set Date
      </label>
      <input
        id="task-date"
        className={inputClass}
        type="date"
        value={form.date}
        onChange={updateField("date")}
      />
      <label className={labelClass}>Priority (optional)</label>
      <div className="flex gap-2">
        {PRIORITY_OPTIONS.map((priority) => (
          <button
            key={priority}
            type="button"
            aria-pressed={form.pri === priority}
            onClick={() => setForm({ ...form, pri: form.pri === priority ? "" : priority })}
            className={`h-[38px] flex-1 rounded-[2px] border text-xs ${
              form.pri === priority ? "border-brand bg-brand text-white" : "border-line text-mute"
            }`}
          >
            {priority}
          </button>
        ))}
      </div>
      <label className={labelClass} htmlFor="task-desc">
        Description
      </label>
      <textarea
        id="task-desc"
        className={`${inputClass} h-[92px] resize-none py-2.5`}
        value={form.desc}
        onChange={updateField("desc")}
        placeholder="Add Description"
      />
      <div role="alert" className="mt-2.5 min-h-[18px] text-xs text-danger">
        {error}
      </div>
      <button
        type="button"
        onClick={() => void submit()}
        disabled={saving}
        className="mt-1.5 w-full rounded-sm bg-brand py-3.5 font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : task ? "Save task" : "Create task"}
      </button>
    </Modal>
  );
}
