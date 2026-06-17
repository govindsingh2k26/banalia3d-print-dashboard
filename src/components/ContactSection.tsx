import { useState } from 'react';
import { MessageSquare, Instagram, Mail, MapPin, Sparkles, Send, ShieldCheck, ChevronDown, Youtube } from 'lucide-react';

export default function ContactSection() {
  const [userMsg, setUserMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getCustomMessageLink = () => {
    const defaultText = "Hi Banalia3D! I visited your portfolio website and am interested in your 3D printing custom manufacturing services.";
    const encodedText = encodeURIComponent(userMsg ? `Hi Banalia3D! My request: ${userMsg}` : defaultText);
    return `https://wa.me/917408647600?text=${encodedText}`;
  };

  const faqs = [
    {
      q: 'What is the highest layer precision you can print?',
      a: 'We print standard thermal FDM materials down to 0.1mm increments. For advanced micro-figurines or engineering elements demanding supreme smoothness, we utilize SLA liquid resin printing capable of ultra-fine 0.05mm layer heights with zero visible extrusion lines.'
    },
    {
      q: 'Which raw materials do you support?',
      a: 'We manufacture using biodegradable matte PLA, water-shielded tough PETG, heavy temperature ABS, and specialized engineering-grade carbon-fiber or nylon materials. All PLA filaments are totally toxic-free and children-safe.'
    },
    {
      q: 'What is your typical turnaround time across India?',
      a: 'Standard orders like name plates or keychains are printed, qualitychecked, and shipped within 3 to 5 business days. Complex custom geometric prototype blueprints might take up to 7 to 10 days depending on slicing analysis.'
    },
    {
      q: 'How do you structure custom design pricing?',
      a: 'Pricing is fully modular. It is computed in real-time based on material weight (grams), machinery nozzle runtime, and internal infill density. Try our instant Price Estimator above for a quick breakdown.'
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      
      {/* Background blurs */}
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-cyan-400 mb-4 uppercase tracking-[3px]">
            <MessageSquare className="w-4 h-4 animate-pulse-slow" />
            <span>TRANSMISSION HUB</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">Dual Connect</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Ready to bring your abstract vision to life? Connect directly with Banalia3D Studio on WhatsApp, Instagram, or email. We respond inside 30 minutes.
          </p>
        </div>

        {/* CONTROLLER MATRIX BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
          
          {/* Left panel: Quick message composer */}
          <div className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative flex flex-col justify-between bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">WhatsApp Transmission Stream</h3>
                <p className="text-xs text-gray-400 mt-1">Compose your custom printed requirements below, and we will package it instantly into a secure WhatsApp chat link.</p>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2 font-bold">YOUR PRINT SPECS / GREETING</label>
                <textarea
                  id="wa-custom-msg-input"
                  rows={4}
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder="Hi Banalia3D! I need a custom 15cm name plate with the name 'GOVIND' styled with high neon-blue backlights..."
                  className="w-full bg-[#050505]/80 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-mono text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder-gray-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3.5 bg-black/20 p-3 rounded-xl border border-white/2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono text-gray-400 leading-normal">
                  Your details compile cleanly on the client. We do not store or telemetry any personal message values. Direct secure offload to WhatsApp Web API.
                </span>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <a
                id="btn-composer-submit-wa"
                href={getCustomMessageLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-500 hover:to-red-600 rounded-xl text-xs font-mono font-bold text-white shadow-lg shadow-cyan-500/10 active:scale-98 transition-all flex items-center justify-center gap-2 tracking-widest"
              >
                <Send className="w-4.5 h-4.5" />
                <span>SEND DIRECT STREAM CLIENT WHATSAPP</span>
              </a>
            </div>

          </div>

          {/* Right panel: Static spec badges & channels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Quick Contact badge Cards */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 flex-1 flex flex-col justify-center bg-white/5 backdrop-blur-md">
              
              <a
                id="contact-wa-block"
                href="https://wa.me/917408647600"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/2 hover:border-cyan-400/25 hover:bg-cyan-950/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">HOTLINE WHATSAPP</span>
                  <span className="block text-xs font-mono text-gray-200 group-hover:text-cyan-400 mt-0.5 tracking-wide">+91 74086 47600</span>
                </div>
              </a>

              <a
                id="contact-instagram-block"
                href="https://www.instagram.com/banalia3d/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/2 hover:border-pink-400/25 hover:bg-pink-950/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-400/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">INSTAGRAM CORE</span>
                  <span className="block text-xs font-mono text-gray-200 group-hover:text-pink-400 mt-0.5 tracking-wide">@banalia3d</span>
                </div>
              </a>

              <a
                id="contact-youtube-block"
                href="https://www.youtube.com/@Banalia3DStudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/2 hover:border-red-500/25 hover:bg-red-950/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 flex items-center justify-center shrink-0">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">YOUTUBE PRESENCE</span>
                  <span className="block text-xs font-mono text-gray-200 group-hover:text-red-400 mt-0.5 tracking-wide">@Banalia3DStudio</span>
                </div>
              </a>

              <a
                id="contact-email-block"
                href="mailto:contact@banalia3d.com"
                className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/2 hover:border-purple-400/25 hover:bg-purple-950/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">SECURE INBOX</span>
                  <span className="block text-xs font-mono text-gray-200 group-hover:text-purple-400 mt-0.5 tracking-wide">contact@banalia3d.com</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-3 bg-black/40 rounded-xl border border-dotted border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/5 text-gray-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">HQ LOCALIZATION</span>
                  <span className="block text-xs font-mono text-gray-300 mt-0.5 tracking-wide">Gautam Buddha Nagar, UP, India 🇮🇳</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ACCORDION FAQ BLOCK */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative mb-12 animate-fade-in">
          
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
            <span className="w-1.5 h-3 bg-pink-500 rounded-sm" />
            <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider">FREQUENT BUILD QUERY MATRIX</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => {
              const isSelected = activeFaq === idx;
              return (
                <div
                  key={idx}
                  id={`faq-node-${idx}`}
                  className="bg-black/30 border border-white/2 rounded-xl p-4 transition-all duration-300 hover:border-pink-500/10 cursor-pointer text-left"
                  onClick={() => setActiveFaq(isSelected ? null : idx)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-white font-bold leading-relaxed">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-pink-400 shrink-0 transition-transform duration-300 ${isSelected ? 'rotate-185' : ''}`} />
                  </div>
                  {isSelected && (
                    <p className="text-[11px] text-gray-400 font-mono leading-relaxed mt-3 border-t border-white/5 pt-3 animate-fade-in uppercase">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
