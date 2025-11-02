import React, { useState } from 'react';
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg p-4 ${
            isUser
              ? 'bg-yellow-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
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
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 font-medium px-2">Sources ({message.sources.length})</p>
            
            {message.sources.map((source: Source) => (
              <div
                key={source.chunkId}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSource(expandedSource === source.chunkId ? null : source.chunkId)}
                  className="w-full p-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {source.documentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                      {Math.round(source.similarity * 100)}%
                    </span>
                    {expandedSource === source.chunkId ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedSource === source.chunkId && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-700 leading-relaxed italic">
                        "{source.text.substring(0, 300)}
                        {source.text.length > 300 ? '...' : ''}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
