<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title> Vending Machine </ion-title>

        <ion-buttons slot="end">
          <ion-button class="cart-button" @click="goToCart">
            <span class="cart-icon">🛒</span>

            <span class="cart-text"> Cart </span>

            <span v-if="cartStore.totalItems > 0" class="cart-count">
              {{ cartStore.totalItems }}
            </span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <!-- CONTENT -->
    <ion-content>
      <div class="page-container">
        <h1>Choose Your Product</h1>

        <!-- LOADING PRODUCTS -->
        <div v-if="loading" class="status-message">Loading products...</div>

        <!-- ERROR -->
        <div v-else-if="error" class="status-message error">
          <p>{{ error }}</p>

          <ion-button size="small" @click="loadProducts"> Retry </ion-button>
        </div>

        <!-- PRODUCTS -->
        <div v-else class="product-grid">
          <div
            v-for="product in products"
            :key="product.product_id"
            class="product-card">
            <!-- IMAGE -->
            <div class="product-image-container">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="product-image" />

              <div v-else class="no-image">No Image</div>
            </div>

            <!-- PRODUCT INFO -->
            <div class="product-info">
              <h2>
                {{ product.name }}
              </h2>

              <p v-if="product.description" class="description">
                {{ product.description }}
              </p>

              <p class="price">
                {{ formatPrice(product.price) }}
              </p>

              <!-- ADD TO CART -->
              <ion-button
                expand="block"
                class="add-button"
                :disabled="addingProductId === product.product_id"
                @click="addProductToCart(product)">
                <!-- LOADING -->
                <ion-spinner
                  v-if="addingProductId === product.product_id"
                  name="crescent" />

                <!-- NORMAL -->
                <span v-else> Add to Cart </span>
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- ADD TO CART TOAST -->
    <ion-toast
      :is-open="toastOpen"
      :message="toastMessage"
      :duration="1800"
      position="top"
      :buttons="toastButtons"
      @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonToast,
  IonSpinner,
} from "@ionic/vue";

import { useRouter } from "vue-router";

import { useCartStore } from "../stores/cart";

import api from "../services/api";

import "../assets/styles/home.css";

/*
|--------------------------------------------------------------------------
| Product Interface
|--------------------------------------------------------------------------
*/

interface Product {
  product_id: number;

  name: string;

  description: string;

  image: string;

  sku: string;

  price: number;
}

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const router = useRouter();

/*
|--------------------------------------------------------------------------
| Cart Store
|--------------------------------------------------------------------------
*/

const cartStore = useCartStore();

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

const products = ref<Product[]>([]);

/*
|--------------------------------------------------------------------------
| Loading / Error
|--------------------------------------------------------------------------
*/

const loading = ref(true);

const error = ref("");

/*
|--------------------------------------------------------------------------
| Add To Cart Loading
|--------------------------------------------------------------------------
|
| Stores the product_id currently being added.
|
*/

const addingProductId = ref<number | null>(null);

/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

const toastOpen = ref(false);

const toastMessage = ref("");

/*
|--------------------------------------------------------------------------
| Toast Buttons
|--------------------------------------------------------------------------
*/

const toastButtons = [
  {
    text: "View Cart",
    handler: () => {
      goToCart();
    },
  },
];

/*
|--------------------------------------------------------------------------
| Load Products
|--------------------------------------------------------------------------
*/

async function loadProducts() {
  try {
    loading.value = true;

    error.value = "";

    const response = await api.get("/products.php");

    console.log("API RESPONSE:", response.data);

    products.value = response.data;
  } catch (err) {
    console.error("Failed to load products:", err);

    error.value = "Unable to load products.";
  } finally {
    loading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| Add Product To Cart
|--------------------------------------------------------------------------
*/

async function addProductToCart(product: Product) {
  /*
   * Prevent duplicate clicks
   */

  if (addingProductId.value !== null) {
    return;
  }

  /*
   * Start loading
   */

  addingProductId.value = product.product_id;

  /*
   * Small delay so the user
   * can see the loading animation.
   */

  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });

  /*
   * Add product to Pinia cart
   */

  cartStore.addToCart(product);

  /*
   * Show toast
   */

  toastMessage.value = `${product.name} added to cart`;

  toastOpen.value = true;

  /*
   * Stop loading
   */

  addingProductId.value = null;
}

/*
|--------------------------------------------------------------------------
| Format Price
|--------------------------------------------------------------------------
*/

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(price);
}

/*
|--------------------------------------------------------------------------
| Go To Cart
|--------------------------------------------------------------------------
*/

function goToCart() {
  router.push("/cart");
}

/*
|--------------------------------------------------------------------------
| Initial Load
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadProducts();
});
</script>
