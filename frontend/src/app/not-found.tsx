import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center bg-white">
      <div className="relative w-full max-w-[500px] aspect-[1002/882] mb-8">
        <Image
          src="/img_404.png"
          alt="404 - Page Not Found"
          fill
          priority
          className="object-contain"
        />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-8 tracking-tight">
        Oops! Page Not found.
      </h1>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded bg-[#FF5A00] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow transition-all hover:bg-[#E04F00] active:scale-95 duration-150"
      >
        Back to Home Page
      </Link>
    </main>
  )
}
