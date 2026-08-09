import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Pending Orders
|--------------------------------------------------------------------------
*/

export async function getPendingOrders() {
  const response = await api.get("/get_pending_orders.php");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export async function updateOrderStatus(orderId: number, status: string) {
  const response = await api.post("/update_order_status.php", {
    order_id: orderId,
    status: status,
  });

  return response.data;
}
