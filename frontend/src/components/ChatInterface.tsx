import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';
import { Send, Sparkles, MessageSquare, Trash2 } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const suggestedQuestions = [
    "What are the main topics in my documents?",
    "Summarize the key points",
    "Compare information across documents",
    "Find specific details about..."
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 flex flex-col relative"
    >
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center max-w-2xl px-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-6"
                >
                  <MessageSquare className="w-20 h-20 mx-auto text-primary-400" strokeWidth={1.5} />
                </motion.div>
                <h2 className="text-3xl font-bold mb-3 gradient-text">
                  Start Your Conversation
                </h2>
                <p className="text-dark-400 mb-8">
                  Upload documents and ask intelligent questions powered by AI
                </p>
                
                {/* Suggested Questions */}
                <div className="grid grid-cols-2 gap-3 mt-8">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(question)}
                      className="glass glass-hover p-4 rounded-xl text-left text-sm text-dark-300 hover:text-dark-100"
                    >
                      <Sparkles className="w-4 h-4 mb-2 text-primary-400" />
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Clear Chat Button - Floating */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chat history?')) {
                    onClearChat();
                  }
                }}
                className="fixed top-20 right-6 z-10 glass glass-hover p-3 rounded-full shadow-lg hover:shadow-primary-500/20"
                title="Clear chat history"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </motion.button>

              {messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start mb-6"
                >
                  <div className="glass p-4 rounded-2xl rounded-bl-sm max-w-xs">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-primary-400" />
                      </motion.div>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary-400 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-dark-300">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border-t border-white/10 p-6 glass backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your documents..."
              disabled={isLoading}
              className="w-full px-6 py-4 pr-14 bg-dark-800/50 border border-white/10 rounded-2xl 
                       text-dark-100 placeholder-dark-500
                       focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 
                       bg-gradient-to-r from-primary-500 to-primary-600 
                       rounded-xl text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-primary-500/50
                       transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 flex items-center justify-center gap-4 text-xs text-dark-500"
          >
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              AI-Powered
            </span>
            <span>•</span>
            <span>Press Enter to send</span>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;
