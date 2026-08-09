<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" :disabled="processing">
            ← Back
          </ion-button>
        </ion-buttons>

        <ion-title> Payment </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="payment-container">
        <h1>Select Payment Method</h1>

        <!-- TOTAL -->

        <div class="total-card">
          <span> Total </span>

          <strong> ₱{{ cartStore.totalPrice.toFixed(2) }} </strong>
        </div>

        <!-- PAYMENT METHODS -->

        <div class="payment-methods">
          <ion-button
            expand="block"
            :fill="paymentMethod === 'cash' ? 'solid' : 'outline'"
            @click="paymentMethod = 'cash'"
            :disabled="processing">
            💵 Cash
          </ion-button>

          <ion-button
            expand="block"
            :fill="paymentMethod === 'gcash' ? 'solid' : 'outline'"
            @click="paymentMethod = 'gcash'"
            :disabled="processing">
            📱 GCash
          </ion-button>

          <ion-button
            expand="block"
            :fill="paymentMethod === 'card' ? 'solid' : 'outline'"
            @click="paymentMethod = 'card'"
            :disabled="processing">
            💳 Card
          </ion-button>
        </div>

        <!-- ERROR -->

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- PAY BUTTON -->

        <ion-button
          expand="block"
          size="large"
          class="pay-button"
          @click="processPayment"
          :disabled="!paymentMethod || processing">
          <ion-spinner v-if="processing" name="crescent" />

          <span v-else> Pay ₱{{ cartStore.totalPrice.toFixed(2) }} </span>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonSpinner,
} from "@ionic/vue";

import { useCartStore } from "@/stores/cart";

import { createOrder } from "@/services/orderService";

const router = useRouter();

const cartStore = useCartStore();

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const paymentMethod = ref<string>("");

const processing = ref(false);

const errorMessage = ref("");

/*
|--------------------------------------------------------------------------
| Static Machine Slots
|--------------------------------------------------------------------------
|
| Temporary configuration.
|
| We'll eventually move this to the database.
|
*/

const machineSlots: Record<number, number> = {
  22: 1,

  23: 2,

  24: 3,

  25: 4,

  26: 5,

  28: 6,

  29: 7,

  30: 8,
};

/*
|--------------------------------------------------------------------------
| Go Back
|--------------------------------------------------------------------------
*/

function goBack() {
  if (processing.value) {
    return;
  }

  router.back();
}

/*
|--------------------------------------------------------------------------
| Process Payment
|--------------------------------------------------------------------------
*/

async function processPayment() {
  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate requests
  |--------------------------------------------------------------------------
  */

  if (processing.value) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate payment method
  |--------------------------------------------------------------------------
  */

  if (!paymentMethod.value) {
    errorMessage.value = "Please select a payment method.";

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate cart
  |--------------------------------------------------------------------------
  */

  if (!cartStore.items || cartStore.items.length === 0) {
    errorMessage.value = "Your cart is empty.";

    return;
  }

  processing.value = true;

  errorMessage.value = "";

  try {
    /*
    |--------------------------------------------------------------------------
    | Build order items
    |--------------------------------------------------------------------------
    */

    const orderItems = cartStore.items.map((item) => {
      const productId = item.product_id;

      const machineSlot = machineSlots[productId];

      /*
        |--------------------------------------------------------------------------
        | Validate Machine Slot
        |--------------------------------------------------------------------------
        */

      if (!machineSlot) {
        throw new Error(`No machine slot configured for product ${productId}.`);
      }

      return {
        product_id: productId,

        quantity: item.quantity,

        machine_slot: machineSlot,
      };
    });

    /*
    |--------------------------------------------------------------------------
    | Create Order
    |--------------------------------------------------------------------------
    */

    console.log("Creating order:", {
      payment_method: paymentMethod.value,

      items: orderItems,
    });

    const result = await createOrder({
      payment_method: paymentMethod.value,

      items: orderItems,
    });

    /*
    |--------------------------------------------------------------------------
    | Check API response
    |--------------------------------------------------------------------------
    */

    if (!result.success) {
      throw new Error(result.message || "Unable to create order.");
    }

    /*
    |--------------------------------------------------------------------------
    | Order Created Successfully
    |--------------------------------------------------------------------------
    */

    console.log("ORDER CREATED:", result);

    /*
    |--------------------------------------------------------------------------
    | Save Order Information
    |--------------------------------------------------------------------------
    */

    sessionStorage.setItem(
      "lastOrder",
      JSON.stringify({
        order_id: result.order_id,

        order_reference: result.order_reference,

        total_amount: result.total_amount,

        payment_method: result.payment_method,

        payment_status: result.payment_status,

        order_status: result.order_status,
      }),
    );

    /*
    |--------------------------------------------------------------------------
    | Clear Cart
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Only clear the cart AFTER the API successfully
    | creates the order.
    |
    */

    cartStore.clearCart();

    /*
    |--------------------------------------------------------------------------
    | Go to Success Page
    |--------------------------------------------------------------------------
    */

    router.replace({
      path: "/payment-success",
    });
  } catch (error) {
    console.error("Payment / Order Error:", error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to process payment. Please try again.";
    }
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.payment-container h1 {
  text-align: center;
  margin-bottom: 24px;
}

.total-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 24px;

  margin-bottom: 24px;

  border-radius: 16px;

  background: #f5f5f5;
}

.total-card span {
  font-size: 18px;
}

.total-card strong {
  font-size: 28px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-bottom: 24px;
}

.pay-button {
  margin-top: 20px;

  height: 56px;

  font-size: 18px;
}

.error-message {
  padding: 14px;

  margin-bottom: 16px;

  border-radius: 10px;

  background: #ffe5e5;

  color: #c62828;

  text-align: center;
}
</style>
