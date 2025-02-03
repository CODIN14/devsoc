"use client";

import { useState } from "react";
import { ShoppingCart, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import CameraFeed from "./components/CameraFeed";
import AIAssistant from "./components/AIAssistant";
import PaymentModal from "./components/PaymentModal";
import OrderHistory from "./components/OrderHistory";
import { saveOrder } from "./lib/orderHistory";

// This would come from your database/API
const products = [
  {
    id: 1,
    name: "Organic Bananas",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
    yoloClass: "banana"
  },
  {
    id: 2,
    name: "Fresh Milk",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop&q=80",
    yoloClass: "bottle"
  },
  {
    id: 3,
    name: "Whole Grain Bread",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    yoloClass: "bread"
  }
];

export default function Home() {
  const [cart, setCart] = useState<typeof products>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleScan = async (imageData: string, predictions?: any[]) => {
    setScanning(true);
    
    try {
      if (predictions && predictions.length > 0) {
        // Process YOLO predictions to find matching products
        const detectedClasses = predictions[0].map((pred: any) => ({
          class: pred.class,
          confidence: pred.confidence
        }));

        // Find product with highest confidence match
        let bestMatch = null;
        let highestConfidence = 0;

        for (const detection of detectedClasses) {
          const matchingProduct = products.find(p => p.yoloClass === detection.class);
          if (matchingProduct && detection.confidence > highestConfidence) {
            bestMatch = matchingProduct;
            highestConfidence = detection.confidence;
          }
        }

        if (bestMatch && highestConfidence > 0.7) { // Confidence threshold
          setSelectedProduct(bestMatch);
        } else {
          // No confident match found
          console.log("No product match found");
        }
      }
    } catch (error) {
      console.error("Error processing predictions:", error);
    } finally {
      setScanning(false);
    }
  };

  const addToCart = (product: (typeof products)[0]) => {
    setCart([...cart, product]);
    setSelectedProduct(null);
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    // Save order to history
    const order = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      })),
      total: total,
      paymentMethod
    };
    
    saveOrder(order);
    setShowPayment(false);
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Checkout</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <OrderHistory />
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CameraFeed onScan={handleScan} scanning={scanning} />
            </Card>

            {selectedProduct && (
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded-lg ring-2 ring-primary/10"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <Button onClick={() => addToCart(selectedProduct)}>
                    Add to Cart
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </h2>
                <span className="text-sm text-muted-foreground">
                  {cart.length} items
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-2 border-b last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg ring-2 ring-primary/10"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                {cart.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Your cart is empty
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={cart.length === 0}
                  onClick={() => setShowPayment(true)}
                >
                  Proceed to Payment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AIAssistant />
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}