"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-muted py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size="small" variant="dark" linkWrapper={false} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/services" className="nav-link">
            Services
          </Link>
          <Link href="/process" className="nav-link">
            Our Process
          </Link>
          <Link href="/gallery" className="nav-link">
            Gallery
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <a href="tel:+19188565304" className="flex items-center text-navy-dark hover:text-burgundy transition-colors">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">918-856-5304</span>
          </a>
          <Button asChild className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
            <Link href="/schedule">Schedule Service</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-navy-dark"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-ivory border-b border-muted z-50">
          <div className="container mx-auto py-4 flex flex-col space-y-4">
            <Link href="/services" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link href="/process" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>
              Our Process
            </Link>
            <Link href="/gallery" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>
              Gallery
            </Link>
            <Link href="/about" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="pt-2 border-t border-muted">
              <a href="tel:+19188565304" className="flex items-center text-navy-dark py-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">(918) 856-5304</span>
              </a>
              <Button asChild className="w-full mt-2 bg-navy-dark text-ivory hover:bg-navy-dark/90">
                <Link href="/schedule">Schedule Service</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
