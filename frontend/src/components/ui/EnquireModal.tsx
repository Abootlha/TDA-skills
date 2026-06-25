"use client";

import { X, User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils/cn";

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnquireModal({ isOpen, onClose }: EnquireModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state if closed
      setTimeout(() => setIsSuccess(false), 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    type: "",
    message: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enquiries`, {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        enquiry_type: formData.type,
        message: formData.message
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ fullName: "", email: "", phone: "", type: "", message: "" });
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#001430]/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[650px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-extrabold text-[#001430]">Get in Touch</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-[#001430] hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#001430] mb-2">Enquiry Sent!</h3>
              <p className="text-gray-500">Thank you for reaching out. Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#001430]">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    minLength={2}
                    maxLength={100}
                    pattern="^[A-Za-z\s\-]+$"
                    title="Name can only contain letters, spaces, and hyphens"
                    placeholder="Enter your full name" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 rounded-xl outline-none transition-all text-[#001430] placeholder:text-gray-400 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#001430]">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                    placeholder="Enter your email address" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 rounded-xl outline-none transition-all text-[#001430] placeholder:text-gray-400 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#001430]">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    required
                    minLength={10}
                    maxLength={15}
                    pattern="^\+?[0-9\s\-]+$"
                    title="Phone number can only contain numbers, spaces, and a leading plus sign"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+\s\-]/g, '');
                    }}
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 rounded-xl outline-none transition-all text-[#001430] placeholder:text-gray-400 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                  />
                </div>
              </div>

              {/* Enquiry Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#001430]">Enquiry Type (Optional)</label>
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 rounded-xl outline-none transition-all text-[#001430] appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="" disabled>Select enquiry type</option>
                  <option value="general">General Enquiry</option>
                  <option value="course">Course Information</option>
                  <option value="nvq">NVQ Training</option>
                  <option value="business">Business Solutions</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#001430]">Message (Optional)</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3 pointer-events-none text-gray-400">
                    <MessageSquare size={18} />
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your training needs or any questions you have... (Optional)" 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 rounded-xl outline-none transition-all text-[#001430] placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 bg-[#FFB800] text-[#001430] py-4 rounded-xl font-extrabold text-lg transition-all shadow-md shadow-yellow-500/20",
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#e5a813] hover:-translate-y-0.5"
                  )}
                >
                  <Send size={20} className={cn(isSubmitting && "animate-pulse")} />
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
