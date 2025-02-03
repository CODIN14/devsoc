export interface Order {
  id: string;
  date: Date;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: string;
}

export function saveOrder(order: Omit<Order, 'id' | 'date'>): Order {
  const newOrder = {
    ...order,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date(),
  };

  const orders = getOrders();
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  return newOrder;
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
}