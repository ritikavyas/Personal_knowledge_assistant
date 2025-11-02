import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, Source } from '../types';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  index?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`rounded-2xl p-5 shadow-lg border ${
            isUser
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-sm border-amber-400/50 shadow-amber-500/20'
              : 'glass text-gray-900 rounded-bl-sm border-gray-200/80 shadow-gray-200/50'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 text-gray-900" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-1 text-gray-900" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 leading-relaxed text-gray-800" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-800" {...props} />,
                  li: ({node, ...props}) => <li className="ml-2 text-gray-800" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-900 text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-gray-200 p-3 rounded-lg my-2 text-gray-900 text-sm font-mono overflow-x-auto" {...props} />
                    ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-yellow-500 pl-4 italic my-2 text-gray-700" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-yellow-600 hover:text-yellow-700 underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  hr: ({node, ...props}) => <hr className="my-3 border-gray-300" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 space-y-2"
          >
            <p className="text-xs text-gray-600 font-semibold px-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
              Sources ({message.sources.length})
            </p>
            
            {message.sources.map((source: Source, idx: number) => (
              <motion.div
                key={source.chunkId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="glass border border-gray-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExpandedSource(expandedSource === source.chunkId ? null : source.chunkId)}
                  className="w-full p-4 text-left flex justify-between items-center transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                      <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {source.documentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-bold shadow-sm">
                      {Math.round(source.similarity * 100)}%
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSource === source.chunkId ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </div>
                </motion.button>

                {expandedSource === source.chunkId && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 pt-2 border-t border-gray-200/50"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-xl p-4 border border-gray-200/50 shadow-inner">
                      <p className="text-xs text-gray-700 leading-relaxed italic">
                        "{source.text.substring(0, 300)}
                        {source.text.length > 300 ? '...' : ''}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
