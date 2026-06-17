import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FeaturedProducts from './components/FeaturedProducts';
import CustomDesignService from './components/CustomDesignService';
import AboutSection from './components/AboutSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import AiAssistant from './components/AiAssistant';
import ThreeCarousel from './components/ThreeCarousel';
import OrderDashboard from './components/OrderDashboard';
import AuthErrorModal from './components/AuthErrorModal';
import { 
  Printer, 
  MessageSquare, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Settings, 
  CheckCircle, 
  Instagram, 
  Github, 
  Globe, 
  HelpCircle,
  Youtube 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'printer' | 'all'>('printer');
  const [customText, setCustomText] = useState('BANALIA');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Track window scroll progression across the entire viewport
  useEffect(() => {
    const handleScroll = () => {
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollHeight > 0) {
        const scrolledPct = (window.scrollY / totalScrollHeight) * 100;
        setScrollProgress(scrolledPct);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-400 selection:text-black relative overflow-hidden">
      
      {/* Thin glowing cyan progress bar tracking user scroll position */}
      <div 
        id="scroll-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 z-[200] transition-all duration-75 ease-out shadow-[0_1px_10px_rgba(34,211,238,0.8),0_0_4px_rgba(34,211,238,0.5)] pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/15 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Futuristic top header element */}
      <Navbar onOpenDashboard={() => setIsDashboardOpen(true)} />

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-6 font-mono">
            NEXT-GEN ADDITIVE MANUFACTURING
          </div>

          <div className="space-y-6 max-w-3xl mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-none tracking-tighter text-white uppercase">
              BANALIA3D<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">
                STUDIO
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              Turning ideas into reality through premium 3D printing. Precision engineering meets artistic creativity. Step into our frosted showroom of custom figures, smart contactless accessories, and high-performance engineering prototypes.
            </p>
          </div>

          {/* Core actionable redirect buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
            
            {/* WA button */}
            <a
              id="hero-cta-whatsapp"
              href="https://wa.me/917408647600?text=Hi%20Banalia3D!%20I%20am%20interested%20in%20creating%20a%20custom%203D%20printed%20design.%20Please%20guide%20me!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-green-500/80 hover:bg-green-500 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest border border-green-400/50 flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-500/10"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>

            {/* Shaper links */}
            <a
              id="hero-cta-amazon"
              href="https://www.amazon.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 transition-all text-white"
            >
              <span>Shop Amazon</span>
            </a>
            <a
              id="hero-cta-meesho"
              href="https://www.meesho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 text-pink-400 hover:text-pink-300 transition-all"
            >
              <span>Shop Meesho</span>
            </a>

          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 border-t border-white/10 pt-8 max-w-lg w-full">
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-display text-white tracking-tight">5,000+</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">Prints Shipped</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-display text-white tracking-tight">4.9★</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">Google Rating</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-display text-white tracking-tight">0.04mm</span>
              <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">Layer Precision</span>
            </div>
          </div>

        </div>

        {/* Centerpiece 3D Carousel Navigation and immersive deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
          <div className="border-t border-white/5 pt-12">
            <ThreeCarousel />
          </div>
        </div>

      </section>

      {/* FEATURED PRODUCTS (DIGITAL SHOWROOM + SANDBOX) */}
      <FeaturedProducts />

      {/* CUSTOM DESIGN TIMELINE WORKFLOW + CALCULATOR */}
      <CustomDesignService />

      {/* ABOUT BANALIA3D AND MACHINERY SPECIFICATIONS */}
      <AboutSection />

      {/* KNOWLEDGE DOCK SEO BLOG */}
      <BlogSection />

      {/* DOCK CONTACT CHANNELS MODULE */}
      <ContactSection />

      {/* FOOTER & GITHUB PAGES / GODADDY INTEGRATOR DOCK */}
      <footer className="bg-gray-950 border-t border-white/5 py-16 relative overflow-hidden">
        <div className="absolute top-[20%] left-[-20%] w-[300px] h-[300px] bg-cyan-500/1 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start mb-12">
            
            {/* Column 1: Intro */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">
                  B
                </div>
                <span className="text-sm font-black tracking-widest font-display text-white">
                  BANALIA<span className="text-cyan-400">3D</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                Futuristic, premium 3D printing and boutique manufacturing studio. We print custom name plates, smart NFC devices, action figures, low-poly planters, and engineering replacements across India since 2024.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  id="foot-instagram-icon"
                  href="https://www.instagram.com/banalia3d/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 hover:border-pink-500 hover:text-pink-400 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  id="foot-youtube-icon"
                  href="https://www.youtube.com/@Banalia3DStudio" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 hover:border-red-500 hover:text-red-400 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a 
                  id="foot-github-icon"
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 hover:border-cyan-500 hover:text-cyan-400 text-gray-500 flex items-center justify-center transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation anchors */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">NAVIGATION CORE</h4>
              <ul className="space-y-2.5 text-xs text-gray-500 font-mono">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">🚀 BACK TO TOP</a></li>
                <li><a href="#products" className="hover:text-cyan-400 transition-colors">🔍 3D CATALOG SHOWROOM</a></li>
                <li><a href="#workflow" className="hover:text-cyan-400 transition-colors">⚙ WORKFLOW TIMELINE</a></li>
                <li><a href="#blog" className="hover:text-cyan-400 transition-colors">💡 INSPIRATION BLOG</a></li>
              </ul>
            </div>

            {/* Column 3: Global tags */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest font-bold">MANUFACTURER CHANNELS</h4>
              <ul className="space-y-2.5 text-xs text-gray-500 font-mono">
                <li><a href="https://wa.me/917408647600" className="hover:text-pink-400 transition-colors">✓ CHAT ON WHATSAPP</a></li>
                <li><a href="https://www.youtube.com/@Banalia3DStudio" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">✓ YOUTUBE CHANNEL</a></li>
                <li><a href="https://www.instagram.com/banalia3d/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">✓ FOLLOW INSTAGRAM</a></li>
                <li><a href="https://www.amazon.in" className="hover:text-pink-400 transition-colors">✓ STOREFRONT AMAZON</a></li>
                <li><a href="https://www.meesho.com" className="hover:text-pink-400 transition-colors">✓ STOREFRONT MEESHO</a></li>
                <li><a href="mailto:contact@banalia3d.com" className="hover:text-pink-400 transition-colors">✓ contact@banalia3d.com</a></li>
              </ul>
            </div>

          </div>

          {/* FOOTER GENERAL INFO & COPYRIGHT */}
          <div className="border-t border-white/5 pt-8 mt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="text-[10px] font-mono text-gray-600">
              Premium custom-built 3D models and high-quality additive printing solutions. All products are fully customizable upon request.
            </div>

            <span className="text-[10px] font-mono text-gray-500">
              © {new Date().getFullYear()} BANALIA3D STUDIO CO. All rights reserved across India.
            </span>

          </div>

        </div>
      </footer>

      {/* Floating Sentry Assistant Chat widget */}
      <AiAssistant />

      {/* Dedicated Orders & Delivery Tracking Dashboard Tray */}
      <OrderDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />

      {/* Diagnostics / Connection Check Overlays */}
      <AuthErrorModal />

    </div>
  );
}
