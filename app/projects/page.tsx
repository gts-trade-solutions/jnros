import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { PageBanner } from "@/components/PageBanner";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { SplitReveal } from "@/components/SplitReveal";
import { Container } from "@/components/ui";
import { featuredProject, gallery, projectPhotos, projectStages } from "@/lib/data";

const description =
  "Recent project cargo work by Jnros Logistics, including a fleet of BH50M mining dump trucks staged, loaded, lashed and shipped by barge.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Jnros Logistics",
    description,
    images: [{ url: gallery[1].src, width: gallery[1].width, height: gallery[1].height, alt: gallery[1].alt }],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Projects"
        title="Our Recent Work"
        intro="Project cargo documented on the job, from yard staging to final transit."
        image={gallery[5]}
      />

      <section aria-labelledby="project-heading" className="bg-offwhite py-14 md:py-20">
        <Container>
          <SplitReveal
            id="project-heading"
            eyebrow="01 / Featured project"
            title={featuredProject.title}
            intro={featuredProject.intro}
          />
          <div className="mt-10 md:mt-14">
            <ProjectsGrid photos={projectPhotos} stages={projectStages} />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
