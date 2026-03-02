'use client';

import React, { createContext, useContext, useState } from 'react';

type Toast = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
};

type ToastContextType = {
  toast: (props: Toast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [activeToast, setActiveToast] = useState<Toast | null>(null);

  const showToast = (toast: Toast) => {
    setActiveToast(toast);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {activeToast && (
        <div
          className={`fixed bottom-4 right-4 rounded-md p-4 shadow-lg ${
            activeToast.variant === 'destructive'
              ? 'bg-red-500'
              : activeToast.variant === 'success'
                ? 'bg-green-500'
                : 'bg-background'
          } text-white`}
        >
          <h4 className="font-bold">{activeToast.title}</h4>
          {activeToast.description && <p>{activeToast.description}</p>}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
