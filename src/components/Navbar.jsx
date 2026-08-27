import React from 'react'
import { SITE, SOCIAL } from '../data/config'

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#F6F2ED] border-b border-[#E8E3DD] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#0A0A0A] rounded-lg flex items-center justify-center text-white text-xs font-black">
              B3D
            </div>
            <span className="text-sm font-black tracking-widest hidden sm:inline">
              {SITE.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition">
              Products
            </a>
            <a href="#blog" className="text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition">
              Blog
            </a>
            <a href="#contact" className="text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition">
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:opacity-60 transition"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-[#0A0A0A] font-bold text-xl"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[#E8E3DD] py-4 space-y-3">
            <a href="#products" className="block text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A]">
              Products
            </a>
            <a href="#blog" className="block text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A]">
              Blog
            </a>
            <a href="#contact" className="block text-xs font-mono text-[#0A0A0A]/60 hover:text-[#0A0A0A]">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
