import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';
import { Send, MessageSquare, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearChat: _onClearChat,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white/40 to-white/60 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center max-w-md px-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="relative inline-block">
                  <MessageSquare className="w-20 h-20 mx-auto text-amber-500/20 mb-6" />
                  <Sparkles className="w-8 h-8 text-amber-500 absolute top-0 right-0 animate-pulse" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                Start Your Conversation
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Upload documents and ask intelligent questions powered by AI
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start mb-6"
              >
                <div className="glass rounded-2xl rounded-bl-sm px-5 py-4 max-w-xs shadow-lg border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="glass-dark border-t border-gray-200/50 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your documents..."
              disabled={isLoading}
              className="w-full px-6 py-4 pr-14 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl 
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                       focus:bg-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-gray-200/50
                       transition-all duration-200"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3
                       bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600
                       rounded-xl text-white
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-lg shadow-amber-500/25
                       transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-white/60 rounded-lg border border-gray-200 font-mono text-xs">Enter</kbd>
              to send
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
