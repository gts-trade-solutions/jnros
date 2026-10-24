import { WhatsAppIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/data";

/** Floating WhatsApp link with a soft pulse ring; expands to "Chat with us" on hover or focus. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl("Hi Jnros Logistics, I'd like to discuss a shipment.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="group fixed bottom-5 right-5 z-40 flex h-14 items-center rounded-full bg-whatsapp px-3.5 text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] focus-visible:outline-whatsapp md:bottom-8 md:right-8"
    >
      <span aria-hidden="true" className="pulse-ring absolute inset-0 rounded-full bg-whatsapp" />
      <WhatsAppIcon className="relative size-7 shrink-0" />
      {/* 0fr → 1fr grid column animates the width without measuring. */}
      <span className="relative grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap">
          <span className="block pl-2.5 pr-1.5 font-display text-button font-semibold uppercase">Chat with us</span>
        </span>
      </span>
    </a>
  );
}
