<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vending Machine</ion-title>

        <ion-button @click="goToCart">
          🛒 {{ cartStore.totalItems }}
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <h1>Choose Your Product</h1>

        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <img :src="product.image" :alt="product.name" />

            <h2>{{ product.name }}</h2>

            <p class="price">₱{{ product.price }}</p>

            <ion-button
              expand="block"
              @click="cartStore.addToCart(product)"
            >
              Add to Cart
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from "@ionic/vue";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

function goToCart() {
  router.push('/cart')
}

const products = ref<Product[]>([
  {
    id: 1,
    name: "Protein Shake",
    price: 120,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "Energy Drink",
    price: 80,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "Protein Bar",
    price: 100,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    name: "Water",
    price: 40,
    image: "https://via.placeholder.com/300",
  },
]);

import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

</script>

<style scoped>
.page-container {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.product-card {
  border-radius: 15px;
  padding: 15px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.product-card img {
  width: 100%;
  border-radius: 10px;
}

.product-card h2 {
  font-size: 18px;
  margin-top: 10px;
}

.price {
  font-size: 20px;
  font-weight: bold;
}
</style>
