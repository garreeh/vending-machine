import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/cart",
    component: () => import("../views/CartPage.vue"),
  },
  {
    path: "/checkout",
    component: () => import("../views/CheckoutPage.vue"),
  },
  {
    path: "/payment",
    component: () => import("../views/PaymentPage.vue"),
  },
  {
    path: "/payment-success",
    component: () => import("../views/PaymentSuccessPage.vue"),
  },
  {
    path: "/dispensing",
    component: () => import("../views/DispensingPage.vue"),
  },
  {
    path: "/machine-test",
    component: () => import("../views/MachineTestPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
