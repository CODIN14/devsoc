"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
}

export default function PaymentModal({ open, onClose, total, onSuccess }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <div className="relative">
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  className="pl-10"
                  maxLength={19}
                  pattern="\d*"
                  required
                />
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  maxLength={3}
                  pattern="\d*"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4 text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground">Thank you for your purchase</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}