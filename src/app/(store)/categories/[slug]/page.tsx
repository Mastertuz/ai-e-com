import ProductsView from "@/components/shared/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getproductsByCategory";

async function CategoryPage(
    
    { params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    const products = await getProductsByCategory(slug);
    const categories = await getAllCategories();

    return (
        <div className="flex flex-col items-center justify-top min-h-screen  p-4">
            <div className=" p-8 rounded-lg  w-full ">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">
                    {slug
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")} collection
                </h1>
                <ProductsView products={products} categories={categories} />
            </div>
        </div>
    );
}

export default CategoryPage;