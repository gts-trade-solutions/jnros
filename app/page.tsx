import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CtaBanner } from "@/components/CtaBanner";
import { Hero } from "@/components/Hero";
import { HorizontalServices } from "@/components/HorizontalServices";
import { icons } from "@/components/icons";
import { ImageReveal } from "@/components/ImageReveal";
import { Odometer } from "@/components/Odometer";
import { ProjectHoverList } from "@/components/ProjectHoverList";
import { Reveal, RevealItem } from "@/components/Reveal";
import { RoutesMap } from "@/components/RoutesMap";
import { ServiceCard } from "@/components/ServiceCard";
import { SplitReveal } from "@/components/SplitReveal";
import { StackingSteps } from "@/components/StackingSteps";
import { Blueprint, ButtonLink, Container } from "@/components/ui";
import { VelocityMarquee } from "@/components/VelocityMarquee";
import { WordHighlight } from "@/components/WordHighlight";
import {
  about,
  eyebrows,
  featuredProject,
  featuredWork,
  hero,
  howWeWork,
  images,
  marqueeItems,
  network,
  sectionIntros,
  services,
  site,
  specialisations,
  stats,
  whyChooseUs,
} from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * Each section sits in its own Suspense boundary so React hydrates them as separate units of work
 * (selective hydration) instead of one long task. Nothing suspends; the HTML is identical.
 */
const Section = ({ children }: { children: React.ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function HomePage() {
  return (
    <>
      <Hero title={hero.title} subtitles={hero.subtitles} image={images.hero} coordinates={hero.coordinates} />
      <Section>
        <VelocityMarquee items={marqueeItems} />
      </Section>
      <Section>
        <About />
      </Section>
      <Section>
        <HorizontalServices
          eyebrow={eyebrows.specialisations}
          title="We Are Specialised In"
          intro={sectionIntros.specialisations}
          panels={specialisations}
        />
      </Section>
      <Section>
        <Network />
      </Section>
      <Section>
        <Services />
      </Section>
      <Section>
        <StackingSteps eyebrow={eyebrows.process} title={howWeWork.title} intro={howWeWork.intro} steps={howWeWork.steps} />
      </Section>
      <Section>
        <FeaturedWork />
      </Section>
      <Section>
        <WhyChooseUs />
      </Section>
      <Section>
        <CtaBanner />
      </Section>
    </>
  );
}

function About() {
  return (
    <section aria-labelledby="about-heading" className="grain bg-navy py-14 text-white md:py-20">
      <Blueprint />
      <Container className="relative">
        <SplitReveal id="about-heading" eyebrow={eyebrows.about} title={about.title} tone="dark" layout="stack" />
        <WordHighlight
          text={about.lead}
          className="mt-8 max-w-3xl font-display text-h3 font-medium leading-[1.45] md:mt-10"
        />

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-16">
          <ImageReveal
            image={images.about}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="aspect-[4/3] rounded-2xl lg:col-span-6"
          />
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-prose text-steel">{about.body}</p>
            <ul aria-label="Core strengths" className="mt-8 flex flex-wrap gap-2">
              {about.strengths.map((s) => (
                <li key={s} className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-white">
                  {s}
                </li>
              ))}
            </ul>
            <Link href="/services" className="link-underline mt-10 text-white">
              Explore our services
            </Link>
          </Reveal>
        </div>

        <h3 className="sr-only">Jnros Logistics in numbers</h3>
        <dl className="mt-14 grid grid-cols-2 gap-y-10 border-t border-white/10 pt-10 md:mt-16 lg:grid-cols-4">
          {stats.map((s) => (
            <Odometer key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </dl>
      </Container>
    </section>
  );
}

function Network() {
  return (
    <section aria-labelledby="network-heading" className="grain bg-navy-deep py-14 text-white md:py-20">
      <Blueprint />
      <Container className="relative">
        <SplitReveal id="network-heading" eyebrow={eyebrows.network} title={network.title} intro={network.intro} tone="dark" />
        <div className="mt-10 md:mt-14">
          <RoutesMap origin={network.origin} routes={network.routes} />
        </div>
      </Container>
    </section>
  );
}

function Services() {
  return (
    <section aria-labelledby="services-heading" className="bg-offwhite py-14 md:py-20">
      <Container>
        <SplitReveal id="services-heading" eyebrow={eyebrows.services} title="Our Services" intro={sectionIntros.services} />
        <Reveal as="ul" stagger={0.06} className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-5">
          {services.map((s) => (
            <RevealItem as="li" key={s.slug}>
              <ServiceCard service={s} href={`/services#${s.slug}`} tone="light" />
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function FeaturedWork() {
  return (
    <section aria-labelledby="work-heading" className="bg-offwhite pb-14 md:pb-20">
      <Container className="border-t border-navy/10 pt-14 md:pt-20">
        <SplitReveal id="work-heading" eyebrow={eyebrows.projects} title="Featured Project" intro={featuredProject.intro} />
        <div className="mt-10 md:mt-14">
          <ProjectHoverList items={featuredWork} />
        </div>
        <div className="mt-10">
          <ButtonLink href="/projects" variant="dark">
            See every photo
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="grain bg-navy py-14 text-white md:py-20">
      <Blueprint />
      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <SplitReveal id="why-heading" eyebrow={eyebrows.why} title={whyChooseUs.title} tone="dark" layout="stack" />
          <Reveal>
            {whyChooseUs.paragraphs.map((p, i) => (
              <p key={i} className="mt-5 max-w-prose text-steel">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.12} className="border-t border-white/10 lg:col-span-7">
          {whyChooseUs.features.map((f) => {
            const Icon = icons[f.icon];
            return (
              <RevealItem as="li" key={f.title} className="flex gap-5 border-b border-white/10 py-7 md:gap-6 md:py-8">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-navy-800 text-orange">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-h3">{f.title}</h3>
                  <p className="mt-2 max-w-prose text-steel">{f.description}</p>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
