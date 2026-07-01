"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { Search, Filter, Eye, Trash2, CheckCircle } from "lucide-react";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  enquiry_type: string;
  message: string;
  status: string;
  created_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModal, setViewModal] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/contacts`);
      if (res.data.success) {
        setContacts(res.data.data.contacts || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load contact submissions.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.put(`/admin/contacts/${id}/status`, { status: newStatus });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact submission?")) return;
    try {
      await apiClient.delete(`/admin/contacts/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to delete contact submission.");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 rounded-full text-xs font-bold">New</span>;
      case "in_progress":
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 rounded-full text-xs font-bold">In Progress</span>;
      case "resolved":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 rounded-full text-xs font-bold">Resolved</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading contact submissions...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search contact submissions..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name & Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No contact submissions found.</td>
              </tr>
            ) : contacts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(c.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-[#001430]">{c.full_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.email} • {c.phone_number}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{c.enquiry_type || 'General'}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setViewModal(c)}
                      className="p-1.5 text-gray-400 hover:text-[#001430] transition-colors rounded-lg hover:bg-gray-100"
                      title="View Message"
                    >
                      <Eye size={18} />
                    </button>
                    {c.status !== 'resolved' && (
                      <button 
                        onClick={() => updateStatus(c.id, 'resolved')}
                        className="p-1.5 text-emerald-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteContact(c.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#001430] mb-4">Contact Submission Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Name</span>
                  <span className="font-semibold text-gray-900">{viewModal.full_name}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Date</span>
                  <span className="font-semibold text-gray-900">{formatDate(viewModal.created_at)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Email</span>
                  <a href={`mailto:${viewModal.email}`} className="font-semibold text-blue-600 hover:underline">{viewModal.email}</a>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Phone</span>
                  <a href={`tel:${viewModal.phone_number}`} className="font-semibold text-blue-600 hover:underline">{viewModal.phone_number}</a>
                </div>
              </div>

              <div>
                <span className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Message</span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {viewModal.message || "No message provided."}
                </div>
              </div>

              {viewModal.utm_source && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-2">
                  <span className="block text-blue-800 text-xs font-bold mb-2 uppercase tracking-wider">Tracking Info</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 mr-1">Source:</span>
                      <span className="font-semibold text-[#001430]">{viewModal.utm_source}</span>
                    </div>
                    {viewModal.utm_medium && (
                      <div>
                        <span className="text-gray-500 mr-1">Medium:</span>
                        <span className="font-semibold text-[#001430]">{viewModal.utm_medium}</span>
                      </div>
                    )}
                    {viewModal.utm_campaign && (
                      <div>
                        <span className="text-gray-500 mr-1">Campaign:</span>
                        <span className="font-semibold text-[#001430]">{viewModal.utm_campaign}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setViewModal(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {viewModal.status !== 'resolved' && (
                <button 
                  onClick={() => {
                    updateStatus(viewModal.id, 'resolved');
                    setViewModal(null);
                  }}
                  className="px-5 py-2.5 bg-[#FFB800] text-[#001430] font-bold rounded-xl hover:bg-[#e6a600] transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
