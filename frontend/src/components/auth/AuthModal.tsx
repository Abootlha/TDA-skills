"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AuthForm } from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = "login", onSuccess }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition-colors bg-white rounded-full p-1"
        >
          <X size={24} />
        </button>

        <AuthForm initialMode={initialMode} onSuccess={onSuccess} />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
