import { Fragment } from "react";

const SPARKLE = "✦";

export function SparkleText({ text }: { text: string }) {
  if (!text.includes(SPARKLE)) return <>{text}</>;
  const parts = text.split(SPARKLE);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="sparkle" aria-hidden="true">
              {SPARKLE}
            </span>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}
