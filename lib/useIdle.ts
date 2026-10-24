"use client";

import { useEffect, useState } from "react";

const queue: (() => void)[] = [];
let pumping = false;

const onIdle = (cb: () => void) => {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
  else window.setTimeout(cb, 40);
};

function pump() {
  if (pumping) return;
  pumping = true;
  const step = () => {
    const next = queue.shift();
    if (!next) {
      pumping = false;
      return;
    }
    next();
    onIdle(step);
  };
  onIdle(step);
}

/**
 * Becomes true after hydration, in its own idle task, releasing one component per idle callback
 * (in mount order, which is page order). Keeps animation setup out of the hydration commit, where
 * it would otherwise pile into a single long task on slow phones.
 */
export function useIdle() {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let alive = true;
    queue.push(() => alive && setIdle(true));
    pump();
    return () => {
      alive = false;
    };
  }, []);

  return idle;
}
