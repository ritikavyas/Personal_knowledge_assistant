import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document } from '../types';
import { FileText, Upload, Trash2, Clock, Layers, Sparkles } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onUploadClick: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onUploadClick, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 glass border-r border-gray-200/50 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-white/40 to-amber-50/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Documents</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUploadClick}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Documents
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {documents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 mt-16 px-4"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative inline-block mb-4"
              >
                <FileText className="w-16 h-16 mx-auto text-amber-500/30" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute -top-2 -right-2 animate-pulse" />
              </motion.div>
              <p className="mb-2 text-gray-800 font-bold text-lg">No documents yet</p>
              <p className="text-sm text-gray-600 leading-relaxed">Upload up to 3 documents to start chatting</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="card group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex-shrink-0">
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 truncate mt-1">
                        {doc.originalName}
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 flex-shrink-0"
                      title="Delete document"
                    >
                      {deletingId === doc.id ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                        />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600 relative z-10">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg">
                      <Layers className="w-3 h-3 text-amber-600" />
                      <span className="font-medium">{doc.chunks} chunks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 border-t border-gray-200/50 glass">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Capacity</span>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: i < documents.length ? 1 : 0.5 }}
                  className={`w-2 h-2 rounded-full ${
                    i < documents.length 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {documents.length}/3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
