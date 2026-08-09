<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="back-button" @click="goBack"> ← Back </ion-button>
        </ion-buttons>

        <ion-title> Your Cart </ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- CONTENT -->
    <ion-content>
      <!-- EMPTY CART -->
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>Choose some products to get started.</p>

        <ion-button @click="continueShopping"> Continue Shopping </ion-button>
      </div>

      <!-- CART -->
      <div v-else class="cart-container">
        <h1>Your Cart</h1>

        <!-- CART ITEMS -->
        <div class="cart-items">
          <div
            v-for="item in cartStore.items"
            :key="item.product_id"
            class="cart-item">
            <!-- IMAGE -->
            <div class="cart-image-container">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="cart-image" />

              <div v-else class="cart-no-image">No Image</div>
            </div>

            <!-- PRODUCT INFO -->
            <div class="cart-product-info">
              <h2>
                {{ item.name }}
              </h2>

              <p class="cart-sku">SKU: {{ item.sku }}</p>

              <p class="cart-price">
                {{ formatPrice(item.price) }}
              </p>
            </div>

            <!-- QUANTITY -->
            <div class="quantity-section">
              <ion-button
                class="quantity-button"
                @click="cartStore.decreaseQuantity(item.product_id)">
                −
              </ion-button>

              <span class="quantity">
                {{ item.quantity }}
              </span>

              <ion-button
                class="quantity-button"
                @click="cartStore.increaseQuantity(item.product_id)">
                +
              </ion-button>
            </div>

            <!-- ITEM TOTAL -->
            <div class="item-total">
              {{ formatPrice(item.price * item.quantity) }}
            </div>

            <!-- REMOVE -->
            <ion-button
              fill="clear"
              color="danger"
              class="remove-button"
              @click="removeItem(item.product_id)">
              🗑
            </ion-button>
          </div>
        </div>

        <!-- SUMMARY -->
        <div class="cart-summary">
          <div class="summary-row">
            <span> Items </span>

            <span>
              {{ cartStore.totalItems }}
            </span>
          </div>

          <div class="summary-row">
            <span> Subtotal </span>

            <span>
              {{ formatPrice(cartStore.totalPrice) }}
            </span>
          </div>

          <div class="summary-divider"></div>

          <div class="total-row">
            <span> TOTAL </span>

            <span>
              {{ formatPrice(cartStore.totalPrice) }}
            </span>
          </div>

          <!-- ACTIONS -->
          <div class="cart-actions">
            <ion-button fill="outline" size="large" @click="continueShopping">
              ← Continue Shopping
            </ion-button>

            <ion-button size="large" class="checkout-button" @click="checkout">
              Checkout →
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from "@ionic/vue";

import { useRouter } from "vue-router";

import { useCartStore } from "../stores/cart";

import "../assets/styles/cart.css";

const router = useRouter();

const cartStore = useCartStore();

function goBack() {
  router.back();
}

function continueShopping() {
  router.push("/home");
}

function removeItem(productId: number) {
  cartStore.removeFromCart(productId);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(price);
}

function checkout() {
  router.push("/checkout");
}
</script>
