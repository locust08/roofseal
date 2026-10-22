import Link from "next/link";
import { CategoryCard } from "../shared/ui";
import type { CategoryView, ProductCardView } from "@/cms/view-models";
import styles from "./catalog.module.css";
export function CategoryGrid({ categories }: { categories: CategoryView[] }) {
  return (
    <div className={styles.categories}>
      {categories.map((category) => (
          <CategoryCard
            key={category.id}
            image={category.image}
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
