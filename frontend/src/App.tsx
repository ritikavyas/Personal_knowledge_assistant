import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import DocumentList from './components/DocumentList';
import UploadModal from './components/UploadModal';
import Toast, { ToastMessage } from './components/Toast';
import { documentAPI, chatAPI } from './services/api';
import { ChatMessage, Document } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper function
  const addToast = (type: ToastMessage['type'], message: string, duration?: number) => {
    const toast: ToastMessage = {
      id: uuidv4(),
      type,
      message,
      duration,
    };
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load documents and chat history on mount
  useEffect(() => {
    loadDocuments();
    loadChatHistory();
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('documentList', JSON.stringify(documents));
    }
  }, [documents]);

  const loadDocuments = async () => {
    try {
      // First try to load from server (server is source of truth)
      const data = await documentAPI.getAll();
      setDocuments(data.documents);
      
      // Always sync localStorage with server
      if (data.documents.length > 0) {
        localStorage.setItem('documentList', JSON.stringify(data.documents));
      } else {
        // Server is empty, clear localStorage to prevent stale data
        localStorage.removeItem('documentList');
      }
    } catch (error) {
      console.error('Failed to load documents from server:', error);
      // On server error, try to load from localStorage as fallback only
      const savedDocs = localStorage.getItem('documentList');
      if (savedDocs) {
        try {
          const parsedDocs = JSON.parse(savedDocs);
          setDocuments(parsedDocs);
          console.log('⚠️ Using cached documents from localStorage');
        } catch (parseError) {
          console.error('Failed to parse localStorage:', parseError);
          localStorage.removeItem('documentList');
        }
      }
    }
  };

  const loadChatHistory = () => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const handleUpload = async (files: FileList) => {
    try {
      await documentAPI.upload(files);
      await loadDocuments();
      addToast('success', `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`);
    } catch (error: any) {
      console.error('Failed to upload documents:', error);
      addToast('error', error.response?.data?.error || 'Failed to upload documents');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        // Reload from server to ensure sync
        await loadDocuments();
        addToast('success', 'Document deleted successfully');
        
        // If all documents are deleted, optionally clear chat history
        const remainingDocs = documents.filter(doc => doc.id !== id);
        if (remainingDocs.length === 0 && messages.length > 0) {
          if (window.confirm('All documents deleted. Clear chat history as well?')) {
            clearChatHistory();
            addToast('info', 'Chat history cleared');
          }
        }
      } catch (error: any) {
        console.error('Failed to delete document:', error);
        
        // If document doesn't exist on server (404), remove from local state
        if (error.response?.status === 404) {
          console.log('Document not found on server, removing from local state');
          const updatedDocs = documents.filter(doc => doc.id !== id);
          setDocuments(updatedDocs);
          
          // Update localStorage
          if (updatedDocs.length > 0) {
            localStorage.setItem('documentList', JSON.stringify(updatedDocs));
          } else {
            localStorage.removeItem('documentList');
          }
          
          addToast('warning', 'Document was already deleted. Removed from list.');
          
          // Check if all docs are gone
          if (updatedDocs.length === 0 && messages.length > 0) {
            if (window.confirm('All documents removed. Clear chat history as well?')) {
              clearChatHistory();
              addToast('info', 'Chat history cleared');
            }
          }
        } else {
          addToast('error', error.response?.data?.error || error.message || 'Failed to delete document');
        }
      }
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageContent, messages);
      setMessages((prev) => [...prev, response.message]);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: error.response?.data?.error || 'Sorry, I encountered an error processing your message.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-10 glass border-b border-white/10 px-8 py-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Sparkles className="w-8 h-8 text-primary-400" />
            <motion.div
              className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Knowledge Assistant</h1>
            <p className="text-sm text-dark-400">AI-Powered Document Intelligence</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-1 pt-20 relative z-0">
        <DocumentList
          documents={documents}
          onDelete={handleDeleteDocument}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearChat={clearChatHistory}
          isLoading={isLoading}
        />
      </div>

      <AnimatePresence>
        {isUploadModalOpen && (
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
