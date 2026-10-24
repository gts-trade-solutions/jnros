"use client";

import { AnimatePresence, domMax, LayoutGroup, LazyMotion } from "framer-motion";
import * as m from "framer-motion/m";
import Image from "next/image";
import { useRef, useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { TiltCard } from "@/components/TiltCard";
import type { ProjectPhoto, ProjectStage } from "@/lib/data";
import { cx, EASE } from "@/lib/utils";

type Filter = "All" | ProjectStage;

/** Filterable project photos. Cards re-flow with layout animations; clicking opens the lightbox. */
export function ProjectsGrid({ photos, stages }: { photos: ProjectPhoto[]; stages: readonly ProjectStage[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<Map<string, HTMLButtonElement>>(new Map());

  const visible = filter === "All" ? photos : photos.filter((p) => p.stage === filter);
  const filters: Filter[] = ["All", ...stages];

  const close = () => {
    const last = index !== null ? visible[index] : null;
    setIndex(null);
    if (last) requestAnimationFrame(() => triggers.current.get(last.image.src)?.focus());
  };

  return (
    // Layout animations (filters) and drag (lightbox) need the larger domMax feature set, only on this page.
    <LazyMotion features={domMax} strict>
      <div role="group" aria-label="Filter by stage" className="flex flex-wrap gap-2">
        <LayoutGroup id="project-filters">
          {filters.map((f) => {
            const count = f === "All" ? photos.length : photos.filter((p) => p.stage === f).length;
            const selected = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(f)}
                className={cx(
                  "relative h-11 rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
                  selected ? "border-navy text-white" : "border-navy/15 text-navy hover:border-navy/40",
                )}
              >
                {selected && (
                  <m.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-navy"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
                <span className="relative">
                  {f} <span className={selected ? "text-white/60" : "text-steel-dark"}>{count}</span>
                </span>
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "photo" : "photos"}
      </p>

      <m.ul layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((photo, i) => (
            <m.li
              key={photo.image.src}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <button
                ref={(el) => {
                  if (el) triggers.current.set(photo.image.src, el);
                }}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View photo: ${photo.title}`}
                className="group block w-full text-left"
              >
                <TiltCard className="aspect-[4/3] rounded-2xl">
                  <Image
                    src={photo.image.src}
                    alt={photo.image.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </TiltCard>
                <span className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="font-display text-h3 text-navy">{photo.title}</span>
                  <span className="shrink-0 text-sm text-steel-dark">{photo.stage}</span>
                </span>
              </button>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      <Lightbox images={visible.map((p) => p.image)} index={index} onClose={close} onChange={setIndex} />
    </LazyMotion>
  );
}
