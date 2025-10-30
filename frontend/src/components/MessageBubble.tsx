import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, Source } from '../types';
import { FileText, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  index?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index = 0 }) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const isUser = message.role === 'user';

  const toggleSource = (chunkId: string) => {
    setExpandedSource(expandedSource === chunkId ? null : chunkId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Content */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`rounded-2xl p-5 backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-sm shadow-lg shadow-primary-500/25'
              : 'glass border border-white/10 text-dark-100 rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for markdown elements
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 text-dark-50" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 text-dark-50" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-semibold mb-2 text-dark-100" {...props} />,
                  p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-dark-100" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-dark-100" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-dark-100" {...props} />,
                  li: ({node, ...props}) => <li className="ml-2 text-dark-100" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-dark-50" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-dark-200" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300 text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-dark-800 p-3 rounded-lg my-2 text-primary-300 text-sm font-mono overflow-x-auto" {...props} />
                    ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-primary-500 pl-4 italic my-3 text-dark-200" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  hr: ({node, ...props}) => <hr className="my-4 border-dark-700" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="mt-3 space-y-2"
          >
            <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-3 h-3 text-primary-400" />
              <p className="text-xs text-dark-400 font-medium">Sources ({message.sources.length})</p>
            </div>
            
            <AnimatePresence>
              {message.sources.map((source: Source, idx: number) => (
                <motion.div
                  key={source.chunkId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass glass-hover border border-white/10 rounded-xl overflow-hidden"
                >
                  <motion.button
                    onClick={() => toggleSource(source.chunkId)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="w-full p-3 text-left flex justify-between items-center transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-dark-200 truncate">
                        {source.documentName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="px-2 py-1 rounded-lg bg-primary-500/20 border border-primary-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-xs text-primary-300 font-medium">
                          {Math.round(source.similarity * 100)}%
                        </span>
                      </motion.div>
                      <motion.div
                        animate={{ rotate: expandedSource === source.chunkId ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {expandedSource === source.chunkId ? (
                          <ChevronUp className="w-4 h-4 text-dark-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-dark-400" />
                        )}
                      </motion.div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSource === source.chunkId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-white/10">
                          <motion.div
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="bg-dark-800/50 rounded-lg p-3 border border-white/5"
                          >
                            <p className="text-xs text-dark-300 leading-relaxed italic">
                              "{source.text.substring(0, 300)}
                              {source.text.length > 300 ? '...' : ''}"
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-1 mt-2 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
          <Clock className="w-3 h-3 text-dark-500" />
          <p className="text-xs text-dark-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
