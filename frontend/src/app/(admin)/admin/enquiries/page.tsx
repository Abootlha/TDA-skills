import { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";

export const metadata: Metadata = {
  title: "Enquiries | TDA Skills Admin",
  description: "Manage customer enquiries and contact form submissions.",
};

export default function AdminEnquiriesPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#001430] tracking-tight mb-1 flex items-center gap-3">
            <MessageSquare className="text-[#FFB800]" size={32} />
            Enquiries
          </h1>
          <p className="text-gray-500 font-medium">Manage and respond to contact form submissions from your users.</p>
        </div>
      </div>

      {/* Main Table Component */}
      <EnquiriesTable />
    </div>
  );
}
