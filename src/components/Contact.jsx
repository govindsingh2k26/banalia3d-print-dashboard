import React, { useState } from 'react'
import { SITE } from '../data/config'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('Custom 3D Print Inquiry')
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#0A0A0A]/2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#0A0A0A]">
            Get in Touch
          </h2>
          <p className="text-[#0A0A0A]/60">
            Have a custom design in mind? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-lg border border-[#E8E3DD] text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-black text-[#0A0A0A] mb-1">WhatsApp</h3>
            <p className="text-sm text-[#0A0A0A]/60 mb-3">Chat directly</p>
            <p className="text-xs font-mono text-[#0A0A0A]">{SITE.whatsappNumber}</p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="p-6 bg-white rounded-lg border border-[#E8E3DD] text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-black text-[#0A0A0A] mb-1">Email</h3>
            <p className="text-sm text-[#0A0A0A]/60 mb-3">Send details</p>
            <p className="text-xs font-mono text-[#0A0A0A] break-all">{SITE.email}</p>
          </a>

          {/* Instagram */}
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-lg border border-[#E8E3DD] text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">📷</div>
            <h3 className="font-black text-[#0A0A0A] mb-1">Instagram</h3>
            <p className="text-sm text-[#0A0A0A]/60 mb-3">Follow us</p>
            <p className="text-xs font-mono text-[#0A0A0A]">@banalia3d</p>
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg border border-[#E8E3DD] p-8 md:p-12">
          <h3 className="text-2xl font-black text-[#0A0A0A] mb-6">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#0A0A0A] transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#0A0A0A] transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#0A0A0A] transition resize-none"
                placeholder="Tell us about your custom design idea..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A0A0A] text-[#F6F2ED] font-bold rounded-lg hover:opacity-80 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
