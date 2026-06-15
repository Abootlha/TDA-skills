import { notFound } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

import crypto from 'crypto';

export const metadata = {
  title: "Admin Portal",
  robots: "noindex, nofollow", // Prevent search engines from indexing
};

function decryptSecret(encryptedHex: string, secret: string): string | null {
  try {
    const key = crypto.createHash('sha256').update(secret).digest();
    const encryptedBytes = Buffer.from(encryptedHex, 'hex');

    if (encryptedBytes.length <= 28) return null;

    const nonce = encryptedBytes.subarray(0, 12);
    const authTag = encryptedBytes.subarray(encryptedBytes.length - 16);
    const ciphertext = encryptedBytes.subarray(12, encryptedBytes.length - 16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const secretKey = process.env.ADMIN_LOGIN_SECRET || "";
  const params = await searchParams;

  // Strict validation: decrypt the hex string and see if it equals our secret
  if (!params.key || decryptSecret(params.key, secretKey) !== secretKey) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#001430] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F5E9] mb-4">
            <svg
              className="w-8 h-8 text-[#2E7D32]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#001430]">Admin Secure</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
