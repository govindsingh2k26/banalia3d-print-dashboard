import { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { ShoppingBag, ArrowRight, Sparkles, Sliders, MessageSquare, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Custom Visualizer Sandbox State
  const [sandboxType, setSandboxType] = useState<'nameplate' | 'nfc'>('nameplate');
  const [customPlateText, setCustomPlateText] = useState('BANALIA');
  const [nfcLink, setNfcLink] = useState('https://www.instagram.com/banalia3d/');
  const [isNfcSimulating, setIsNfcSimulating] = useState(false);
  const [selectedPlateColor, setSelectedPlateColor] = useState('cyan');
  
  const categories = ['all', 'Custom Name Plates', 'NFC Keychains & Pendants', 'Anime Figures', 'Planters & Decor', 'Personalized Gifts', 'Utility Products'];

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleNfcSimulate = (e: any) => {
    e.preventDefault();
    setIsNfcSimulating(true);
    setTimeout(() => {
      setIsNfcSimulating(false);
    }, 2200);
  };

  const getWhatsAppLink = (product: Product, extraInfo = "") => {
    const text = encodeURIComponent(`${product.whatsappMessage}${extraInfo} [Website Inquiry]`);
    return `https://wa.me/917408647600?text=${text}`;
  };

  return (
    <section id="products" className="py-24 relative overflow-hidden bg-transparent">
      
      {/* Background neon blur */}
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-cyan-400 mb-4 uppercase tracking-[3px]">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
            <span>Digital Showroom</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">3D Showroom</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-light">
            Explore our curated catalog of ultra-precise custom items. Every order is manufactured locally in India with high-grade sustainable composites and rigorous mechanical tolerance controls.
          </p>
        </div>

        {/* INTERACTIVE MULTI-PREVIEW CONFIGURATION COCKPIT */}
        <div className="mb-20 glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative bg-[#050505]/30 backdrop-blur-md">
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-mono tracking-widest rounded-full uppercase font-bold">
            Interactive Simulator
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visualiser Settings Form */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>Interactive Real-time Preview</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Customise options on the spot to see how Banalia3D calculates and prepares layouts.
                </p>
              </div>

              {/* Selector */}
              <div className="grid grid-cols-2 gap-2 bg-[#050505]/60 p-1.5 rounded-xl border border-white/10">
                <button
                  id="sandbox-opt-nameplate"
                  onClick={() => setSandboxType('nameplate')}
                  className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    sandboxType === 'nameplate' 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-red-500/10 text-cyan-300 border border-cyan-400/30 shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  3D NAME PLATE
                </button>
                <button
                  id="sandbox-opt-nfc"
                  onClick={() => setSandboxType('nfc')}
                  className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    sandboxType === 'nfc' 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-red-500/10 text-rose-300 border border-rose-400/30 shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  SMART NFC TAG
                </button>
              </div>

              {/* Sandbox controls: Name plate */}
              {sandboxType === 'nameplate' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">CUSTOMIZE STRING (TEXT)</label>
                    <input
                      id="input-preview-text"
                      type="text"
                      maxLength={14}
                      value={customPlateText}
                      onChange={(e) => setCustomPlateText(e.target.value.toUpperCase())}
                      placeholder="ENTER NAME"
                      className="w-full bg-[#050505]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">Max 14 capital letters. Standard mechanical clearance.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">LED NEON EMBOSSED COLOR</label>
                    <div className="flex gap-2">
                       {[
                        { id: 'cyan', color: 'bg-cyan-400', label: 'Laser Cyan' },
                        { id: 'red', color: 'bg-rose-500', label: 'Volcanic Red' },
                        { id: 'purple', color: 'bg-purple-500', label: 'Voxel Purple' },
                        { id: 'gold', color: 'bg-amber-400', label: 'Premium Gold' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          id={`color-opt-${item.id}`}
                          onClick={() => setSelectedPlateColor(item.id)}
                          className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                            selectedPlateColor === item.id 
                              ? 'border-cyan-400 bg-cyan-400/5 text-cyan-400 font-semibold' 
                              : 'border-white/5 bg-[#050505]/40 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${item.color} shadow`} />
                          <span className="text-[9px] font-mono tracking-tighter">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <a
                    id="sandbox-order-nameplate"
                    href={`https://wa.me/917408647600?text=${encodeURIComponent(`Hi Banalia3D! I would like to order a Custom Name Plate with the text "${customPlateText}" and backing color "${selectedPlateColor}". [Web Customizer]`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-500 hover:to-red-600 rounded-xl text-xs font-mono font-bold text-white shadow-lg text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ORDER THIS CUSTOM NAME PLATE</span>
                  </a>
                </div>
              )}

              {/* Sandbox controls: NFC keychain */}
              {sandboxType === 'nfc' && (
                <div className="space-y-4 animate-fade-in">
                  <form onSubmit={handleNfcSimulate} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">REDIRECT ACTION URL</label>
                      <input
                        id="input-preview-nfc-link"
                        type="url"
                        value={nfcLink}
                        onChange={(e) => setNfcLink(e.target.value)}
                        placeholder="e.g. https://instagram.com/myusername"
                        required
                        className="w-full bg-[#050505]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      />
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">Ensure it starts with http:// or https://</span>
                    </div>

                    <button
                      id="btn-nfc-simulate"
                      type="submit"
                      disabled={isNfcSimulating}
                      className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono font-bold hover:bg-rose-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap className={`w-4 h-4 ${isNfcSimulating ? 'animate-bounce' : ''}`} />
                      <span>{isNfcSimulating ? 'TRANSMITTING CHIP CARRIER...' : 'SIMULATE MOBILE SMARTPHONE TAP'}</span>
                    </button>
                  </form>

                  <a
                    id="sandbox-order-nfc"
                    href={`https://wa.me/917408647600?text=${encodeURIComponent(`Hi Banalia3D! I would like to order a Custom NFC smart keychain programmed to link to: ${nfcLink}. [Web Customizer]`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-500 hover:to-red-600 rounded-xl text-xs font-mono font-bold text-white shadow-lg text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ORDER PROGRAMMED KEYCHAIN</span>
                  </a>
                </div>
              )}

            </div>

            {/* Visualizer Renderer screen */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center">
              
              <div className="w-full max-w-md aspect-[16/10] bg-white/5 rounded-2xl border border-white/10 relative shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 backdrop-blur-3xl">
                
                {/* Visual accents in the background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-red-500/10 filter blur-2xl pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[9px] font-mono text-cyan-400 tracking-wider">HOLO-TERMINAL EMULATION</span>
                </div>

                {sandboxType === 'nameplate' && (
                  <div className="text-center relative z-10 w-full px-4 animate-fade-in">
                    {/* Simulated 3D Acrylic plate container */}
                    <div className="relative mx-auto max-w-sm border-2 border-dashed border-cyan-400/30 rounded-xl p-4 bg-gray-900/40 shadow-2xl backdrop-blur-sm transition-all duration-300">
                      
                      {/* Glow outline behind */}
                      <div className={`absolute inset-0 opacity-10 blur-xl rounded-xl transition-all ${
                        selectedPlateColor === 'red' ? 'bg-rose-500' :
                        selectedPlateColor === 'purple' ? 'bg-purple-600' :
                        selectedPlateColor === 'gold' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />

                      {/* Laser point effects on corners */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />

                      {/* Plate texture & text */}
                      <div className="flex flex-col items-center justify-center py-6 border border-white/10 rounded-lg bg-gray-950/80">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">CUSTOM PLIABLE ACRYLIC</span>
                        
                        <h4 className={`text-2xl md:text-3.5xl font-extrabold font-display tracking-widest break-all px-4 transition-colors ${
                          selectedPlateColor === 'red' ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                          selectedPlateColor === 'purple' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
                          selectedPlateColor === 'gold' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' :
                          'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                        }`}>
                          {customPlateText || "ENTER NAME"}
                        </h4>

                        <div className="mt-4 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">MATTE PLA LAYER CLEARED</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-1">
                      <p className="text-[10px] font-mono text-gray-400">MATERIAL: Custom Multi-layer Co-Polyester PLA</p>
                      <p className="text-[9px] font-mono text-cyan-400/70">LAYER TOLERANCE: ±0.04mm. SLICE ESTIMATE: 3.5 HOURS.</p>
                    </div>
                  </div>
                )}

                {sandboxType === 'nfc' && (
                  <div className="text-center relative z-10 w-full px-4 animate-fade-in flex flex-col items-center">
                    
                    {/* Phone transmitter graphic */}
                    <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-gray-900 border border-white/10 shadow-2xl">
                      
                      {/* Interactive scanning pulse layers */}
                      {isNfcSimulating && (
                        <>
                          <div className="absolute inset-0 rounded-full border-2 border-pink-500/70 animate-ping" />
                          <div className="absolute -inset-4 rounded-full border border-pink-500/30 animate-ping" />
                        </>
                      )}

                      <div className="flex flex-col items-center gap-1 text-pink-400">
                        <Zap className={`w-8 h-8 ${isNfcSimulating ? 'animate-pulse text-pink-500' : 'text-pink-400'}`} />
                        <span className="text-[9px] font-mono font-bold">NTAG213</span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 max-w-sm">
                      {isNfcSimulating ? (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 animate-pulse">
                          <span className="text-xs font-mono text-emerald-400 font-bold block uppercase">✓ CONTACTLESS CHIP READ DETECTED</span>
                          <span className="text-[9px] font-mono text-gray-400 truncate block">Launching Web Resource: {nfcLink}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-gray-400 block h-10">
                          Place an NFC smartphone close to Banalia3D pendant to trigger the link: <br />
                          <span className="text-emerald-400 underline truncate block text-[11px] mt-1">{nfcLink}</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex gap-4 text-[9px] font-mono text-gray-500 border-t border-white/5 pt-3 w-full justify-center">
                      <span>ANTENNA: DUAL LAYER RESIN</span>
                      <span>FREQ: 13.56 MHz</span>
                    </div>

                  </div>
                )}

              </div>
              
            </div>

          </div>
        </div>

        {/* CLASSIFIED FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/[^a-z]/g, '')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-red-500/20 text-cyan-400 border border-cyan-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'ALL PRODUCTS' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              id={`product-card-${p.id}`}
              className={`rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                p.id === 'nfc-keychain' || p.id === 'anime-figures' 
                  ? 'glass-card-red' 
                  : 'glass-card-blue'
              }`}
            >
              {/* Product preview banner node */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-900 border-b border-white/5 group">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90"
                />
                
                {/* Category label */}
                <span className="absolute top-3 left-3 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded bg-black/80 text-white border border-white/10">
                  {p.category}
                </span>

                {/* Estimate range label */}
                <span className="absolute bottom-3 right-3 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-md">
                  {p.priceEstimate}
                </span>
              </div>

              {/* Product details */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-white tracking-wide">{p.name}</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">{p.description}</p>
                </div>

                {/* Tag markers */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-4 mt-auto">
                  
                  {/* WhatsApp Primary click button */}
                  <a
                    id={`btn-order-wa-${p.id}`}
                    href={getWhatsAppLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-500 hover:to-red-600 transition-all text-xs font-mono font-bold text-white tracking-widest text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ORDER ON WHATSAPP</span>
                  </a>

                  {/* Amazon & Meesho secondary link panel */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      id={`btn-shop-amazon-${p.id}`}
                      href={p.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-mono font-bold text-gray-300 text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>AMAZON</span>
                    </a>
                    <a
                      id={`btn-shop-meesho-${p.id}`}
                      href={p.meeshoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-mono font-bold text-pink-400 text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>MEESHO</span>
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECURITY & QUALITY BULLET TRUST SHIELD */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 rounded-xl hover:bg-white/2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider font-mono">100% QUALITY INSPECT</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Dual checklist inspection for structural layers, adhesion parameters, and chip functionality on every singular batch piece.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 rounded-xl hover:bg-white/2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider font-mono">SUSTAINABLE MATERIALS</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Extruded using renewable zero-toxic organic cornstarch polymers, making our functional products completely child-safe.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 rounded-xl hover:bg-white/2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-400/20 flex items-center justify-center text-pink-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wider font-mono">PAN-INDIA DELIVERY</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Fast-shipping partnerships door-to-door with leading express logistics covering all major pin codes across India securely.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
