import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./ui/canvas-effect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";
import { Plus, Send, MessageCircle, X } from "lucide-react";

export function Chatbot() {
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { text: input, type: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: input,
          context: messages.slice(-5).map(m => ({
            text: m.text,
            type: m.type === "user" ? "Human" : "AI"
          }))
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Small delay to make the AI response feel more natural
      setTimeout(() => {
        const aiMessage = { 
          text: data.response || "I received your message but couldn't generate a response.", 
          type: "ai", 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 500); // 500ms delay for better UX
      
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = "I'm here to support you. Please try again or contact our support team directly.";
      
      if (error.name === 'AbortError') {
        errorText = "Response is taking longer than expected. I'm still here to help!";
      } else if (error.message.includes('404')) {
        errorText = "I'm having trouble connecting right now, but our support team is available 24/7.";
      } else if (error.message.includes('Failed to fetch')) {
        errorText = "Connection issue detected. Please check your internet connection.";
      }
      
      setTimeout(() => {
        const errorMessage = { 
          text: errorText, 
          type: "ai", 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
      }, 300);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed Chat Icon */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
        >
          <MessageCircle className="h-5 w-5" />
        </motion.button>
      )}

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative w-72 md:w-72 h-80 overflow-hidden rounded-lg border bg-blue-600 shadow-xl"
          >
            <div className="relative flex flex-col h-full">
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <CanvasRevealEffect
                      animationSpeed={5}
                      containerClassName="bg-transparent opacity-30 dark:opacity-50"
                      colors={[
                        [14, 165, 233],
                        [59, 130, 246],
                      ]}
                      opacities={[0.3, 0.5, 0.8, 1, 0.8, 0.5, 0.3, 0.5, 0.8, 1]}
                      dotSize={2}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="z-20 flex flex-col h-full">
                {/* Header */}
                <div className="p-3 border-b border-blue-500 bg-blue-600 flex items-center justify-between">
                  <div>
                    <h1 className="text-sm font-bold text-white">
                      AI Assistant
                    </h1>
                    <p className="text-xs text-blue-100">
                      How can I help you?
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-blue-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close Chat</span>
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-2 bg-blue-700" ref={scrollRef}>
                  <div className="space-y-2 px-2">
                    {messages.length === 0 ? (
                      <div className="text-center text-blue-100 py-6 text-xs">
                        👋 Hi! Ask me anything...
                      </div>
                    ) : (
                      messages.slice(-5).map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex",
                            message.type === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[85%] rounded-lg px-2 py-1 text-xs",
                              message.type === "user"
                                ? "bg-white text-blue-600"
                                : "bg-blue-800 text-white"
                            )}
                          >
                            <p className="text-xs leading-tight">{message.text}</p>
                            <span className="text-[10px] opacity-70 mt-0.5 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-blue-800 text-white max-w-[85%] rounded-lg px-2 py-1">
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-[10px] opacity-70">Typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-2 border-t border-blue-500 bg-blue-600">
                  <form onSubmit={sendMessage}>
                    <div className="relative">
                      <Input
                        className="pl-8 pr-8 text-xs h-8 bg-white text-blue-600 placeholder:text-blue-400"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                      />
                      
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0.5 top-0.5 h-7 w-7 rounded-sm text-white hover:bg-blue-500"
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                      >
                        <Send className="h-3 w-3" />
                        <span className="sr-only">Send Message</span>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}