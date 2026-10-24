import { Blueprint, ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section data-hero className="grain relative isolate flex min-h-[80svh] items-end bg-navy text-white">
      <Blueprint />
      <Container className="relative pb-20 pt-40">
        <p className="font-condensed text-wordmark text-orange">404</p>
        <h1 className="mt-4 font-display text-hero">
          Page not found
        </h1>
        <p className="mt-5 max-w-prose text-white/80">
          The page you&apos;re looking for has moved or doesn&apos;t exist. Head back home or browse our services.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            Our Services
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
