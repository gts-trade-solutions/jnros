import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BackToTop, FooterWordmark } from "@/components/FooterMotion";
import { brandIcons } from "@/components/icons";
import { Logo, type LogoAsset } from "@/components/Logo";
import { Container, EmailText } from "@/components/ui";
import { nav, site, socialLinks, solutions } from "@/lib/data";

const heading = "font-display text-eyebrow font-semibold uppercase text-white";
const link = "text-sm text-steel transition-colors hover:text-white";

export function Footer({ logo }: { logo: LogoAsset | null }) {
  const socials = socialLinks.filter((s) => s.href);

  return (
    <footer className="grain bg-navy-deep text-white">
      <Container className="relative grid gap-10 pb-12 pt-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Jnros Logistics home" className="inline-block rounded-lg">
            <Logo logo={logo} />
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed text-steel">
            Engineered logistics across sea, air and inland transport, specialising in Project Cargo, Breakbulk, ODC and
            Heavy Lift, supported by global freight services.
          </p>
          {socials.length > 0 && (
            <ul className="mt-8 flex gap-3">
              {socials.map((s) => {
                const Icon = brandIcons[s.icon];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="grid size-11 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:border-orange hover:text-white"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <nav aria-labelledby="footer-links" className="lg:col-span-2">
          <h2 id="footer-links" className={heading}>
            Quick links
          </h2>
          <ul className="mt-5 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-solutions" className="lg:col-span-3">
          <h2 id="footer-solutions" className={heading}>
            Solutions
          </h2>
          <ul className="mt-5 space-y-3">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={heading}>Contact</h2>
          <ul className="mt-5 space-y-4 text-sm text-steel">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-white/70" aria-hidden="true" />
              <address className="not-italic leading-relaxed">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
            <li>
              <a href={site.phoneHref} className={`${link} flex gap-3`}>
                <Phone className="size-5 shrink-0 text-white/70" aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${link} flex gap-3`}>
                <Mail className="mt-0.5 size-5 shrink-0 text-white/70" aria-hidden="true" />
                <span>
                  <EmailText email={site.email} />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="relative flex items-center justify-between gap-6 border-t border-white/10 py-6 text-sm text-steel">
        <p>© 2026 Jnros Logistics. All Rights Reserved.</p>
        <BackToTop />
      </Container>

      <Container className="relative">
        <FooterWordmark text="JNROS" />
      </Container>
    </footer>
  );
}
