import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import styles from "./insulation-information.module.css";

/** Original supporting content requested in BugHerd #10. */
export function InsulationInformation() {
  return <section className={styles.information} aria-label="Roof insulation information">
    <div className={`narrow ${styles.columns}`}>
      <div>
        <BlurHeading>Why do we need <span>ROOFSEAL</span> Roof Insulation?</BlurHeading>
        <p>Insulating your building helps maintain a comfortable living environment by maintaining inside temperatures and reducing energy costs.</p>
        <p>Roof insulation creates a barrier to reduce the heat entering the building on a warm day.</p>
        <p>The majority of heat lost or gained is through the roof and exposed walls. These are the fundamental areas to insulate for a building that is comfortable yet cost and energy-efficient.</p>
      </div>
      <div>
        <BlurHeading>How effective is <span>ROOFSEAL</span> Roof Insulation?</BlurHeading>
        <p>With detailed and state-of-the-art technology production, ROOFSEAL Roof Insulation can reduce air-conditioning costs by up to 40% when installed correctly.</p>
        <p>Thus, by the usage of ROOFSEAL Roof Insulation in a longer period of time, the money saved through the reduction of energy consumption greatly outweighs the cost of insulation which essentially pays for itself.</p>
        <p><em>For more information regarding installation, kindly consult us.</em></p>
      </div>
      <img src="/sites/roofseal/shared/insulation-comparison.png" alt="Comparison showing heat entering an uninsulated roof and being reflected by roof insulation" />
    </div>
  </section>;
}
