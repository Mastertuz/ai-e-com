import { formatCurrency } from "@/lib/formatCurrency";
import { urlFor } from "@/lib/imageUrl";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

async function Orders() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const orders = await getMyOrders(userId);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className=" p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-8">My Orders</h1>
        <div>
          {orders.length === 0 ? (
            <div className="text-center text-white">
              <p>You have not placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {orders.map((order, orderIndex) => (
                <div
                  key={`${order.orderNumber}-${orderIndex}`} // Ensure unique key for orders
                  className="border border-blue-500 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-blue-500">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
                      <div>
                        <p className="text-sm text-white mb-1 font-bold">Order Number</p>
                        <p className="font-mono text-sm text-green-600 break-all">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-white mb-1">Order Date</p>
                        <p className="font-medium text-white">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center p-4 sm:p-6">
                    <div className="flex items-center">
                      <span className="text-sm mr-2 text-white">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "paid"
                            ? "bg-green-800 text-white"
                            : "bg-red-800 text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-white mb-1">Total Amount</p>
                      <p className="font-bold text-lg text-white">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {order.amountDiscount ? (
                    <div className="mt-4 p-3 sm:p-4 bg-blue-500 rounded-lg mx-4 sm:mx-6">
                      <p className="text-green-200 font-medium mb-1 text-sm sm:text-base">
                        Discount Applied:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-sm text-white">
                        Original Subtotal:{" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}

                  <div className="px-4 py-3 sm:px-6 sm:py-4">
                    <p className="text-sm font-semibold text-white mb-3 sm:mb-4">
                      Order Items
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      {order.products?.map((product, productIndex) => (
                        <div
                          key={`${product.product?._id}-${productIndex}`} // Ensure unique key for products
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b border-blue-500 last:border-b-0"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 w-full">
                            {product.product?.image && (
                              <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={urlFor(product.product.image).url()}
                                  alt={product.product?.name ?? ""}
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm sm:text-base text-white">
                                  {product.product?.name}
                                </p>
                                <p className="text-sm text-white">
                                  Quantity: {product.quantity ?? "N/A"}
                                </p>
                              </div>
                              <p className="font-medium">
                                {product.product?.price && product.quantity
                                  ? formatCurrency(
                                      product.product.price * product.quantity,
                                      order.currency
                                    )
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;