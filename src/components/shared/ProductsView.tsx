import { Category, Product } from "../../../sanity.types";
import { CategorySelectorComponent } from "./category-selector";
import ProductGrid from "./ProductGrid";


interface ProductsViewProps {
    products: Product[]
    categories:Category[]
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
    return (
        <div className="flex flex-col ">
            {/* Categories section */}
            <div className="w-full sm:w-[200px] mb-6">
                <CategorySelectorComponent categories={categories} />
            </div>

            {/* Products section */}
            <div className="flex-1">
                <div>
                    <ProductGrid products={products} />
                </div>
            </div>
        </div>
    );
};

export default ProductsView;