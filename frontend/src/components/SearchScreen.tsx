import { Link } from "react-router-dom";

export default function SearchScreen() {
  return (
    <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-white px-5 pb-8 pt-6">
      <Link to="/home" className="mb-4 text-xs font-medium text-brand">
        Back
      </Link>
      <h1 className="mb-2 text-xl font-semibold">Search</h1>
      <p className="text-xs text-mute">Search UI comes in a later step.</p>
    </div>
  );
}
