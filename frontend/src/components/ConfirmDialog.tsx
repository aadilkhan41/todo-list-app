import Modal from "./ui/Modal";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      onClose={onCancel}
      role="alertdialog"
      labelledBy="confirm-title"
      describedBy="confirm-message"
      panelClassName="w-full max-w-[340px] rounded-sm bg-sheet px-5 py-5"
    >
      <h3 id="confirm-title" className="text-base font-medium text-ink">
        {title}
      </h3>
      <p id="confirm-message" className="mt-2 text-xs text-mute">
        {message}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-line py-3 text-xs font-medium text-ink"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-sm bg-danger py-3 text-xs font-medium text-white"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
