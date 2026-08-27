import React from 'react'
import { SITE, SOCIAL } from '../data/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#E8E3DD] bg-[#0A0A0A] text-[#F6F2ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F6F2ED] rounded-lg flex items-center justify-center text-[#0A0A0A] text-xs font-black">
                B3D
              </div>
              <span className="font-black text-sm">{SITE.name}</span>
            </div>
            <p className="text-xs text-[#F6F2ED]/60">
              Premium custom 3D printing in Noida, India. Your ideas, perfectly printed.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2 text-xs text-[#F6F2ED]/60">
              <li><a href="#products" className="hover:text-[#F6F2ED] transition">Products</a></li>
              <li><a href="#blog" className="hover:text-[#F6F2ED] transition">Blog</a></li>
              <li><a href="#contact" className="hover:text-[#F6F2ED] transition">Contact</a></li>
            </ul>
          </div>

          {/* Channels */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2 text-xs text-[#F6F2ED]/60">
              <li><a href={`mailto:${SITE.email}`} className="hover:text-[#F6F2ED] transition">Email</a></li>
              <li><a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#F6F2ED] transition">WhatsApp</a></li>
              <li><a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F6F2ED] transition">Instagram</a></li>
            </ul>
          </div>

          {/* Storefronts */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2 text-xs text-[#F6F2ED]/60">
              <li><a href={SITE.amazonUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F6F2ED] transition">Amazon</a></li>
              <li><a href={SITE.meeshoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F6F2ED] transition">Meesho</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F6F2ED]/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-mono text-[#F6F2ED]/60">
              © {currentYear} {SITE.name}. Proudly made in {SITE.location}.
            </p>
            <div className="flex gap-4">
              {SOCIAL.map(social => (
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
