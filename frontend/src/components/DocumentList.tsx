import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document } from '../types';
import { FileText, Upload, Trash2, Clock, Layers, Loader2 } from 'lucide-react';

interface DocumentListProps {
  documents?: Document[]; // make optional and default to [] to avoid runtime errors
  onDelete: (id: string) => void;
  onUploadClick: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents = [], onDelete, onUploadClick }) => {
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
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-80 glass border-r border-white/10 flex flex-col backdrop-blur-xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-dark-50">My Documents</h2>
        </div>
        <motion.button
          onClick={onUploadClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Documents
        </motion.button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          {documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center text-dark-400 mt-12 px-4"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-4"
              >
                <FileText className="w-16 h-16 mx-auto text-dark-600" strokeWidth={1.5} />
              </motion.div>
              <p className="mb-2 text-dark-300 font-medium">No documents yet</p>
              <p className="text-sm text-dark-500">Upload up to 3 documents to start chatting</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="glass glass-hover p-4 rounded-xl group relative overflow-hidden"
                >
                  {/* Hover gradient effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                        <h3 className="font-medium text-sm text-dark-100 truncate">
                          {doc.originalName}
                        </h3>
                      </div>
                      <motion.button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        whileHover={{ scale: deletingId === doc.id ? 1 : 1.1 }}
                        whileTap={{ scale: deletingId === doc.id ? 1 : 0.9 }}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete document"
                      >
                        {deletingId === doc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    {/* Info */}
                    <div className="flex items-center gap-4 text-xs text-dark-400">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{doc.chunks} chunks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(doc.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-t border-white/10"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-400">Documents</span>
          <div className="flex items-center gap-2">
            <motion.div
              className="h-2 w-24 bg-dark-800 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(documents.length / 3) * 100}%` }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </motion.div>
            <span className="text-dark-300 font-medium">{documents.length}/3</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentList;
