import { HomePage } from "@/components/sites/roofseal/home/HomePage";
import { getHomeHotspots } from "@/lib/home-hotspots";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <HomePage hotspots={await getHomeHotspots()} />;
}
