<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title> Machine Test </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="machine-container">
        <h1>Vending Machine Simulator</h1>

        <p class="description">
          This page simulates the vending machine without requiring the physical
          hardware.
        </p>

        <!-- REFRESH -->
        <ion-button
          expand="block"
          @click="loadPendingOrders"
          :disabled="loading">
          <ion-spinner v-if="loading" name="crescent" />

          <span v-else> 🔄 Check Pending Orders </span>
        </ion-button>

        <!-- ERROR -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- NO ORDERS -->
        <div v-if="!loading && pendingOrders.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>

          <h2>No Pending Orders</h2>

          <p>The machine has no orders waiting to be dispensed.</p>
        </div>

        <!-- ORDERS -->
        <div
          v-for="order in pendingOrders"
          :key="order.order_id"
          class="order-card">
          <!-- ORDER HEADER -->
          <div class="order-header">
            <div>
              <h2>
                {{ order.order_reference }}
              </h2>

              <p>Order #{{ order.order_id }}</p>
            </div>

            <span class="status">
              {{ order.order_status }}
            </span>
          </div>

          <!-- ITEMS -->
          <div class="items">
            <div
              v-for="item in order.items"
              :key="item.order_item_id"
              class="item">
              <div>
                <strong>
                  {{ item.product_name }}
                </strong>

                <p>
                  Quantity:
                  {{ item.quantity }}
                </p>
              </div>

              <div class="slot">
                Slot
                {{ item.machine_slot }}
              </div>
            </div>
          </div>

          <!-- TOTAL -->
          <div class="total">
            <span> Total </span>

            <strong>
              {{ formatPrice(order.total_amount) }}
            </strong>
          </div>

          <!-- MACHINE ACTIONS -->
          <div class="machine-actions">
            <ion-button
              fill="outline"
              @click="startDispensing(order)"
              :disabled="processingOrder === order.order_id">
              <ion-spinner
                v-if="processingOrder === order.order_id"
                name="crescent" />

              <span v-else> ⚙️ Start Dispensing </span>
            </ion-button>

            <ion-button
              color="success"
              @click="completeDispensing(order)"
              :disabled="processingOrder === order.order_id">
              ✓ Dispensed
            </ion-button>

            <ion-button
              color="danger"
              fill="outline"
              @click="failDispensing(order)"
              :disabled="processingOrder === order.order_id">
              ✕ Failed
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";

import { getPendingOrders, updateOrderStatus } from "@/services/machineService";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface OrderItem {
  order_item_id: number;

  product_id: number;

  product_name: string;

  quantity: number;

  unit_price: number;

  subtotal: number;

  machine_slot: number;
}

interface Order {
  order_id: number;

  order_reference: string;

  total_amount: number;

  payment_method: string;

  payment_status: string;

  order_status: string;

  created_at: string;

  items: OrderItem[];
}

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const pendingOrders = ref<Order[]>([]);

const loading = ref(false);

const processingOrder = ref<number | null>(null);

const errorMessage = ref("");

/*
|--------------------------------------------------------------------------
| Format Price
|--------------------------------------------------------------------------
*/

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
}

/*
|--------------------------------------------------------------------------
| Load Pending Orders
|--------------------------------------------------------------------------
*/

