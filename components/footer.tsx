import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-dark text-ivory">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6">
              <Logo size="small" variant="light" />
            </div>
            <p className="text-ivory/80 mb-6 text-sm leading-relaxed">
              Providing exceptional automotive detailing services with meticulous attention to detail and white-glove
              service since 2005.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/CleanMachineTulsa"
                aria-label="Facebook"
                className="text-ivory/70 hover:text-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/CleanMachineTulsa"
                aria-label="Instagram"
                className="text-ivory/70 hover:text-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-playfair text-lg mb-6">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-gold" />
                <div>
                  <p className="text-sm font-medium">Telephone</p>
                  <a href="tel:+19188565304" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                    (918) 856-5304
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-gold" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:contact@cleanmachinemobile.com"
                    className="text-ivory/80 hover:text-gold transition-colors text-sm"
                  >
                    contact@cleanmachinemobile.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gold" />
                <div>
                  <p className="text-sm font-medium">Service Area</p>
                  <p className="text-ivory/80 text-sm">Tulsa, Oklahoma and surrounding areas</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-playfair text-lg mb-6">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Schedule Service
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-ivory/80 hover:text-gold transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container mx-auto py-6">
          <p className="text-ivory/60 text-sm text-center">
            &copy; {currentYear} Clean Machine Mobile Detailing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
