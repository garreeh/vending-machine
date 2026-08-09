import { defineStore } from "pinia";

export interface Product {
  product_id: number;
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    totalPrice: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },
  },

  actions: {
    addToCart(product: Product) {
      const existingItem = this.items.find(
        (item) => item.product_id === product.product_id,
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(
        (item) => item.product_id === productId,
      );

      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    increaseQuantity(productId: number) {
      const item = this.items.find((item) => item.product_id === productId);

      if (item) {
        item.quantity++;
      }
    },

    decreaseQuantity(productId: number) {
      const item = this.items.find((item) => item.product_id === productId);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(productId);
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
