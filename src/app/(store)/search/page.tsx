import ProductGrid from "@/components/shared/ProductGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";

async function Searchpage({
  searchParams,
}: {
  searchParams: Promise<{
    query: string;
  }>;
}) {
  const { query } = await searchParams;
  const products = await searchProductsByName(query);
  
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen p-4">
        <div className="p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for: {query}
          </h1>
          <p className="text-gray-600 text-center">
            Try searching with different keywords
          </p>
        </div>
      </div>
    );
  }


return (
  <div className="flex flex-col items-center justify-top min-h-screen  p-4">
    <div className="p-8 rounded-lg w-full ">
      <h1 className="text-3xl font-bold mb-12 text-center text-white">
        Search results for {query}
      </h1>
      <ProductGrid products={products} />
    </div>
  </div>
);
}

export default Searchpage;
