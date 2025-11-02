import React, { useState } from 'react';
import { Document } from '../types';
import { FileText, Upload, Trash2, Clock, Layers } from 'lucide-react';

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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        </div>
        <button
          onClick={onUploadClick}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Documents
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {documents.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 px-4">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="mb-2 text-gray-700 font-medium">No documents yet</p>
            <p className="text-sm text-gray-500">Upload up to 3 documents to start chatting</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {doc.originalName}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors disabled:opacity-50"
                    title="Delete document"
                  >
                    {deletingId === doc.id ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
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
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Documents</span>
          <span className="text-gray-900 font-medium">{documents.length}/3</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
