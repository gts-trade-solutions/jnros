"use client";

import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import * as m from "framer-motion/m";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { MagneticButton } from "@/components/MagneticButton";
import { site, whatsappUrl } from "@/lib/data";
import { cx, EASE } from "@/lib/utils";

type Field = "name" | "company" | "email" | "phone" | "cargoType" | "origin" | "destination" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type ServiceOption = { slug: string; title: string; cargoType?: string };

const FIELD_ORDER: Field[] = ["name", "company", "email", "phone", "cargoType", "origin", "destination", "message"];
const EMPTY: Values = { name: "", company: "", email: "", phone: "", cargoType: "", origin: "", destination: "", message: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name.";

  const email = v.email.trim();
  if (!email) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter a valid email address, like name@company.com.";

  const digits = v.phone.replace(/\D/g, "");
  if (!v.phone.trim()) e.phone = "Enter your phone number.";
  else if (!/^[+\d\s()-]+$/.test(v.phone) || digits.length < 8 || digits.length > 15)
    e.phone = "Enter a valid phone number, including the country code.";

  if (!v.cargoType) e.cargoType = "Choose a cargo type.";
  if (!v.origin.trim()) e.origin = "Enter the origin city or port.";
  if (!v.destination.trim()) e.destination = "Enter the destination city or port.";
  if (v.message.length > 1500) e.message = "Keep the message under 1,500 characters.";
  return e;
}

function buildMessage(v: Values) {
  const line = (label: string, value: string) => (value.trim() ? `${label}: ${value.trim()}` : null);
  return [
    "*Quote request from the Jnros Logistics website*",
    "",
    line("Name", v.name),
    line("Company", v.company),
    line("Email", v.email),
    line("Phone", v.phone),
    line("Cargo type", v.cargoType),
    line("Origin", v.origin),
    line("Destination", v.destination),
    v.message.trim() ? `\nMessage:\n${v.message.trim()}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function QuoteForm({ cargoTypes, services }: { cargoTypes: string[]; services: ServiceOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);

  // Links like /contact?service=odc-cargo-shipping pre-fill the form.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const service = services.find((s) => s.slug === slug);
    if (!service) return;
    setValues((v) => ({
      ...v,
      cargoType: service.cargoType ?? v.cargoType,
      message: v.message || `I'd like a quote for ${service.title}.`,
    }));
  }, [services]);

  const update = (name: Field, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      (formRef.current?.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      setSent(false);
      return;
    }

    const url = whatsappUrl(buildMessage(values));
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    setSent(true);
  };

  /** Underlined control with a floating label and an orange focus rule. */
  const field = (
    name: Field,
    label: string,
    control: (props: {
      id: string;
      name: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
      "aria-invalid"?: boolean;
      "aria-describedby"?: string;
      "data-filled": boolean;
      className: string;
    }) => React.ReactNode,
    { optional = false, wide = false } = {},
  ) => (
    <div className={cx(wide && "sm:col-span-2")}>
      <div className="relative">
      {control({
        id: name,
        name,
        value: values[name],
        onChange: (e) => update(name, e.target.value),
        "aria-invalid": errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
        "data-filled": values[name] !== "",
        className: cx(
          "peer block w-full border-0 border-b bg-transparent px-0 pb-2 pt-6 text-navy outline-none transition-colors",
          errors[name] ? "border-red-600" : "border-navy/20 hover:border-navy/40 focus:border-navy",
        ),
      })}
      <label
        htmlFor={name}
        className={cx(
          "pointer-events-none absolute left-0 top-6 origin-left text-steel-dark transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "peer-focus:-translate-y-5 peer-focus:scale-[0.8] peer-focus:text-navy",
          "peer-data-[filled=true]:-translate-y-5 peer-data-[filled=true]:scale-[0.8]",
        )}
      >
        {label}
        {optional && <span className="font-normal text-steel-dark"> (optional)</span>}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-orange transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
      />
      </div>
      {errors[name] && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <LazyMotion features={domAnimation} strict>
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {field("name", "Name", (p) => <input {...p} type="text" autoComplete="name" />)}
      {field("company", "Company", (p) => <input {...p} type="text" autoComplete="organization" />, { optional: true })}
      {field("email", "Email", (p) => <input {...p} type="email" autoComplete="email" inputMode="email" />)}
      {field("phone", "Phone, with country code", (p) => <input {...p} type="tel" autoComplete="tel" inputMode="tel" />)}
      {field(
        "cargoType",
        "Cargo type",
        (p) => (
          <>
            <select {...p} className={cx(p.className, "cursor-pointer appearance-none pr-8", !p.value && "text-transparent")}>
              <option value="" disabled hidden />
              {cargoTypes.map((type) => (
                <option key={type} value={type} className="text-navy">
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute bottom-2.5 right-0 size-5 text-navy" aria-hidden="true" />
          </>
        ),
        { wide: true },
      )}
      {field("origin", "Origin city or port", (p) => <input {...p} type="text" />)}
      {field("destination", "Destination city or port", (p) => <input {...p} type="text" />)}
      {field("message", "Dimensions, weight, packages, timeline", (p) => <textarea {...p} rows={4} className={cx(p.className, "resize-y")} />, {
        optional: true,
        wide: true,
      })}

      <div className="pt-2 sm:col-span-2">
        <MagneticButton type="submit" arrow={false} className="w-full sm:w-auto">
          <WhatsAppIcon className="size-5" />
          Send quote request on WhatsApp
        </MagneticButton>
        <p className="mt-3 text-sm text-steel-dark">
          This opens WhatsApp with your details filled in. Press send there and our team will reply.
        </p>
      </div>

      <div aria-live="polite" className="sm:col-span-2 empty:hidden">
        <AnimatePresence>
          {sent && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex gap-4 rounded-xl border border-navy/10 bg-offwhite p-4 text-sm text-navy"
            >
              <svg viewBox="0 0 24 24" className="size-7 shrink-0 text-whatsapp" aria-hidden="true">
                <m.circle
                  cx="12"
                  cy="12"
                  r="10.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
                <m.path
                  d="M7.5 12.5l3 3 6-6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
                />
              </svg>
              <span>
                WhatsApp opened in a new tab. Send the message there to reach our team. If it didn&apos;t open, message
                us on {site.phone}.
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </form>
    </LazyMotion>
  );
}
