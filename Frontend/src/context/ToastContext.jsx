import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, ErrorOutline, InfoOutlined, WarningAmber, Close } from "@mui/icons-material";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { type, message } = toast;

  const styles = {
    success: {
      bg: "bg-slate-900/90 border-emerald-500/50 text-emerald-300 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)]",
      icon: <CheckCircle className="text-emerald-400" sx={{ fontSize: 22 }} />,
      title: "Success",
      bar: "bg-emerald-500"
    },
    error: {
      bg: "bg-slate-900/90 border-rose-500/50 text-rose-300 shadow-[0_10px_30px_-5px_rgba(244,63,94,0.3)]",
      icon: <ErrorOutline className="text-rose-400" sx={{ fontSize: 22 }} />,
      title: "Error",
      bar: "bg-rose-500"
    },
    warning: {
      bg: "bg-slate-900/90 border-amber-500/50 text-amber-300 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.3)]",
      icon: <WarningAmber className="text-amber-400" sx={{ fontSize: 22 }} />,
      title: "Warning",
      bar: "bg-amber-500"
    },
    info: {
      bg: "bg-slate-900/90 border-indigo-500/50 text-indigo-300 shadow-[0_10px_30px_-5px_rgba(99,102,241,0.3)]",
      icon: <InfoOutlined className="text-indigo-400" sx={{ fontSize: 22 }} />,
      title: "Notice",
      bar: "bg-indigo-500"
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-300 ${style.bg} relative overflow-hidden`}>
      {/* Accent edge indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.bar}`} />

      <div className="flex-shrink-0 ml-1">{style.icon}</div>

      <div className="flex-1 pr-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{style.title}</p>
        <p className="text-sm font-medium text-slate-100 mt-0.5 leading-snug">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Close sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
