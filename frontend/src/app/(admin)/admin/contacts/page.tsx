import { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactsTable } from "@/components/admin/ContactsTable";

export const metadata: Metadata = {
  title: "Contact Submissions | TDA Skills Admin",
  description: "Manage customer Contact Us submissions.",
};

export default function AdminContactsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#001430] tracking-tight mb-1 flex items-center gap-3">
            <Mail className="text-[#FFB800]" size={32} />
            Contact Submissions
          </h1>
          <p className="text-gray-500 font-medium">Manage and respond to Contact Us submissions from your users.</p>
        </div>
      </div>

      {/* Main Table Component */}
      <ContactsTable />
    </div>
  );
}
