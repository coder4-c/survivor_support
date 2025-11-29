import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./ui/canvas-effect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";
import { Plus, Send } from "lucide-react";

export function Chatbot() {
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = { 
        text: data.response || "I received your message but couldn't generate a response.", 
        type: "ai", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again.";
      
      if (error.message.includes('404')) {
        errorText = "AI service is currently unavailable. Please check that the backend server is running.";
      } else if (error.message.includes('Failed to fetch')) {
        errorText = "Unable to connect to the server. Please check your connection.";
      }
      
      const errorMessage = { 
        text: errorText, 
        type: "ai", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-80 md:w-96 h-[500px] overflow-hidden rounded-lg border bg-background shadow-lg"
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
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
              <h1 className="text-lg font-bold text-center">
                <span
                  data-content="AI."
                  className="before:animate-gradient-background-1 relative before:absolute before:bottom-1 before:left-0 before:top-0 before:z-0 before:w-full before:px-1 before:content-[attr(data-content)]"
                >
                  <span className="from-gradient-1-start to-gradient-1-end animate-gradient-foreground-1 bg-gradient-to-r bg-clip-text px-1 text-transparent">
                    AI.
                  </span>
                </span>
                <span
                  data-content="Chat."
                  className="before:animate-gradient-background-2 relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:w-full before:px-1 before:content-[attr(data-content)]"
                >
                  <span className="from-gradient-2-start to-gradient-2-end animate-gradient-foreground-2 bg-gradient-to-r bg-clip-text px-1 text-transparent">
                    Chat.
                  </span>
                </span>
                <span
                  data-content="Support."
                  className="before:animate-gradient-background-3 relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:w-full before:px-1 before:content-[attr(data-content)]"
                >
                  <span className="from-gradient-3-start to-gradient-3-end animate-gradient-foreground-3 bg-gradient-to-r bg-clip-text px-1 text-transparent">
                    Support.
                  </span>
                </span>
              </h1>
              <p className="text-xs text-muted-foreground text-center mt-1">
                How can I help you today?
              </p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-2" ref={scrollRef}>
              <div className="space-y-3 px-2">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    Start a conversation by typing a message below.
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.type === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg px-3 py-2 text-xs",
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-xs leading-relaxed">{message.text}</p>
                        <span className="text-[10px] opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground max-w-[85%] rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-background/80 backdrop-blur-sm">
              <form onSubmit={sendMessage}>
                <div className="relative">
                  <Input
                    className="pl-10 pr-16 text-xs h-8"
                    placeholder="Ask something with AI"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0.5 top-0.5 h-7 w-7 rounded-sm"
                    onClick={clearChat}
                    type="button"
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">New Chat</span>
                  </Button>

                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-0.5 h-7 w-7 rounded-sm"
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
      </div>
    </div>
  );
}