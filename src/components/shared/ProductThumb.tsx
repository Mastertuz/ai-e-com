import Link from "next/link";
import { Product } from "../../../sanity.types";
import Image from "next/image";
import { urlFor } from "@/lib/imageUrl";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`
        border border-gray-300 p-4 w-[220px] rounded-[40px]   transition-transform duration-200 ease-in-out cursor-pointer
         bg-white
        group flex flex-col shadow-sm hover:shadow-md overflow-hidden ${
        isOutOfStock ? "opacity-50" : ""
      }`}
    >
      <div className="relative aspect-square size-full overflow-hidden">
        {product.image && (
          <Image
            className="object-contain  transition-transform duration-300 group-hover:scale-105"
            src={urlFor(product.image).url()}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-black font-extrabold">
        ${product.price}
        </p>
      </div>
    </Link>
  );
}

export default ProductThumb;
