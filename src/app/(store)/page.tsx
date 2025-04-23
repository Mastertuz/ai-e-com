import ProductsView from "@/components/shared/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  
//   console.log(
//     `[${crypto.randomUUID().slice(0, 5)}] Rerendered the home page cache with ${products.length} products and ${categories.length} categories`
// );
  return (
    <div>
      <h1>hello world</h1>



      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories}/>
      </div>
    </div>
  );
}
