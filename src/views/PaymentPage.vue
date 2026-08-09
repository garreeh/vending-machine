<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title>Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="payment-container">

        <h1>Select Payment Method</h1>

        <p class="total">
          Total: ₱{{ cartStore.totalPrice }}
        </p>

        <div class="payment-options">

          <ion-button
            expand="block"
            size="large"
            @click="selectPayment('cash')"
          >
            💵 Cash
          </ion-button>

          <ion-button
            expand="block"
            size="large"
            @click="selectPayment('card')"
          >
            💳 Card
          </ion-button>

          <ion-button
            expand="block"
            size="large"
            @click="selectPayment('gcash')"
          >
            📱 GCash
          </ion-button>

          <!-- <ion-button
            expand="block"
            size="large"
            @click="selectPayment('apple_pay')"
          >
             Apple Pay
          </ion-button> -->

          <!-- <ion-button
            expand="block"
            size="large"
            @click="selectPayment('google_pay')"
          >
            G Google Pay
          </ion-button> -->

        </div>

        <ion-button
          fill="clear"
          @click="goBack"
        >
          ← Back to Cart
        </ion-button>

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


function selectPayment(method: string) {

  console.log('Selected payment:', method)

  // For now, we're only simulating payment.
  // We will connect the real payment system later.

  router.push('/dispensing')

}


function goBack() {

  router.push('/cart')

}

</script>

<style scoped>

ion-content {
  --background: #f5f5f5;
}

.payment-container {

  max-width: 600px;
  margin: auto;
  padding: 30px;
  text-align: center;

}

.payment-container h1 {

  font-size: 32px;
  margin-bottom: 10px;

}

.total {

  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;

}

.payment-options {

  display: flex;
  flex-direction: column;
  gap: 15px;

}

.payment-options ion-button {

  height: 70px;
  font-size: 20px;

}

</style>