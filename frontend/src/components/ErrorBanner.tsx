import type { ApiClientError } from "../lib/ApiClientError";

type ErrorBannerProps = {
  error: ApiClientError;
  onRetry?: () => void;
};

export default function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-30 flex justify-center bg-danger text-xs text-white"
    >
      <div className="flex w-full max-w-[430px] items-center gap-3 px-4 py-2.5">
        <span className="flex-1">{error.userMessage}</span>
        {onRetry && (
          <button type="button" onClick={onRetry} className="font-medium underline">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
