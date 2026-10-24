import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { PageBanner } from "@/components/PageBanner";
import { Reveal, RevealItem } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { SplitReveal } from "@/components/SplitReveal";
import { Blueprint, Container } from "@/components/ui";
import { images, sectionIntros, services, solutions } from "@/lib/data";

const description =
  "Sixteen solutions and services from Jnros Logistics: ODC, break bulk, Ro-Ro, bulk carrier, heavy lift and ship brokering, plus air and ocean freight, overland transport, warehousing, dangerous goods and customs clearance.";

export const metadata: Metadata = {
  title: "Solutions & Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Solutions & Services | Jnros Logistics",
    description,
    images: [{ url: images.bulkCarrier.src, width: images.bulkCarrier.width, height: images.bulkCarrier.height, alt: images.bulkCarrier.alt }],
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Solutions & Services"
        intro="Sixteen ways we move cargo, from over-dimensional project loads to everyday air and ocean freight."
        image={images.bulkCarrier}
      />

      <section aria-labelledby="solutions-heading" className="bg-offwhite py-14 md:py-20">
        <Container>
          <SplitReveal id="solutions-heading" eyebrow="01 / Solutions" title="Specialised Solutions" intro={sectionIntros.solutions} />
          <Reveal as="ul" stagger={0.06} className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-5">
            {solutions.map((s) => (
              <RevealItem as="li" key={s.slug}>
                <ServiceCard service={s} tone="light" anchor href={`/contact?service=${s.slug}`} linkLabel="Request a quote" />
              </RevealItem>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="freight-heading" className="grain bg-navy py-24 text-white md:py-32">
        <Blueprint />
        <Container className="relative">
          <SplitReveal
            id="freight-heading"
            eyebrow="02 / Services"
            title="Freight & Logistics Services"
            intro={sectionIntros.services}
            tone="dark"
          />
          <Reveal as="ul" stagger={0.06} className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-5">
            {services.map((s) => (
              <RevealItem as="li" key={s.slug}>
                <ServiceCard service={s} anchor href={`/contact?service=${s.slug}`} linkLabel="Request a quote" />
              </RevealItem>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
