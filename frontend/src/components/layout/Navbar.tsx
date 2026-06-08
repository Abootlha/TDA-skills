"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Search, User, Home, ChevronDown, LogIn, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { AuthModal } from "../auth/AuthModal"
import { useCartStore } from "@/lib/store/cartStore"

const NAV_LINKS = [
  { name: "Courses", href: "/courses", hasDropdown: true },
  { name: "NVQ & Qualification", href: "/nvqs", hasDropdown: true },
  { name: "CSCS & CPCS Card", href: "/cscs", hasDropdown: true },
  { name: "CITB Test", href: "/citb-test", hasDropdown: true },
  { name: "About Us", href: "/about" },
  { name: "Resources", href: "/resources", hasDropdown: true },
  { name: "Contact Us", href: "/contact" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false)
  const pathname = usePathname()
  const cartItems = useCartStore((state) => state.items)

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Detect scroll to trigger animation
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 ease-in-out bg-[#001430]",
      isScrolled
        ? "h-20 rounded-b-[2rem] shadow-lg border-b-0"
        : "h-24 border-b border-white/10"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/TDA-logo.svg"
            alt="TDA Skills"
            className={cn(
              "w-auto object-contain transition-all duration-300 scale-125 md:scale-[1.6] origin-left",
              isScrolled ? "h-[60px] md:h-[65px]" : "h-[70px] md:h-[80px]"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[14px] font-semibold transition-all h-full flex items-center gap-1.5",
                  isActive
                    ? "text-[#FFB800]"
                    : "text-white hover:text-[#FFB800]"
                )}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown size={16} className="shrink-0 opacity-80" />}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <button className="text-white hover:text-[#FFB800] transition-colors p-2 cursor-pointer">
            <Search size={22} />
          </button>

          <Link href="/checkout" className="relative text-white hover:text-[#FFB800] transition-colors p-2">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFB800] text-black font-bold text-xs rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
              className={cn(
                "hover:text-[#FFB800] transition-colors p-2 cursor-pointer flex items-center gap-1",
                isProfileDropdownOpen ? "text-[#FFB800]" : "text-white"
              )}
            >
              <User size={22} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false)
                    setIsAuthModalOpen(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#002855] hover:bg-[#FFF9E6] hover:text-[#FFB800] transition-colors group"
                >
                  <div className="bg-gray-50 p-2 rounded-md group-hover:bg-[#FFB800]/20 transition-colors">
                    <LogIn size={16} />
                  </div>
                  Login / Sign Up
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                <Link
                  href="/portal"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#002855] hover:bg-[#FFF9E6] hover:text-[#FFB800] transition-colors group"
                >
                  <div className="bg-gray-50 p-2 rounded-md group-hover:bg-[#FFB800]/20 transition-colors">
                    <GraduationCap size={16} />
                  </div>
                  Learner Portal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/checkout" className="relative text-white p-2">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFB800] text-black font-bold text-xs rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-[#FFB800] transition-colors p-2 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cn(
          "lg:hidden absolute left-0 w-full bg-white border-b border-[var(--border)] shadow-lg animate-in slide-in-from-top-2",
          isScrolled ? "top-20 rounded-b-[2rem]" : "top-24"
        )}>
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "py-3 px-4 rounded-md text-base font-bold tracking-wider transition-colors flex items-center gap-2",
                    isActive ? "bg-[#FFF9E6] text-[#FFB800]" : "text-[#002855] hover:bg-[var(--surface)]"
                  )}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown size={16} className="ml-auto opacity-80" />}
                </Link>
              )
            })}
            <div className="h-px bg-[var(--border)] my-3 mx-4" />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsAuthModalOpen(true)
              }}
              className="w-full text-left py-3 px-4 rounded-md text-base font-bold tracking-wider text-[#002855] hover:bg-[var(--surface)] flex items-center gap-2"
            >
              <User size={20} />
              Login / Sign Up
            </button>
          </nav>
        </div>
      )}
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  )
}
