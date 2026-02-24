// Shim for react/compiler-runtime (React 19 feature)
// Required because @sanity/ui pulls in react-compiler-runtime which tries
// to import react/compiler-runtime — a path React 18 doesn't export.
// This provides a minimal fallback so Vite can resolve the import.
export function c(size) {
  return new Array(size).fill(undefined);
}
