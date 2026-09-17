/**
 * Toast helper — wraps react-hot-toast with the project's i18n labels.
 *
 * Usage:
 *   import { notify } from "@/lib/notify";
 *   notify.success("Hotel created");
 *   notify.error("Failed to save");
 *   notify.apiError(err);  // extracts message from API response
 */
import toast, { type Renderable } from "react-hot-toast";

export const notify = {
  success(message: Renderable) {
    toast.success(message);
  },
  error(message: Renderable) {
    toast.error(message);
  },
  /** Pull a human-readable message out of an API error response. */
  apiError(err: unknown, fallback = "Something went wrong") {
    let message = fallback;
    if (err instanceof Error) message = err.message;
    if (typeof err === "object" && err !== null) {
      const e = err as Record<string, any>;
      if (typeof e.message === "string") message = e.message;
      if (Array.isArray(e.errors) && e.errors.length > 0) {
        const first = e.errors[0];
        if (first && typeof first.message === "string") message = first.message;
      }
    }
    toast.error(message);
  },
  loading(message: Renderable) {
    return toast.loading(message);
  },
  dismiss(id?: string) {
    if (id) toast.dismiss(id);
    else toast.dismiss();
  },
};

export { toast };
