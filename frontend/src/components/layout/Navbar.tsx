"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Search, User, Home, ChevronDown, ChevronRight, LogIn, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { useCartStore } from "@/lib/store/cartStore"
import { CartSidebar } from "@/components/cart/CartSidebar"

const NAV_LINKS = [
  { 
    name: "Courses", 
    href: "/courses", 
    hasDropdown: true,
    dropdownItems: [
      {
        name: "CITB Courses",
        href: "/courses/citb",
        subItems: [
          { name: "SMSTS Course Online (5 Days)", href: "/courses/smsts" },
          { name: "SMSTS Refresher Course Online (2 Days)", href: "/courses/smsts-r" },
          { name: "SSSTS Course Online (2 Days)", href: "/courses/sssts" },
          { name: "SSSTS Refresher Course Online (1 Day)", href: "/courses/sssts-r" },
          { name: "DRHS", href: "/courses/drhs" },
          { name: "TWCTC", href: "/courses/twctc" },
          { name: "TWSTC", href: "/courses/twstc" },
        ]
      },
      {
        name: "Green CSCS Courses",
        href: "/courses/green-cscs",
      },
      {
        name: "IOSH Courses",
        href: "/courses/iosh",
      }
    ]
  },
  { 
    name: "NVQs & Qualifications", 
    href: "/nvqs", 
    hasDropdown: true,
    dropdownItems: [
      { name: "Business & Management", href: "/nvqs/business" },
      { 
        name: "Construction", 
        href: "/nvqs/construction",
        subItems: [
          { name: "Level 2", href: "/nvqs/construction/level-2" },
          { name: "Level 3", href: "/nvqs/construction/level-3" },
          { name: "Level 4", href: "/nvqs/construction/level-4" },
          { name: "Level 5", href: "/nvqs/construction/level-5" },
          { name: "Level 6", href: "/nvqs/construction/level-6" },
          { name: "Level 7", href: "/nvqs/construction/level-7" },
        ]
      },
      { 
        name: "Health & Safety", 
        href: "/nvqs/health-safety",
        subItems: [
          { name: "Level 3", href: "/nvqs/health-safety/level-3" },
          { name: "Level 6", href: "/nvqs/health-safety/level-6" },
          { name: "Level 7", href: "/nvqs/health-safety/level-7" },
        ]
      },
      { name: "Health & Social Care", href: "/nvqs/health-social-care" },
      { 
        name: "Plant, Machinery & Crane", 
        href: "/nvqs/plant-machinery",
        subItems: [
          { name: "Level 2", href: "/nvqs/plant-machinery/level-2" },
        ]
      },
    ]
  },
  { 
    name: "CSCS & CPCS Card", 
    href: "/cscs", 
    hasDropdown: true,
    dropdownItems: [
      {
        name: "CSCS CARDS",
        href: "/cscs/cards",
        subItems: [
          { name: "Red Provisional Card", href: "/cscs/red" },
          { name: "Green Labourers Card", href: "/cscs/green" },
          { name: "Blue Skilled Worker Card", href: "/cscs/blue" },
          { name: "Gold Supervisor Card", href: "/cscs/gold" },
          { name: "Black Manager Card", href: "/cscs/black" },
        ]
      },
      {
        name: "CPCS",
        href: "/cscs/cpcs",
        subItems: [
          { name: "CPCS Card", href: "/cscs/cpcs-card" },
          { name: "CPCS Training", href: "/cscs/cpcs-training" },
          { name: "Plant Operator Courses", href: "/cscs/plant-operator" },
        ]
      }
    ]
  },
  { name: "CITB Test", href: "/citb-test" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()
  const { items: cartItems, setSidebarOpen } = useCartStore()

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

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 ease-in-out bg-white shadow-sm",
      isScrolled
        ? "h-20 rounded-b-[2rem] shadow-md border-b-0"
        : "h-24 border-b border-gray-100"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/TDA-logo.webp"
            alt="TDA Skills"
            className={cn(
              "w-auto object-contain transition-all duration-300 scale-125 md:scale-[1.6] origin-left",
              isScrolled ? "h-[60px] md:h-[65px]" : "h-[70px] md:h-[80px]"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-8 h-full">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <div key={link.name} className="relative group/nav">
                <Link
                  href={link.href}
                  className={cn(
                    "text-[12px] lg:text-[13px] 2xl:text-[14px] font-semibold transition-all flex items-center gap-1 py-2",
                    isActive
                      ? "text-[#FFB800]"
                      : "text-[#001430] hover:text-[#FFB800]"
                  )}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  {link.hasDropdown && <ChevronDown size={14} className="shrink-0 opacity-80 group-hover/nav:rotate-180 transition-transform" />}
                </Link>

                {/* Level 1 Dropdown */}
                {link.dropdownItems && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                    <div className="absolute top-0 left-0 w-full h-4 bg-transparent" /> {/* Invisible bridge */}
                    <div className="w-64 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2">
                      {link.dropdownItems.map(item => (
                        <div key={item.name} className="relative group/sub">
                          <Link 
                            href={item.href} 
                            className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-[#001430] hover:text-[#FFB800] transition-colors"
                          >
                            <span>{item.name}</span>
                            {item.subItems && <ChevronRight size={14} className="text-gray-400 group-hover/sub:text-[#FFB800] transition-colors" />}
                          </Link>

                          {/* Level 2 Sub-dropdown */}
                          {item.subItems && (
                            <div className="absolute top-0 left-full pl-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-50">
                              <div className="absolute top-0 left-0 w-2 h-full bg-transparent" /> {/* Invisible bridge */}
                              <div className="w-[280px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2">
                                {item.subItems.map(subItem => (
                                  <Link 
                                    key={subItem.name} 
                                    href={subItem.href} 
                                    className="block px-5 py-3 text-[13px] font-semibold text-[#001430] hover:text-[#FFB800] transition-colors leading-relaxed"
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-4 2xl:gap-6 shrink-0">
          <button className="text-[#001430] hover:text-[#FFB800] transition-colors p-2 cursor-pointer">
            <Search size={20} className="lg:w-[22px] lg:h-[22px]" />
          </button>

          <Link href="/checkout" className="relative text-[#001430] hover:text-[#FFB800] transition-colors p-2">
            <ShoppingCart size={20} className="lg:w-[22px] lg:h-[22px]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFB800] text-black font-bold text-xs rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>


        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/checkout" className="relative text-[#001430] p-2">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFB800] text-black font-bold text-xs rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#001430] hover:text-[#FFB800] transition-colors p-2 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cn(
          "lg:hidden absolute left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2",
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
                    isActive ? "bg-[#FFF9E6] text-[#FFB800]" : "text-[#002855] hover:bg-gray-50"
                  )}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown size={16} className="ml-auto opacity-80" />}
                </Link>
              )
            })}
            <div className="h-px bg-gray-100 my-3 mx-4" />
          </nav>
        </div>
      )}
      <CartSidebar />
    </header>
  )
}
