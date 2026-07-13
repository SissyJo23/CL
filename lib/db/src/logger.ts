/**
 * Minimal, dependency-free logger for the db package.
 *
 * Kept local (rather than pulling in a shared logging package) so this
 * package has no extra build-time dependencies.
 */

type LogFn = (message: string, meta?: Record<string, unknown>) => void;

function log(level: "info" | "warn" | "error" | "debug", message: string, meta?: Record<string, unknown>) {
  const line = `[db] ${message}`;
  const args = meta ? [line, meta] : [line];

  switch (level) {
    case "error":
      console.error(...args);
      break;
    case "warn":
      console.warn(...args);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") console.debug(...args);
      break;
    default:
      console.log(...args);
  }
}

export const logger: { info: LogFn; warn: LogFn; error: LogFn; debug: LogFn } = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
  debug: (message, meta) => log("debug", message, meta),
};