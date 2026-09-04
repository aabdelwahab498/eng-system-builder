/**
 * Reference-counted body scroll lock.
 *
 * Several catalogs (images, videos, projects) can be mounted on the same page
 * and each of them can open a fullscreen overlay. Writing
 * `document.body.style.overflow` directly from every component means one
 * component's cleanup can clear another's lock (or, when a component unmounts
 * mid-transition on mobile, leave a lock behind). Counting locks centrally
 * keeps the body scrollable exactly when no overlay is open.
 */
let locks = 0;
let previousOverflow: string | null = null;

function apply() {
  if (typeof document === "undefined") return;
  if (locks > 0) {
    if (previousOverflow === null) previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = previousOverflow ?? "";
    previousOverflow = null;
  }
}

export function lockBodyScroll(): () => void {
  locks += 1;
  apply();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    apply();
  };
}

/** Safety valve: drop every lock (used on route changes). */
export function releaseAllBodyScrollLocks() {
  locks = 0;
  apply();
}
