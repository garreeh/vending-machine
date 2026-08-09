<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-title> Order Complete </ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content>
      <div class="success-container">
        <!-- SUCCESS ICON -->
        <div class="success-icon">✓</div>

        <!-- TITLE -->
        <h1>Order Complete!</h1>

        <p class="success-message">Thank you for your purchase.</p>

        <!-- ORDER CARD -->
        <div class="order-card">
          <!-- ORDER REFERENCE -->
          <div class="order-row">
            <span class="label"> Order Number </span>

            <span class="value order-reference">
              {{ order.order_reference || "N/A" }}
            </span>
          </div>

          <div class="divider"></div>

          <!-- TOTAL -->
          <div class="order-row">
            <span class="label"> Total </span>

            <span class="value total">
              {{ formatPrice(order.total_amount) }}
            </span>
          </div>

          <!-- PAYMENT -->
          <div class="order-row">
            <span class="label"> Payment </span>

            <span class="value">
              {{ formatPaymentMethod(order.payment_method) }}
            </span>
          </div>

          <!-- PAYMENT STATUS -->
          <div class="order-row">
            <span class="label"> Payment Status </span>

            <span
              class="status"
              :class="getPaymentStatusClass(order.payment_status)">
              {{ formatStatus(order.payment_status) }}
            </span>
          </div>

          <!-- ORDER STATUS -->
          <div class="order-row">
            <span class="label"> Order Status </span>

            <span
              class="status"
              :class="getOrderStatusClass(order.order_status)">
              {{ formatStatus(order.order_status) }}
            </span>
          </div>
        </div>

        <!-- DISPENSING MESSAGE -->
        <div class="dispensing-card">
          <div class="dispensing-icon">🛒</div>

          <div>
            <h2>Please wait</h2>

            <p>Your order is being prepared for dispensing.</p>
          </div>
        </div>

        <!-- DONE BUTTON -->
        <ion-button
          expand="block"
          size="large"
          class="done-button"
          @click="finishOrder">
          Done
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import "../assets/styles/payment.css";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const router = useRouter();

/*
|--------------------------------------------------------------------------
| Order Interface
|--------------------------------------------------------------------------
*/

interface Order {
  success?: boolean;

  order_id?: number;

  order_reference?: string;

  total_amount?: number;

  payment_method?: string;

  payment_status?: string;

  order_status?: string;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Load Order
|--------------------------------------------------------------------------
*/

const storedOrder = sessionStorage.getItem("lastOrder");

/*
|--------------------------------------------------------------------------
| Default Order
|--------------------------------------------------------------------------
*/

const order = ref<Order>({
  order_reference: "",

  total_amount: 0,

  payment_method: "",

  payment_status: "",

  order_status: "",
});

/*
|--------------------------------------------------------------------------
| Parse Stored Order
|--------------------------------------------------------------------------
*/

if (storedOrder) {
  try {
    const parsedOrder = JSON.parse(storedOrder);

    order.value = parsedOrder;
  } catch (error) {
    console.error("Unable to read stored order:", error);
  }
}

/*
|--------------------------------------------------------------------------
| Format Price
|--------------------------------------------------------------------------
*/

function formatPrice(price?: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price || 0));
}

/*
|--------------------------------------------------------------------------
| Format Payment Method
|--------------------------------------------------------------------------
*/

function formatPaymentMethod(method?: string): string {
  if (!method) {
    return "N/A";
  }

  switch (method.toLowerCase()) {
    case "gcash":
      return "GCash";

    case "cash":
      return "Cash";

    case "card":
      return "Card";

    default:
      return method;
  }
}

/*
|--------------------------------------------------------------------------
| Format Status
|--------------------------------------------------------------------------
*/

function formatStatus(status?: string): string {
  if (!status) {
    return "N/A";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/*
|--------------------------------------------------------------------------
| Payment Status Class
|--------------------------------------------------------------------------
*/

function getPaymentStatusClass(status?: string): string {
  if (!status) {
    return "status-default";
  }

  switch (status.toUpperCase()) {
    case "PAID":
      return "status-success";

    case "PENDING":
      return "status-pending";

    case "FAILED":
      return "status-error";

    default:
      return "status-default";
  }
}

/*
|--------------------------------------------------------------------------
| Order Status Class
|--------------------------------------------------------------------------
*/

function getOrderStatusClass(status?: string): string {
  if (!status) {
    return "status-default";
  }

  switch (status.toUpperCase()) {
    case "DISPENSED":
      return "status-success";

    case "PENDING_DISPENSE":
      return "status-pending";

    case "CANCELLED":
      return "status-error";

    default:
      return "status-default";
  }
}

/*
|--------------------------------------------------------------------------
| Finish Order
|--------------------------------------------------------------------------
*/

function finishOrder() {
  /*
  |--------------------------------------------------------------------------
  | Remove previous order
  |--------------------------------------------------------------------------
  |
  | We don't want an old order showing if the customer
  | starts another transaction.
  |
  */

  sessionStorage.removeItem("lastOrder");

  /*
  |--------------------------------------------------------------------------
  | Return Home
  |--------------------------------------------------------------------------
  */

  router.replace("/home");
}
</script>