async function loadPendingOrders() {
  loading.value = true;

  errorMessage.value = "";

  try {
    const result = await getPendingOrders();

    console.log("PENDING ORDERS:", result);

    if (!result.success) {
      throw new Error(result.message || "Unable to load pending orders.");
    }

    pendingOrders.value = result.orders || [];
  } catch (error) {
    console.error("MACHINE ERROR:", error);

    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Unable to communicate with the vending API.";
    }
  } finally {
    loading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| Start Dispensing
|--------------------------------------------------------------------------
*/

async function startDispensing(order: Order) {
  processingOrder.value = order.order_id;

  try {
    console.log("Starting dispensing:", order);

    const result = await updateOrderStatus(order.order_id, "DISPENSING");

    console.log("DISPENSING RESPONSE:", result);

    if (!result.success) {
      throw new Error(result.message || "Unable to start dispensing.");
    }

    /*
    |--------------------------------------------------------------------------
    | Update Local UI
    |--------------------------------------------------------------------------
    */

    order.order_status = "DISPENSING";
  } catch (error) {
    console.error("DISPENSING ERROR:", error);

    alert(
      error instanceof Error ? error.message : "Unable to start dispensing.",
    );
  } finally {
    processingOrder.value = null;
  }
}

/*
|--------------------------------------------------------------------------
| Complete Dispensing
|--------------------------------------------------------------------------
*/

async function completeDispensing(order: Order) {
  processingOrder.value = order.order_id;

  try {
    console.log("Completing dispensing:", order);

    const result = await updateOrderStatus(order.order_id, "DISPENSED");

    console.log("DISPENSED RESPONSE:", result);

    if (!result.success) {
      throw new Error(result.message || "Unable to complete dispensing.");
    }

    /*
    |--------------------------------------------------------------------------
    | Remove From Pending Orders
    |--------------------------------------------------------------------------
    */

    pendingOrders.value = pendingOrders.value.filter(
      (item) => item.order_id !== order.order_id,
    );
  } catch (error) {
    console.error("DISPENSE ERROR:", error);

    alert(
      error instanceof Error ? error.message : "Unable to complete dispensing.",
    );
  } finally {
    processingOrder.value = null;
  }
}

/*
|--------------------------------------------------------------------------
| Failed Dispensing
|--------------------------------------------------------------------------
*/

async function failDispensing(order: Order) {
  processingOrder.value = order.order_id;

  try {
    const result = await updateOrderStatus(order.order_id, "FAILED");

    console.log("FAILED RESPONSE:", result);

    if (!result.success) {
      throw new Error(result.message || "Unable to mark order as failed.");
    }

    /*
    |--------------------------------------------------------------------------
    | Remove From Pending Orders
    |--------------------------------------------------------------------------
    */

    pendingOrders.value = pendingOrders.value.filter(
      (item) => item.order_id !== order.order_id,
    );
  } catch (error) {
    console.error("FAILED DISPENSING ERROR:", error);

    alert(error instanceof Error ? error.message : "Unable to update order.");
  } finally {
    processingOrder.value = null;
  }
}

/*
|--------------------------------------------------------------------------
| Load When Page Opens
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadPendingOrders();
});
</script>

<style scoped>
.machine-container {
  max-width: 900px;

  margin: 0 auto;

  padding: 24px;
}

.machine-container h1 {
  margin-bottom: 8px;

  font-size: 30px;

  font-weight: 700;
}

.description {
  margin-bottom: 24px;

  color: #777;
}

/* =========================================================
   ERROR
   ========================================================= */

.error-message {
  margin-top: 20px;

  padding: 14px;

  border-radius: 12px;

  background: #ffe5e5;

  color: #c62828;
}

/* =========================================================
   EMPTY
   ========================================================= */

.empty-state {
  margin-top: 40px;

  padding: 40px 20px;

  text-align: center;
}

.empty-icon {
  font-size: 50px;
}

.empty-state h2 {
  margin-bottom: 6px;
}

.empty-state p {
  color: #777;
}

/* =========================================================
   ORDER
   ========================================================= */

.order-card {
  margin-top: 20px;

  padding: 20px;

  border-radius: 18px;

  background: white;

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
}

.order-header h2 {
  margin: 0;

  font-size: 20px;
}

.order-header p {
  margin: 5px 0 0;

  color: #777;

  font-size: 13px;
}

.status {
  padding: 7px 12px;

  border-radius: 20px;

  background: #fff3cd;

  color: #856404;

  font-size: 12px;

  font-weight: 700;
}

/* =========================================================
   ITEMS
   ========================================================= */

.items {
  margin-top: 20px;
}

.item {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 14px 0;

  border-bottom: 1px solid #eee;
}

.item strong {
  font-size: 16px;
}

.item p {
  margin: 5px 0 0;

  color: #777;

  font-size: 13px;
}

.slot {
  padding: 8px 12px;

  border-radius: 8px;

  background: #f1f1f1;

  font-weight: 600;
}

/* =========================================================
   TOTAL
   ========================================================= */

.total {
  display: flex;

  justify-content: space-between;

  margin-top: 18px;

  font-size: 18px;
}

/* =========================================================
   ACTIONS
   ========================================================= */

.machine-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  margin-top: 20px;
}

@media (max-width: 600px) {
  .machine-container {
    padding: 16px;
  }

  .order-header {
    align-items: flex-start;

    flex-direction: column;
  }

  .machine-actions {
    flex-direction: column;
  }

  .machine-actions ion-button {
    width: 100%;
  }
}
</style>
