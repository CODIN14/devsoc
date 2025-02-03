"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: getSimulatedResponse(userMessage),
      }]);
    }, 1000);
  };

  const getSimulatedResponse = (message: string): string => {
    const responses = {
      default: "I'm here to help! What would you like to know about our products or services?",
      price: "Our prices are competitive and clearly displayed on each product. Is there a specific item you're interested in?",
      location: "You can find different product categories clearly marked in their respective aisles. What are you looking for?",
      help: "I'd be happy to help! What do you need assistance with?",
    };

    if (message.toLowerCase().includes("price")) return responses.price;
    if (message.toLowerCase().includes("find")) return responses.location;
    if (message.toLowerCase().includes("help")) return responses.help;
    return responses.default;
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col">
      <div className="p-3 border-b flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold">AI Assistant</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}