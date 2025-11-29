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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative mx-auto w-full items-center justify-center overflow-hidden rounded-lg border bg-background"
      >
        <div className="relative flex w-full items-center justify-center p-4">
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
          
          <div className="z-20 w-full">
            <div className="text-center mb-4">
              <h1 className="flex justify-center select-none py-2 text-center text-2xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-4xl">
                <span
                  data-content="AI."
                  className="before:animate-gradient-background-1 relative before:absolute before:bottom-4 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                >
                  <span className="from-gradient-1-start to-gradient-1-end animate-gradient-foreground-1 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                    AI.
                  </span>
                </span>
                <span
                  data-content="Chat."
                  className="before:animate-gradient-background-2 relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                >
                  <span className="from-gradient-2-start to-gradient-2-end animate-gradient-foreground-2 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                    Chat.
                  </span>
                </span>
                <span
                  data-content="Support."
                  className="before:animate-gradient-background-3 relative before:absolute before:bottom-1 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
                >
                  <span className="from-gradient-3-start to-gradient-3-end animate-gradient-foreground-3 bg-gradient-to-r bg-clip-text px-2 text-transparent">
                    Support.
                  </span>
                </span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                How can I help you today?
              </p>
            </div>

            <ScrollArea className="h-[360px] w-full overflow-auto p-1" ref={scrollRef}>
              <div className="px-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
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
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground max-w-[80%] rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="relative mt-4 w-full">
              <form onSubmit={sendMessage}>
                <div className="relative">
                  <Input
                    className="pl-12 pr-12"
                    placeholder="Ask something with AI"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </form>

              <Button
                variant="default"
                size="icon"
                className="absolute left-1.5 top-1.5 h-7 w-7 rounded-sm"
                onClick={clearChat}
                type="button"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">New Chat</span>
              </Button>

              <Button
                type="submit"
                variant="default"
                size="icon"
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-sm"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send Message</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}