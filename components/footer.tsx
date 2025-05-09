import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Curve AI Solutions</h3>
            <p className="text-gray-400 mb-4">The Anti-Gravity for business. Breakaway with no resistance.</p>
          </div>

          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions/ai-agent" className="text-gray-400 hover:text-white transition">
                  AI Agent Solutions
                </Link>
              </li>
              <li>
                <Link href="/solutions/trading" className="text-gray-400 hover:text-white transition">
                  Trading System Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/solutions/deployment" className="text-gray-400 hover:text-white transition">
                  AI Tools Deployment
                </Link>
              </li>
              <li>
                <Link href="/assessments" className="text-gray-400 hover:text-white transition">
                  AI Assessments
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://twitter.com/curveaisolutions" className="text-gray-400 hover:text-white transition">
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/company/curveaisolutions"
                  className="text-gray-400 hover:text-white transition"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-gray-400 text-center">
            © {new Date().getFullYear()} Curve AI Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
