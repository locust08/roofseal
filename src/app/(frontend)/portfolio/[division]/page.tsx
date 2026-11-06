import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banner, Breadcrumbs, Cta } from "@/components/sites/roofseal/shared/ui";
import { getPortfolioDivision, portfolioDivisions } from "@/components/sites/roofseal/portfolio/projects";
import styles from "@/components/sites/roofseal/portfolio/portfolio.module.css";

type Props = { params: Promise<{ division: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const division = getPortfolioDivision((await params).division);
  return { title: `${division?.title || "Portfolio"} Projects | Roofseal` };
}
export default async function PortfolioPage({ params }: Props) {
  const division = getPortfolioDivision((await params).division);
  if (!division) notFound();
  return <main>
    <Breadcrumbs items={[{ label: "Portfolio", href: "/#projects" }, { label: division.title }]} />
    <Banner title={`${division.title} Projects`} node="28352:1837" />
    <section className={`wide ${styles.portfolio}`}>
      <BlurHeading>Projects Across Malaysia</BlurHeading>
      <p>Explore Roofseal’s {division.title.toLowerCase()} projects for residential, commercial and industrial developments across Malaysia.</p>
      <nav aria-label="Portfolio division" className={styles.filters}>
        {portfolioDivisions.map(item => <Link key={item.slug} href={`/portfolio/${item.slug}`} aria-current={item.slug === division.slug ? "page" : undefined}>{item.title}</Link>)}
      </nav>
      <div className={styles.grid}>
        {division.projects.map(project => <article data-fade key={project.title}>
          <img src={project.image} alt={project.title} />
          <div><h3>{project.title}</h3><p>{project.location}</p></div>
        </article>)}
      </div>
    </section>
    <Cta />
  </main>;
}
