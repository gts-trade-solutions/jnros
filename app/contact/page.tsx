import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons";
import { PageBanner } from "@/components/PageBanner";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { Container, EmailText } from "@/components/ui";
import { cargoTypes, gallery, services, site, solutions, whatsappUrl } from "@/lib/data";

const description =
  "Request a quote from Jnros Logistics in Bangalore. Call or WhatsApp +91 96202 32321, email nesan.kumar@jnroslogistics.com, or send your cargo details through the quote form.";

export const metadata: Metadata = {
  title: "Contact & Quote",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact & Quote | Jnros Logistics", description },
};

const serviceOptions = [...solutions, ...services].map(({ slug, title, cargoType }) => ({ slug, title, cargoType }));

const details = [
  {
    icon: Phone,
    label: "Phone",
    value: site.phone,
    href: site.phoneHref,
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: site.phone,
    href: whatsappUrl(),
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Contact Us"
        intro="Tell us what you're moving and where. We'll come back with a route plan and a quote."
        image={gallery[4]}
      />

      <section className="bg-offwhite py-14 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="space-y-10 lg:col-span-5">
            <div>
              <h2 className="font-display text-h2">Talk to our team</h2>
              <p className="mt-4 max-w-prose text-steel-dark">
                For project cargo, ODC and heavy lift enquiries, sharing dimensions and weights up front helps us reply
                faster.
              </p>
            </div>

            <ul className="divide-y divide-navy/10 border-y border-navy/10">
              {details.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    {...(d.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center gap-5 py-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy text-white">
                      <d.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-steel-dark">{d.label}</span>
                      <span className="block font-semibold text-navy group-hover:underline">
                        {d.label === "Email" ? <EmailText email={d.value} /> : d.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-5 py-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy text-white">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-steel-dark">Office</span>
                  <address className="font-semibold not-italic leading-relaxed text-navy">
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </span>
              </li>
            </ul>

            <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
              <iframe
                src={site.mapEmbedUrl}
                title="Map showing the Jnros Logistics office in Kalyan Nagar, Bangalore"
                className="block aspect-[4/3] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card sm:p-10">
              <h2 id="quote" className="scroll-mt-28 font-display text-h2">
                Request a quote
              </h2>
              <p className="mb-8 mt-3 text-steel-dark">Fields marked optional can be left blank.</p>
              <QuoteForm cargoTypes={cargoTypes} services={serviceOptions} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
