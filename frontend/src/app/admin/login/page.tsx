import { notFound } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Portal",
  robots: "noindex, nofollow", // Prevent search engines from indexing
};

async function decryptSecret(encryptedHex: string, secret: string): Promise<string | null> {
  try {
    const encoder = new TextEncoder();
    const keyData = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']);

    const encryptedBytes = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));

    if (encryptedBytes.length <= 28) return null;

    const nonce = encryptedBytes.slice(0, 12);
    const ciphertext = encryptedBytes.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      cryptoKey,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
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

  // Strict validation: decrypt the hex string and see if it equals our secret|email
  if (!params.key || typeof params.key !== 'string') {
    notFound();
  }
  
  const decrypted = await decryptSecret(params.key, secretKey);
  if (!decrypted) {
    notFound();
  }

  const parts = decrypted.split('|');
  if (parts.length !== 2 || parts[0] !== secretKey) {
    notFound();
  }

  const prefilledEmail = parts[1];

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

        <AdminLoginForm magicKey={params.key} prefilledEmail={prefilledEmail} />
      </div>
    </div>
  );
}
