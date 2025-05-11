import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../sanity.types';

export interface BasketItem {
    product: Product;
    quantity: number;
}

interface BasketState {
    items: BasketItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    clearBasket: () => void;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
    getGroupedItems: () => BasketItem[];
}

const useBasketStore = create<BasketState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity = 1) => set((state) => {
                const existingItem = state.items.find(item => item.product._id === product._id);
                const currentQuantity = existingItem ? existingItem.quantity : 0;
                const stock = product.stock ?? 0;

                if (currentQuantity + quantity > stock) {
                    return state; // Prevent adding if quantity would exceed stock
                }

                // Update product stock
                const updatedProduct = { ...product, stock: stock - quantity };

                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.product._id === product._id
                                ? { ...item, product: updatedProduct, quantity: item.quantity + quantity }
                                : item
                        ),
                    };
                } else {
                    return { items: [...state.items, { product: updatedProduct, quantity }] };
                }
            }),
            removeItem: (productId) => set((state) => {
                const itemToRemove = state.items.find(item => item.product._id === productId);
                if (!itemToRemove) return state;

                // Restore one unit to product stock
                const updatedProduct = { ...itemToRemove.product, stock: (itemToRemove.product.stock ?? 0) + 1 };

                return {
                    items: state.items.reduce((acc, item) => {
                        if (item.product._id === productId) {
                            if (item.quantity > 1) {
                                acc.push({ ...item, product: updatedProduct, quantity: item.quantity - 1 });
                            }
                        } else {
                            acc.push(item);
                        }
                        return acc;
                    }, [] as BasketItem[]),
                };
            }),
            clearBasket: () => set({ items: [] }),
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0);
            },
            getItemCount: (productId) => {
                const item = get().items.find((item) => item.product._id === productId);
                return item?.quantity ?? 0;
            },
            getGroupedItems: () => get().items,
        }),
        {
            name: "basket-store",
        }
    )
);

export default useBasketStore;