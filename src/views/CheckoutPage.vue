<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack" :disabled="processing">
            ← Back
          </ion-button>
        </ion-buttons>

        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content>
      <div class="checkout-container">
        <h1>Review Your Order</h1>

        <!-- ORDER ITEMS -->
        <div class="checkout-items">
          <div
            v-for="item in cartStore.items"
            :key="item.product_id"
            class="checkout-item">
            <!-- IMAGE -->
            <div class="checkout-image-container">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="checkout-image" />

              <div v-else class="checkout-no-image">No Image</div>
            </div>

            <!-- PRODUCT -->
            <div class="checkout-product">
              <h2>
                {{ item.name }}
              </h2>

              <p>Quantity: {{ item.quantity }}</p>

              <span> {{ formatPrice(item.price) }} each </span>
            </div>

            <!-- TOTAL -->
            <div class="checkout-item-total">
              {{ formatPrice(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="checkout-summary">
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
        </div>

        <!-- PAYMENT METHOD -->
        <div class="payment-section">
          <h2>Payment Method</h2>

          <p class="payment-description">Select how you would like to pay.</p>

          <div class="payment-methods">
            <!-- CASH -->
            <button
              type="button"
              class="payment-method"
              :class="{
                selected: selectedPayment === 'cash',
              }"
              :disabled="processing"
              @click="selectPayment('cash')">
              <span class="payment-icon"> 💵 </span>

              <span class="payment-name"> Cash </span>

              <span v-if="selectedPayment === 'cash'" class="selected-check">
                ✓
              </span>
            </button>

            <!-- GCASH -->
            <button
              type="button"
              class="payment-method"
              :class="{
                selected: selectedPayment === 'gcash',
              }"
              :disabled="processing"
              @click="selectPayment('gcash')">
              <span class="payment-icon"> 📱 </span>

              <span class="payment-name"> GCash </span>

              <span v-if="selectedPayment === 'gcash'" class="selected-check">
                ✓
              </span>
            </button>

            <!-- CARD -->
            <button
              type="button"
              class="payment-method"
              :class="{
                selected: selectedPayment === 'card',
              }"
              :disabled="processing"
              @click="selectPayment('card')">
              <span class="payment-icon"> 💳 </span>

              <span class="payment-name"> Card </span>

              <span v-if="selectedPayment === 'card'" class="selected-check">
                ✓
              </span>
            </button>
          </div>
        </div>

        <!-- ERROR -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- ACTIONS -->
        <div class="checkout-actions">
          <ion-button
            type="button"
            fill="outline"
            size="large"
            :disabled="processing"
            @click="goBack">
            ← Back to Cart
          </ion-button>

          <ion-button
            type="button"
            size="large"
            class="payment-button"
            :disabled="
              !selectedPayment || processing || cartStore.items.length === 0
            "
            @click.prevent="proceedToPayment">
            <ion-spinner v-if="processing" name="crescent" />

            <span v-else> Proceed to Payment → </span>
          </ion-button>
        </div>
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
import "../assets/styles/checkout.css";
import { createOrder } from "@/services/orderService";

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
| State
|--------------------------------------------------------------------------
*/

const selectedPayment = ref<string>("");

const processing = ref<boolean>(false);

const errorMessage = ref<string>("");

/*
|--------------------------------------------------------------------------
| Machine Slot Mapping
|--------------------------------------------------------------------------
|
| Temporary static mapping.
|
| Product ID -> Machine Slot
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
| Format Price
|--------------------------------------------------------------------------
*/

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price || 0));
}

/*
|--------------------------------------------------------------------------
| Select Payment
|--------------------------------------------------------------------------
*/

function selectPayment(method: string) {
  /*
  |--------------------------------------------------------------------------
  | Don't allow changing payment while processing
  |--------------------------------------------------------------------------
  */

  if (processing.value) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Set payment method
  |--------------------------------------------------------------------------
  */

  selectedPayment.value = method;

  /*
  |--------------------------------------------------------------------------
  | Clear previous error
  |--------------------------------------------------------------------------
  */

  errorMessage.value = "";
}

/*
|--------------------------------------------------------------------------
| Go Back
|--------------------------------------------------------------------------
*/

function goBack() {
  /*
  |--------------------------------------------------------------------------
  | Don't navigate while order is processing
  |--------------------------------------------------------------------------
  */

  if (processing.value) {
    return;
  }

  router.back();
}

/*
|--------------------------------------------------------------------------
| Proceed To Payment
|--------------------------------------------------------------------------
*/

