import { Phone } from "lucide-react";
import { ImageReveal } from "@/components/ImageReveal";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Container } from "@/components/ui";
import { cta, images, site } from "@/lib/data";

/**
 * Inset rather than full-bleed: the source photo is only 719px wide,
 * so a contained banner with a heavy overlay keeps it from looking soft.
 */
export function CtaBanner() {
  return (
    <section aria-labelledby="cta-heading" className="bg-offwhite py-14 md:py-20">
      <Container>
        <div className="grain relative isolate overflow-hidden rounded-3xl bg-navy px-6 py-12 text-white sm:px-12 md:px-16 md:py-16">
          <ImageReveal
            image={images.ctaBanner}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="absolute inset-0 -z-20"
            imageClassName="object-[70%_50%]"
          />
          <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
          <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />

          <Reveal className="relative max-w-2xl">
            <h2 id="cta-heading" className="font-display text-h2">
              {cta.title}
            </h2>
            <p className="mt-4 max-w-prose text-white/80">{cta.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">{cta.button}</ButtonLink>
              <ButtonLink href={site.phoneHref} variant="ghost" arrow={false}>
                <Phone className="size-4" aria-hidden="true" />
                {site.phone}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
