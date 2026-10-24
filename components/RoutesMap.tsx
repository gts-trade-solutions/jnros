"use client";

import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Plane, Ship } from "lucide-react";
import { useRef } from "react";
import type { RouteStop } from "@/lib/data";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useNear } from "@/lib/useNear";
import { cityPins, worldViewBox } from "@/lib/world-map";

// Registered here rather than in lib/gsap so the plugin only ships with the page that has the map.
if (typeof window !== "undefined") gsap.registerPlugin(MotionPathPlugin);

type Origin = { key: "chennai"; label: string; country: string };

/** Quadratic arc from origin to destination, bowed upward in proportion to distance. */
function arcPath([x1, y1]: readonly [number, number], [x2, y2]: readonly [number, number]) {
  const lift = Math.min(Math.hypot(x2 - x1, y2 - y1) * 0.35, 22);
  return `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - lift} ${x2} ${y2}`;
}

/**
 * Dot-matrix world map. On scroll, dashed routes draw out from India one after another;
 * each destination pops in with a ripple, the counters tick up, and a ship or plane loops
 * along the finished route. Static and fully drawn for reduced motion.
 */
export function RoutesMap({ origin, routes }: { origin: Origin; routes: RouteStop[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [vx, vy, vw, vh] = worldViewBox;
  const start = cityPins[origin.key];
  const countries = new Set([origin.country, ...routes.map((r) => r.country)]).size;
  const near = useNear(root);

  useGSAP(
    () => {
      if (!near) return;
      const q = gsap.utils.selector(root);
      const draws = q("[data-draw]");
      const dests = q("[data-dest]");
      const ripples = q("[data-ripple]");
      const vehicles = q("[data-vehicle]");
      const labels = q("[data-city]");
      const listItems = q("[data-stop]");
      const counter = (name: string) => q(`[data-counter='${name}']`)[0] as HTMLElement;
      const counts = { routes: counter("routes"), ports: counter("ports"), countries: counter("countries") };
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.set(draws, { strokeDashoffset: 0 });
      });

      mm.add(MQ.motion, () => {
        gsap.set(draws, { strokeDashoffset: 1 });
        gsap.set([...dests, ...labels], { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
        gsap.set(vehicles, { autoAlpha: 0 });
        gsap.set(listItems, { opacity: 0.35 });
        counts.routes.textContent = "0";
        counts.ports.textContent = "1";
        counts.countries.textContent = "1";

        const seen = new Set([origin.country]);
        const loops: gsap.core.Tween[] = [];
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        });

        routes.forEach((route, i) => {
          const at = i * 0.45;
          tl.to(draws[i], { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, at)
            .to(dests[i], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, at + 1.2)
            .fromTo(
              ripples[i],
              { scale: 1, autoAlpha: 0.9, transformOrigin: "50% 50%" },
              { scale: 5, autoAlpha: 0, duration: 1.1, ease: "expo.out" },
              at + 1.2,
            )
            .to(labels[i], { autoAlpha: 1, scale: 1, duration: 0.4 }, at + 1.25)
            .to(listItems[i], { opacity: 1, duration: 0.4 }, at + 1.2)
            .call(
              () => {
                seen.add(route.country);
                counts.routes.textContent = String(i + 1);
                counts.ports.textContent = String(i + 2);
                counts.countries.textContent = String(seen.size);
                // A ship or plane keeps travelling the finished route.
                const path = root.current?.querySelector<SVGPathElement>(`[data-route='${route.key}']`);
                if (!path) return;
                gsap.set(vehicles[i], { autoAlpha: 1 });
                loops.push(
                  gsap.to(vehicles[i], {
                    motionPath: {
                      path,
                      align: path,
                      alignOrigin: [0.5, 0.5],
                      autoRotate: route.mode === "air" ? 45 : false,
                    },
                    duration: 5 + i * 0.4,
                    repeat: -1,
                    ease: "none",
                  }),
                );
              },
              [],
              at + 1.25,
            );
        });

        // Pause the looping vehicles while the map is off screen.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            root.current?.classList.toggle("map-live", self.isActive);
            loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause()));
          },
        });
      });
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="order-2 lg:order-1 lg:col-span-3">
        <dl className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 lg:grid-cols-1 lg:gap-6 lg:py-8">
          {[
            { key: "countries", label: "Countries", value: countries },
            { key: "ports", label: "Ports", value: routes.length + 1 },
            { key: "routes", label: "Routes", value: routes.length },
          ].map((c) => (
            <div key={c.key} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-steel">{c.label}</dt>
              <dd className="font-condensed text-stat font-semibold text-white tabular-nums">
                <span data-counter={c.key}>{c.value}</span>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-steel lg:grid-cols-1">
          {routes.map((r) => (
            <li key={r.key} data-stop className="flex items-center gap-2">
              {r.mode === "air" ? (
                <Plane className="size-3.5 text-orange" aria-hidden="true" />
              ) : (
                <Ship className="size-3.5 text-orange" aria-hidden="true" />
              )}
              <span className="text-white">{r.city}</span>
              <span>{r.country}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-9">
        <svg
          viewBox={`${vx} ${vy} ${vw} ${vh}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label={`Map of routes from ${origin.label} to ${routes.map((r) => r.city).join(", ")}`}
        >
          <image href="/world-dots.svg" x={vx} y={vy} width={vw} height={vh} />

          {routes.map((route) => {
            const end = cityPins[route.key];
            const d = arcPath(start, end);
            return (
              <g key={route.key}>
                <mask id={`route-mask-${route.key}`} maskUnits="userSpaceOnUse">
                  <path data-draw d={d} fill="none" stroke="white" strokeWidth="2" pathLength={1} strokeDasharray="1" />
                </mask>
                <path
                  data-route={route.key}
                  d={d}
                  fill="none"
                  stroke="#FF6B1A"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                  strokeDasharray="0.9 0.9"
                  mask={`url(#route-mask-${route.key})`}
                />
                <circle data-ripple cx={end[0]} cy={end[1]} r="0.9" fill="none" stroke="#FF6B1A" strokeWidth="0.25" opacity="0" />
                <circle data-dest cx={end[0]} cy={end[1]} r="0.85" fill="#FF6B1A" />
                <text
                  data-city
                  x={end[0]}
                  y={route.labelBelow ? end[1] + 3.6 : end[1] - 2}
                  textAnchor="middle"
                  className="hidden fill-white font-sans text-[2.1px] font-medium md:block"
                >
                  {route.city}
                </text>
                <g data-vehicle opacity="0">
                  <circle r="1.7" fill="#06111F" stroke="#FF6B1A" strokeWidth="0.2" />
                  {route.mode === "air" ? (
                    <Plane x={-1.05} y={-1.05} width={2.1} height={2.1} color="#ffffff" strokeWidth={2.2} />
                  ) : (
                    <Ship x={-1.05} y={-1.05} width={2.1} height={2.1} color="#ffffff" strokeWidth={2.2} />
                  )}
                </g>
              </g>
            );
          })}

          {/* Origin */}
          <circle className="map-pulse" cx={start[0]} cy={start[1]} r="1.2" fill="#FF6B1A" />
          <circle cx={start[0]} cy={start[1]} r="1.2" fill="#FF6B1A" stroke="#06111F" strokeWidth="0.3" />
          <text
            x={start[0]}
            y={start[1] + 4}
            textAnchor="middle"
            className="hidden fill-white font-sans text-[2.1px] font-semibold md:block"
          >
            {origin.label}
          </text>
        </svg>
      </div>
    </div>
  );
}
