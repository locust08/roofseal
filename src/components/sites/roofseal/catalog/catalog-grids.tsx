import Link from "next/link";
import { CategoryCard } from "../shared/ui";
import type { CategoryView, ProductCardView } from "@/cms/view-models";
import styles from "./catalog.module.css";
export function CategoryGrid({ categories, columns = 3, variant }: { categories: CategoryView[]; columns?: 3 | 4; variant?: "insulation" }) {
  const insulationImages: Record<string, string> = {
    "glass-wool-insulation-supplier-malaysia": "glasswool",
    "rockwool-insulation-supplier-malaysia": "rockwool",
    "aluminium-foil-insulation-malaysia": "aluminium-foil",
    "roofing-mesh": "roofing-mesh",
  };
  return (
    <div className={`${styles.categories} ${columns === 4 ? styles.fourColumns : ""} ${variant === "insulation" ? styles.insulationCards : ""}`}>
      {categories.map((category) => (
          <CategoryCard
            key={category.id}
            image={variant === "insulation" && insulationImages[category.slug] ? `/sites/roofseal/insulation/${insulationImages[category.slug]}.webp` : category.image}
            title={category.name}
            href={category.href}
          />
      ))}
    </div>
  );
}
export function ProductGrid({ products }: { products: ProductCardView[] }) {
  return (
    <div className={styles.products}>
      {products.map((product) => (
        <Link className={styles.product} key={product.id} href={product.href}>
            <img src={product.image} alt={product.title} />
            <div className={styles.productCopy}>
              <span>{product.category}</span>
              <h3>{product.title}</h3>
            </div>
        </Link>
      ))}
    </div>
  );
}
