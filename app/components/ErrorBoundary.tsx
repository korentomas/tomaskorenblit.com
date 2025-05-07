import { useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="error-container">
      <h1>Oops! Something went wrong</h1>
      <p>We apologize for the inconvenience. Please try refreshing the page.</p>
      <details>
        <summary>Error Details</summary>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </details>
    </div>
  );
} 