import React from 'react'
import { SITE, STATS } from '../data/config'

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-block mb-6 px-3 py-1 bg-[#0A0A0A]/5 border border-[#E8E3DD] rounded-full">
          <span className="text-xs font-mono text-[#0A0A0A]/70 uppercase tracking-widest">
            ✨ Made in India
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-[#0A0A0A]">
          {SITE.tagline}
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-[#0A0A0A]/60 max-w-2xl mx-auto mb-12 leading-relaxed">
          {SITE.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a
            href={`https://wa.me/${SITE.whatsappNumber}?text=Hi%20BANALIA3D!%20I%20want%20to%20order%20custom%203D%20prints.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#0A0A0A] text-[#F6F2ED] font-bold text-sm rounded-lg hover:opacity-80 transition"
          >
            💬 Chat on WhatsApp
          </a>
          <a
            href="#products"
            className="px-6 py-3 border-2 border-[#0A0A0A] text-[#0A0A0A] font-bold text-sm rounded-lg hover:bg-[#0A0A0A]/5 transition"
          >
            Browse Products
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-[#E8E3DD] pt-8 max-w-sm mx-auto">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-[#0A0A0A]">{stat.value}</div>
              <div className="text-xs font-mono text-[#0A0A0A]/50 mt-1 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
