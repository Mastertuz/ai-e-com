import AddToBasketButton from "@/components/shared/addToBasketButton";
import { urlFor } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 60;
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getSimilarProductName(productName: string): Promise<{ name: string; image: string; link: string } | null> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: "user",
        content: `Suggest a similar product to "${productName}" and return only an object that contains name and link that will lead to google search page of that product. Don't send any text in response, just the object.`,
      },
    ],
  });

  try {
    const responseContent = completion.choices[0].message.content ?? "{}";

    // Validate if the response is valid JSON
    if (!responseContent.trim().startsWith("{") || !responseContent.trim().endsWith("}")) {
      console.error("Invalid AI response format:", responseContent);
      return null;
    }

    const similarProduct = JSON.parse(responseContent);
    return similarProduct;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return null;
  }
}

async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  let similar = null;

  // Fetch and log similar product name
  if (product.name) {
    similar = await getSimilarProductName(product.name);
    console.log(similar);
  }

  const isOutOfStock = product?.stock != null && product?.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer${
            isOutOfStock ? "opacity-50" : ""
          }`}
        >
          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={product.name ?? "Product image"}
              fill
              className="object-contain max-w-2xl transition-transform duration-300 hover:scale-105"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl text-white font-bold mb-4">{product.name}</h1>
            <div className="text-xl text-white font-semibold mb-4">
              Price : £{product.price?.toFixed(2)}
            </div>
            <div className="prose text-white max-w-none mb-6">
              {Array.isArray(product.description) && <PortableText value={product.description} />}
            </div>
          </div>
          <div className="text-white text-3xl mb-6">
            AI similar product for {product.name}:
          </div>
          {similar && similar.name  && similar.link ? (
            <div className="border rounded-lg p-4 bg-gray-800">
              <a href={similar.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4">
                <div>
                  <h2 className="text-lg text-white font-bold underline">{similar.name}</h2>
                </div>
              </a>
            </div>
          ) : (
            <div className="text-white text-lg">No similar product found.</div>
          )}
          <div className="mb-6">
            <div className="text-white text-xl mb-2">
              Items available: <span className="font-bold">{product.stock}</span>
            </div>
            <div className="text-lg text-white font-semibold mb-2">Quantity</div>
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;