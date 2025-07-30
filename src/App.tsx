import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Registration } from './components/Registration';
import { Dashboard } from './components/Dashboard';
import { Toast, useToast } from './components/Toast';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const { loading, isAuthenticated, login, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated ? (
          <Dashboard 
            onLogout={logout}
            showToast={addToast}
          />
        ) : (
          <Registration 
            onRegister={login}
            showToast={addToast}
          />
        )}
        
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;