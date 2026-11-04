import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Priority, Task } from "../types/task";
import useTasks from "../hooks/useTasks";
import { useAppDispatch } from "../store/hooks";
import { openEdit, requestDelete } from "../store/uiSlice";
import { Check, Edit, Trash } from "./Icons";
import IconButton from "./ui/IconButton";
import { MONTHS, formatTime, parseDate } from "../lib/dates";

const ACTION_WIDTH = 88;

const priorityClass: Record<Exclude<Priority, "">, string> = {
  High: "text-danger",
  Medium: "text-amber-600",
  Low: "text-brand",
};

type DragStart = {
  clientX: number;
  clientY: number;
  offset: number;
};

type TaskRowProps = {
  task: Task;
  showDate?: boolean;
};

export default function TaskRow({ task, showDate }: TaskRowProps) {
  const dispatch = useAppDispatch();
  const { toggleTask } = useTasks();
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<DragStart | null>(null);
  const didDrag = useRef(false);
  const ignoreClick = useRef(false);

  useEffect(() => {
    if (offsetX === 0) return;
    const close = (event: PointerEvent) => {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) setOffsetX(0);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [offsetX]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { clientX: event.clientX, clientY: event.clientY, offset: offsetX };
    didDrag.current = false;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const deltaX = event.clientX - dragStart.current.clientX;
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(event.clientY - dragStart.current.clientY)) {
      if (!didDrag.current) event.currentTarget.setPointerCapture?.(event.pointerId);
      didDrag.current = true;
      setDragging(true);
      setOffsetX(Math.max(-ACTION_WIDTH, Math.min(0, dragStart.current.offset + deltaX)));
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setDragging(false);
    if (!didDrag.current) return;
    ignoreClick.current = true;
    setTimeout(() => {
      ignoreClick.current = false;
    }, 60);
    if (offsetX < -ACTION_WIDTH / 2) {
      if (event.pointerType === "mouse") {
        setOffsetX(0);
        dispatch(requestDelete(task));
      } else setOffsetX(-ACTION_WIDTH);
    } else setOffsetX(0);
  };

  const askDelete = () => {
    setOffsetX(0);
    dispatch(requestDelete(task));
  };

  const afterDrag = (action: () => void) => () => {
    if (!ignoreClick.current) action();
  };

  const taskDate = parseDate(task.date);
  const meta = [
    showDate && `${MONTHS[taskDate.getMonth()]} ${taskDate.getDate()}`,
    task.start && `${formatTime(task.start)}${task.end ? ` – ${formatTime(task.end)}` : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div ref={rowRef} className="relative overflow-hidden border-b border-line">
      <button
        type="button"
        onClick={askDelete}
        tabIndex={offsetX < 0 ? 0 : -1}
        className="absolute inset-y-0 right-0 bg-danger text-[13px] font-medium text-white"
        style={{ width: ACTION_WIDTH }}
      >
        Delete
      </button>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateX(${offsetX}px)` }}
        className={`relative flex touch-pan-y items-center gap-3 bg-bg py-3.5 ${dragging ? "" : "transition-transform duration-200"}`}
      >
        <button
          type="button"
          onClick={afterDrag(() => void toggleTask(task.id))}
          role="checkbox"
          aria-checked={task.done}
          aria-label={task.title}
          className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[2px] border-[1.5px] border-brand text-brand"
        >
          <Check className={`h-3 w-3 ${task.done ? "" : "opacity-0"}`} />
        </button>
        <div className="min-w-0 flex-1">
          <div className={`break-words text-[13px] font-medium ${task.done ? "text-mute line-through" : ""}`}>
            {task.title}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-mute">
            <span>{meta}</span>
            {task.pri ? <span className={`font-medium ${priorityClass[task.pri]}`}>{task.pri}</span> : null}
          </div>
        </div>
        <IconButton
          onClick={afterDrag(askDelete)}
          aria-label="Delete task"
          className="text-[#B4B6C8] hover:text-danger"
        >
          <Trash className="h-5 w-5" />
        </IconButton>
        <IconButton
          onClick={afterDrag(() => dispatch(openEdit(task)))}
          aria-label="Edit task"
          className="text-[#B4B6C8] hover:text-brand"
        >
          <Edit className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  );
}
