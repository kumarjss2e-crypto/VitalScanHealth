"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types/ai";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInterface = ({ messages, input, onInputChange, onSend, isLoading }: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      {/* Chat Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold leading-none">VitalScan AI</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Wellness Copilot</span>
          </div>
        </div>
        <Sparkles className="text-white/20 w-5 h-5" />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide relative z-10"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-white/10 border border-white/10'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white/5 border border-white/10 text-white/80 backdrop-blur-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-2">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 relative z-10">
        <form onSubmit={onSend} className="relative">
          <input
            value={input}
            onChange={onInputChange}
            placeholder="Ask your wellness copilot..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 p-0"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
