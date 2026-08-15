import axios from "axios";

type StatusMessages = Record<number, string>;

const DEFAULT_MESSAGES: StatusMessages = {
  401: "You need to log in to do that.",
  403: "You don't have permission to do that.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again.",
};

export function getErrorMessage(
  err: unknown,
  overrides: StatusMessages = {},
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Can't reach the server right now. Please try again.";

    const status = err.response.status;
    return overrides[status] ?? DEFAULT_MESSAGES[status] ?? fallback;
  }
  return fallback;
}