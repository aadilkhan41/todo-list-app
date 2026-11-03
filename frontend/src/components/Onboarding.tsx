import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

type ZigzagProps = {
  className?: string;
};

const Zigzag = ({ className }: ZigzagProps) => (
  <svg
    className={className}
    width="110"
    height="70"
    viewBox="0 0 110 70"
    fill="none"
    stroke="rgba(255,255,255,.18)"
    strokeWidth="6"
  >
    {[12, 34, 56].map((y) => (
      <path key={y} d={`M0 ${y}l14-10 14 10 14-10 14 10 14-10 14 10 14-10 14 10`} />
    ))}
  </svg>
);

export default function Onboarding() {
  const navigate = useNavigate();
  usePageTitle("Welcome");

  return (
    <div className="flex h-screen w-full max-w-[430px] flex-col bg-white">
      <div className="relative flex-[1.5] overflow-hidden bg-brand">
        <svg className="absolute -right-8 -top-8" width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="16" />
        </svg>
        <Zigzag className="absolute left-0 top-[36%]" />
        <Zigzag className="absolute bottom-0 right-0" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-7">
        <h1 className="mb-2 text-2xl font-semibold">Manage What To Do</h1>
        <p className="max-w-[260px] text-xs text-mute">
          The best way to manage what you have to do, don’t forget your plans
        </p>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mt-auto w-full rounded-sm bg-brand py-3.5 font-medium text-white"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
