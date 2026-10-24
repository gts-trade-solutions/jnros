"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";
import type { SiteImage } from "@/lib/data";
import { EASE, trapFocus } from "@/lib/utils";

type Props = {
  images: SiteImage[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

const navButton =
  "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-navy/70 text-white backdrop-blur transition-colors hover:bg-white/15";

export function Lightbox({ images, index, onClose, onChange }: Props) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Latest handlers in a ref so the keydown listener is bound once per open.
  const handlers = useRef({ onClose, go: (_: number) => {} });
  handlers.current = {
    onClose,
    go: (delta: number) => index !== null && onChange((index + delta + images.length) % images.length),
  };

  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    // body overflow alone doesn't stop Lenis, which scrolls the window programmatically.
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlers.current.onClose();
      else if (e.key === "ArrowRight") handlers.current.go(1);
      else if (e.key === "ArrowLeft") handlers.current.go(-1);
      else trapFocus(e, dialogRef.current);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {current && index !== null && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Project photo viewer"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 px-4 py-20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 grid size-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 md:right-8 md:top-8"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <m.figure
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            // Never more than 1.6x the source width: the gallery photos are small (320–640px).
            style={{
              width: `min(100%, ${Math.round(current.width * 1.6)}px, calc(72vh * ${current.width / current.height}))`,
            }}
          >
            <div className="relative w-full" style={{ aspectRatio: `${current.width} / ${current.height}` }}>
              <AnimatePresence initial={false}>
                <m.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  data-cursor="drag"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) handlers.current.go(1);
                    else if (info.offset.x > 60) handlers.current.go(-1);
                  }}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="pointer-events-none select-none rounded-xl object-contain"
                    draggable={false}
                  />
                </m.div>
              </AnimatePresence>
            </div>
            <figcaption className="mt-5 flex items-start justify-between gap-6 text-sm text-steel">
              <span>{current.alt}</span>
              <span className="shrink-0 tabular-nums" aria-live="polite">
                {index + 1} / {images.length}
              </span>
            </figcaption>
          </m.figure>

          <button type="button" onClick={() => handlers.current.go(-1)} aria-label="Previous photo" className={`${navButton} left-3 md:left-8`}>
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => handlers.current.go(1)} aria-label="Next photo" className={`${navButton} right-3 md:right-8`}>
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