async function proceedToPayment(event?: Event) {
  /*
  |--------------------------------------------------------------------------
  | Prevent browser form submission
  |--------------------------------------------------------------------------
  */

  if (event) {
    event.preventDefault();
  }

  if (processing.value) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Payment Method
  |--------------------------------------------------------------------------
  */

  if (!selectedPayment.value) {
    errorMessage.value = "Please select a payment method.";

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Cart
  |--------------------------------------------------------------------------
  */

  if (!cartStore.items || cartStore.items.length === 0) {
    errorMessage.value = "Your cart is empty.";

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Start Processing
  |--------------------------------------------------------------------------
  */

  processing.value = true;

  errorMessage.value = "";

  try {
    /*
    |--------------------------------------------------------------------------
    | Build Order Items
    |--------------------------------------------------------------------------
    */

    const orderItems = cartStore.items.map((item) => {
      /*
        |--------------------------------------------------------------------------
        | Product ID
        |--------------------------------------------------------------------------
        */

      const productId = Number(item.product_id);

      /*
        |--------------------------------------------------------------------------
        | Quantity
        |--------------------------------------------------------------------------
        */

      const quantity = Number(item.quantity);

      /*
        |--------------------------------------------------------------------------
        | Find Machine Slot
        |--------------------------------------------------------------------------
        */

      const machineSlot = machineSlots[productId];

      /*
        |--------------------------------------------------------------------------
        | Validate Machine Slot
        |--------------------------------------------------------------------------
        */

      if (!machineSlot) {
        throw new Error(`No machine slot configured for ${item.name}.`);
      }

      /*
        |--------------------------------------------------------------------------
        | Validate Quantity
        |--------------------------------------------------------------------------
        */

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for ${item.name}.`);
      }

      /*
        |--------------------------------------------------------------------------
        | Return API Item
        |--------------------------------------------------------------------------
        */

      return {
        product_id: productId,

        quantity: quantity,

        machine_slot: machineSlot,
      };
    });

    /*
    |--------------------------------------------------------------------------
    | Log Request
    |--------------------------------------------------------------------------
    */

    console.log("Creating vending machine order...", {
      payment_method: selectedPayment.value,

      items: orderItems,
    });

    /*
    |--------------------------------------------------------------------------
    | Send Order To Backend
    |--------------------------------------------------------------------------
    */

    const result = await createOrder({
      payment_method: selectedPayment.value,

      items: orderItems,
    });

    /*
    |--------------------------------------------------------------------------
    | Log API Response
    |--------------------------------------------------------------------------
    */

    console.log("ORDER API RESPONSE:", result);

    /*
    |--------------------------------------------------------------------------
    | Validate API Response
    |--------------------------------------------------------------------------
    */

    if (!result || !result.success) {
      throw new Error(result?.message || "Unable to create order.");
    }

    /*
    |--------------------------------------------------------------------------
    | Order Created Successfully
    |--------------------------------------------------------------------------
    */

    console.log("ORDER CREATED SUCCESSFULLY:", result);

    /*
    |--------------------------------------------------------------------------
    | Save Order Information
    |--------------------------------------------------------------------------
    */

    const lastOrder = {
      order_id: result.order_id,

      order_reference: result.order_reference,

      total_amount: result.total_amount,

      payment_method: result.payment_method,

      payment_status: result.payment_status,

      order_status: result.order_status,
    };

    /*
    |--------------------------------------------------------------------------
    | Store Last Order
    |--------------------------------------------------------------------------
    */

    sessionStorage.setItem("lastOrder", JSON.stringify(lastOrder));

    /*
    |--------------------------------------------------------------------------
    | Clear Cart
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The cart is ONLY cleared after the backend
    | successfully creates the order.
    |
    */

    cartStore.clearCart();

    /*
    |--------------------------------------------------------------------------
    | Navigate To Success Page
    |--------------------------------------------------------------------------
    */

    await router.replace({
      path: "/payment-success",
    });
  } catch (error: any) {
    /*
    |--------------------------------------------------------------------------
    | Log Error
    |--------------------------------------------------------------------------
    */

    console.error("ORDER CREATION ERROR:", error);

    /*
    |--------------------------------------------------------------------------
    | Log Axios Response
    |--------------------------------------------------------------------------
    */

    console.error("API ERROR RESPONSE:", error?.response?.data);

    /*
    |--------------------------------------------------------------------------
    | Display Error
    |--------------------------------------------------------------------------
    */

    if (error?.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to process your order. Please try again.";
    }
  } finally {
    /*
    |--------------------------------------------------------------------------
    | Stop Loading
    |--------------------------------------------------------------------------
    */

    processing.value = false;
  }
}
</script>
