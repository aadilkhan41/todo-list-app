import { Plus } from "../Icons";

type FabButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function FabButton({ onClick, label = "Add task" }: FabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-6 left-1/2 grid h-[54px] w-[54px] -translate-x-1/2 place-items-center rounded-full bg-brand text-white"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
