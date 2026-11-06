import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import type { Metadata } from "next";
import { Banner, Breadcrumbs, Cta, DiagonalButton } from "@/components/sites/roofseal/shared/ui";
import styles from "@/components/sites/roofseal/career/career.module.css";
import { getCareerPositions } from "@/lib/cms-content";

export const metadata: Metadata = { title: "Careers", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const positions = await getCareerPositions();
  const listItems = (text: string) => text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  return <main>
    <Breadcrumbs items={[{ label: "Careers" }]} />
    <Banner title="Careers at Roofseal" node="28352:1837" />
    <div className={`wide ${styles.body}`}>
      <section className={styles.intro}>
        <BlurHeading>Build Your Future with Roofseal</BlurHeading>
        <p>Roofseal manufactures and supplies metal roofing, doors and frames for residential, commercial and industrial projects across Malaysia. Explore the people and skills behind our building solutions.</p>
      </section>
      <section className={styles.section} aria-labelledby="career-culture">
        <BlurHeading id="career-culture">Working with Roofseal</BlurHeading>
        <p>Our people commitments include a safe workplace, workforce development and ethical business practices.</p>
        <div className={styles.benefits}>
          <article data-fade><span>01</span><h3>Safety at Work</h3><p>A commitment to a safe and healthy working environment.</p></article>
          <article data-fade><span>02</span><h3>Learning &amp; Development</h3><p>A focus on training, skills improvement and workforce development.</p></article>
          <article data-fade><span>03</span><h3>Responsible Business</h3><p>Ethical practices, accountability and continuous improvement.</p></article>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="career-openings">
        <BlurHeading id="career-openings">Available Positions</BlurHeading>
        {positions.length ? <div className={styles.positions}>{positions.map((position) => <details data-fade key={position.id} className={styles.position} id={`position-${position.slug}`}>
          <summary><span><strong>{position.title}</strong><span className={styles.positionMeta}>{[position.department, position.location, position.employmentType].filter(Boolean).join(" · ")}</span></span><span className={styles.expand} aria-hidden="true">+</span></summary>
          <div className={styles.positionBody}>
            <p>{position.summary}</p>
            <h3>Job Description</h3><p className={styles.description}>{position.description}</p>
            <h3>Job Scope</h3><ul>{listItems(position.responsibilities).map((item, index) => <li key={index}>{item}</li>)}</ul>
            <h3>Requirements</h3><ul>{listItems(position.requirements).map((item, index) => <li key={index}>{item}</li>)}</ul>
            <p className={styles.closed}>Applications are currently closed.</p>
          </div>
        </details>)}</div> : <div className={styles.empty}><h3>No positions available at the moment</h3><p>Please check back for future opportunities.</p></div>}
      </section>
      <section className={`${styles.section} ${styles.application}`} aria-labelledby="career-apply">
        <div><BlurHeading id="career-apply">Apply for a Position</BlurHeading><p>Applications are currently closed.</p></div>
        <form aria-label="Job application" aria-describedby="career-closed">
          <p id="career-closed" className={styles.closed}>Applications are currently closed.</p>
          <fieldset disabled>
            <legend>Application details</legend>
            <label>Position<select name="position" required defaultValue=""><option value="">Applications are closed</option>{positions.map((position) => <option key={position.id} value={position.slug}>{position.title}</option>)}</select></label>
            <label>Full name<input name="name" autoComplete="name" required /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label>Message<textarea name="message" rows={4} /></label>
            <label>Resume (required)<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
            <DiagonalButton disabled>Applications Closed</DiagonalButton>
          </fieldset>
        </form>
      </section>
    </div>
    <Cta />
  </main>;
}
