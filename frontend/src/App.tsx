import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import DocumentList from './components/DocumentList';
import UploadModal from './components/UploadModal';
import ConfirmModal from './components/ConfirmModal';
import Toast, { ToastMessage } from './components/Toast';
import { documentAPI, chatAPI } from './services/api';
import { ChatMessage, Document } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (type: ToastMessage['type'], message: string) => {
    const toast: ToastMessage = {
      id: uuidv4(),
      type,
      message,
    };
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    loadDocuments();
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('documentList', JSON.stringify(documents));
    }
  }, [documents]);

  const loadDocuments = async () => {
    try {
      const data = await documentAPI.getAll();
      setDocuments(data.documents);
      
      if (data.documents.length > 0) {
        localStorage.setItem('documentList', JSON.stringify(data.documents));
      } else {
        localStorage.removeItem('documentList');
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      const savedDocs = localStorage.getItem('documentList');
      if (savedDocs) {
        try {
          const parsedDocs = JSON.parse(savedDocs);
          setDocuments(parsedDocs);
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
      showToast('success', `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`);
    } catch (error: any) {
      console.error('Failed to upload documents:', error);
      showToast('error', error.response?.data?.error || 'Failed to upload documents');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document?',
      onConfirm: async () => {
        try {
          await documentAPI.delete(id);
          await loadDocuments();
          showToast('success', 'Document deleted successfully');
          
          const remainingDocs = documents.filter(doc => doc.id !== id);
          if (remainingDocs.length === 0 && messages.length > 0) {
            setConfirmModal({
              isOpen: true,
              title: 'Clear Chat History',
              message: 'All documents deleted. Clear chat history as well?',
              onConfirm: () => {
                clearChatHistory();
                showToast('info', 'Chat history cleared');
                setConfirmModal(null);
              },
            });
            return;
          }
        } catch (error: any) {
          console.error('Failed to delete document:', error);
          
          if (error.response?.status === 404) {
            const updatedDocs = documents.filter(doc => doc.id !== id);
            setDocuments(updatedDocs);
            
            if (updatedDocs.length > 0) {
              localStorage.setItem('documentList', JSON.stringify(updatedDocs));
            } else {
              localStorage.removeItem('documentList');
            }
            
            showToast('warning', 'Document was already deleted. Removed from list.');
            
            if (updatedDocs.length === 0 && messages.length > 0) {
              setConfirmModal({
                isOpen: true,
                title: 'Clear Chat History',
                message: 'All documents removed. Clear chat history as well?',
                onConfirm: () => {
                  clearChatHistory();
                  showToast('info', 'Chat history cleared');
                  setConfirmModal(null);
                },
              });
              return;
            }
          } else {
            showToast('error', error.response?.data?.error || error.message || 'Failed to delete document');
          }
        }
        setConfirmModal(null);
      },
    });
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20">
      <div className="flex-1 flex flex-col">
        <header className="glass border-b border-white/60 px-8 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 animate-shimmer" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 ring-2 ring-white/50">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Knowledge Assistant</h1>
              <p className="text-sm text-gray-600 font-medium">✨ AI-Powered Document Intelligence</p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <DocumentList
            documents={documents}
            onDelete={handleDeleteDocument}
            onUploadClick={() => setIsUploadModalOpen(true)}
          />
          
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Clear Chat History',
                message: 'Are you sure you want to clear all chat history?',
                onConfirm: () => {
                  clearChatHistory();
                  setConfirmModal(null);
                },
              });
            }}
            isLoading={isLoading}
          />
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
          variant={confirmModal.title.includes('Delete') ? 'danger' : 'default'}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
