"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders, type Order } from "@/app/lib/orderHistory";
import { format } from "date-fns";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ClipboardList className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No orders yet
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.date), "PPP")}
                      </p>
                    </div>
                    <span className="font-semibold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    Paid with {order.paymentMethod}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}