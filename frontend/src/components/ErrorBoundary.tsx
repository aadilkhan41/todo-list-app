import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";

type Props = {
  children: ReactNode;
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex min-h-screen justify-center bg-[#F2F3F7]">
      <div className="flex w-full max-w-[430px] flex-col justify-center gap-4 bg-white px-5 py-10">
        <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
        <p className="text-xs text-mute">Reload this screen and try again.</p>
        {import.meta.env.DEV && (
          <pre className="overflow-auto rounded bg-[#F2F3F7] p-3 text-[11px] text-danger">
            {message}
          </pre>
        )}
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="w-full rounded-sm bg-brand py-3.5 font-medium text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("[ui]", error, info.componentStack);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
