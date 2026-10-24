import Image from "next/image";
import { SplitReveal } from "@/components/SplitReveal";
import { Container } from "@/components/ui";
import type { SiteImage } from "@/lib/data";

/** Dark photo banner that opens each sub-page. */
export function PageBanner({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: SiteImage;
}) {
  return (
    <section data-hero className="grain relative isolate bg-navy text-white">
      <div className="photo absolute inset-0 -z-20">
        <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
      <Container className="relative flex min-h-[24rem] flex-col justify-end pb-12 pt-32 md:min-h-[28rem] md:pb-16">
        <SplitReveal
          as="h1"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          tone="dark"
          layout="stack"
          size="page"
          above
        />
      </Container>
    </section>
  );
}
