import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import { RichText } from "@/components/sites/roofseal/shared/RichText";
import type { Resource } from "@/payload-types";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { MaterialTabs } from "./MaterialTabs";
import { splitMaterialContent } from "./material-content";
import styles from "./materials.module.css";

export function BluescopeMaterialsPage({ resource }: { resource: Resource }) {
  const { introduction, sections } = splitMaterialContent(resource.content);

  return <main>
    <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: "BlueScope Materials" }]} />
    <Banner title="BlueScope Materials" node="28352:1837" />
    <div className={`wide ${styles.body}`}>
      <div className={styles.overview}>
      <section className={styles.introduction}>
        <BlurHeading>Trusted Colouring and Coating Supplier for Roofing Materials in Malaysia</BlurHeading>
        {introduction ? <RichText data={introduction} /> : resource.excerpt && <p>{resource.excerpt}</p>}
      </section>
      {!!resource.materials?.length && <section className={styles.comparison} aria-labelledby="material-comparison-title">
        <BlurHeading id="material-comparison-title">Steel Supplied by BlueScope Malaysia</BlurHeading>
        <div className={styles.tableScroll} role="region" aria-label="Steel coating and warranty comparison" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Material</th><th scope="col">Coating mass</th><th scope="col">Warranty against perforation by corrosion</th></tr></thead>
            <tbody>{resource.materials.map((material) => <tr key={material.id || material.name}>
              <th scope="row">{material.name}</th><td>{material.coatingMass}</td><td>{material.warranty}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className={styles.note}>Coating and warranty information is reproduced from Roofseal’s materials guide. Actual warranty eligibility and terms are subject to confirmation with Roofseal.</p>
      </section>}
      </div>
      <MaterialTabs tabs={sections.map((section) => ({
        id: section.id,
        label: section.label,
        children: <>
          {section.content ? <RichText data={section.content} /> : <BlurHeading>{section.label} Steel</BlurHeading>}
          <figure className={styles.colourChart}>
            <a href={section.image} target="_blank" rel="noreferrer" aria-label={`Open full-size ${section.label} colour chart in a new tab`}>
              <img src={section.image} alt={section.alt} width={1811} height={2560} loading="lazy" />
            </a>
            <figcaption>{section.label} colour chart. Select the chart to view full size. Colours shown are for reference; confirm your selection with Roofseal.</figcaption>
          </figure>
        </>,
      }))} />
    </div>
    <Cta />
  </main>;
}
