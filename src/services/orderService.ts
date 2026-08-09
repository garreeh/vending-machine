import api from "@/services/api";

export interface OrderItem {
  product_id: number;
  quantity: number;
  machine_slot: number;
}

export interface CreateOrderRequest {
  payment_method: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: number;
  order_reference?: string;
  total_amount?: number;
  payment_method?: string;
  payment_status?: string;
  order_status?: string;
  message: string;
}

export async function createOrder(
  order: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const response = await api.post("/orders.php", order);

  return response.data;
}
