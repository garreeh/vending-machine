<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title>My Cart</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="cart-container">

        <h1>Your Order</h1>

        <!-- Empty cart -->
        <div
          v-if="cartStore.items.length === 0"
          class="empty-cart"
        >
          <h2>Your cart is empty</h2>

          <ion-button @click="goHome">
            Browse Products
          </ion-button>
        </div>

        <!-- Cart items -->
        <div v-else>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >

            <img
              :src="item.image"
              :alt="item.name"
            />

            <div class="item-info">

              <h2>{{ item.name }}</h2>

              <p>
                ₱{{ item.price }}
              </p>

              <div class="quantity-controls">

                <ion-button
                  fill="outline"
                  @click="cartStore.decreaseQuantity(item.id)"
                >
                  −
                </ion-button>

                <span>
                  {{ item.quantity }}
                </span>

                <ion-button
                  fill="outline"
                  @click="cartStore.increaseQuantity(item.id)"
                >
                  +
                </ion-button>

              </div>

            </div>

            <div class="item-total">

              <strong>
                ₱{{ item.price * item.quantity }}
              </strong>

              <ion-button
                fill="clear"
                color="danger"
                @click="cartStore.removeFromCart(item.id)"
              >
                Remove
              </ion-button>

            </div>

          </div>

          <!-- Total -->
          <div class="cart-summary">

            <h2>Total</h2>

            <h1>
              ₱{{ cartStore.totalPrice }}
            </h1>

            <ion-button
              expand="block"
              size="large"
              @click="proceedToPayment"
            >
              Proceed to Payment
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
  IonButton
} from '@ionic/vue'

import { useRouter } from 'vue-router'

import { useCartStore } from '../stores/cart'


const router = useRouter()

const cartStore = useCartStore()


function goHome() {

  router.push('/home')

}


function proceedToPayment() {

  router.push('/payment')

}

</script>


<style scoped>

.cart-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}

h1 {
  text-align: center;
}

.empty-cart {
  text-align: center;
  margin-top: 80px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;

  padding: 20px;
  margin-bottom: 15px;

  background: white;

  border-radius: 15px;

  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.cart-item img {
  width: 120px;
  height: 120px;

  object-fit: cover;

  border-radius: 10px;
}

.item-info {
  flex: 1;
}

.item-info h2 {
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-controls span {
  font-size: 20px;
  font-weight: bold;
}

.item-total {
  text-align: right;
}

.item-total strong {
  font-size: 20px;
}

.cart-summary {
  margin-top: 30px;

  padding: 25px;

  border-radius: 15px;

  background: #f5f5f5;

  text-align: right;
}

.cart-summary h1 {
  font-size: 32px;
}

</style>