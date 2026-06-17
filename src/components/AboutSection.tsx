import { Shield, Sparkles, Zap, Award, Target, HelpCircle, HardDrive, Cpu, Settings, Thermometer } from 'lucide-react';

export default function AboutSection() {
  const stats = [
    { label: 'Layer Tolerance Resolution', value: '±0.04mm', desc: 'Precision SLA & FDM extrusion bounds' },
    { label: 'CoreXY Print Acceleration', value: '250 mm/s', desc: 'Rapid prototyping fulfillment rate' },
    { label: 'Available Materials', value: '12+ Composites', desc: 'PLA, PETG, ABS, Resin, Carbon Filament' },
    { label: 'Quality Control Inspections', value: 'Dual Checklist', desc: 'Individual part stress & chip tested' }
  ];

  const specs = [
    { title: 'Thermal Control Base', value: 'Up to 300°C', icon: Thermometer, desc: 'Allows industrial nylon & carbon fiber composite printing' },
    { title: 'Microscopic SLA Precision', value: '0.05mm Layers', icon: Cpu, desc: 'Unparalleled liquid resin details for anime figures and gears' },
    { title: 'Advanced Slicing Matrix', value: 'OrcaSlicer Engine', icon: Settings, desc: 'Optimized tree supports with minimal material footprints' },
    { title: 'High-Scale Active Beds', value: 'Dual Sized Chambers', icon: HardDrive, desc: 'Accommodating large components up to 40 x 40 x 40 cm' }
  ];

  return (
    <section id="specs-about" className="py-24 relative overflow-hidden bg-transparent border-t border-b border-white/5">
      
      {/* Background neon elements */}
      <div className="absolute top-[20%] right-[-10%] w-80 h-80 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Side: Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-400/20 text-xs font-mono text-cyan-400 mb-2 uppercase tracking-[3px]">
              <Award className="w-4 h-4 animate-bounce" />
              <span>THE BANALIA3D STORY</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
              Pioneering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">Premium Additive</span> Manufacturing
            </h2>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              At **BANALIA3D STUDIO**, we believe that boundaries between physical manufacturing and digital ideas should not exist. What started as a boutique design workshop in India has grown into a high-precision 3D printing and quick-molding studio, servicing creative artists, local startup businesses, and individual custom collectors.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              We replace mass-manufactured plastics with customized, eco-friendly, and durable composites. By combining top-tier CoreXY FDM technologies and high-fidelity SLA liquid resin manufacturing, we deliver products with structural resilience and fine aesthetic details that other standard printers simply cannot replicate.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 hover:bg-white/2 p-2 rounded-lg transition-all">
                <span className="text-cyan-400 text-lg">✦</span>
                <div>
                  <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider">CREATIVE AUTONOMY</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">We translate custom sketches, logos, or parameters into high-quality physical objects.</p>
                </div>
              </div>

              <div className="flex gap-3 hover:bg-white/2 p-2 rounded-lg transition-all">
                <span className="text-purple-400 text-lg">✦</span>
                <div>
                  <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider">TIGHT TOLERANCE</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Dual-checking layer heights and mechanical alignments inside closed build environments.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: High-tech Specs Dashboard */}
          <div className="lg:col-span-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md">
              
              {/* Cyber overlay */}
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  Manufacturing Specifications & Capabilities
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-black/25 border border-white/10 rounded-2xl p-4 hover:border-cyan-400/20 transition-all">
                    <span className="text-2xl md:text-3.5xl font-black font-display text-white tracking-tight">{stat.value}</span>
                    <h4 className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest mt-1.5">{stat.label}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{stat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-cyan-500/5 rounded-2xl p-4 border border-cyan-500/10 flex items-center gap-4 text-xs">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <h5 className="font-mono text-white font-bold uppercase">PROUDLY MADE IN INDIA</h5>
                  <p className="text-[11px] text-gray-400">Serving designers, startups, and hobbyists across all Indian states with express shipping networks.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* TECH SPECS BENTO CARDS */}
        <div className="border-t border-white/5 pt-16">
          <div className="max-w-3xl mb-12">
            <h3 className="text-lg font-mono text-white font-bold tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-600 block rounded" />
              machinery & materials hardware specs
            </h3>
            <p className="text-xs text-gray-400 mt-1">Our printing rigs utilize customized high-temperature direct extruders and calibrated SLA printers to support heavy specifications:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specs.map((spec, idx) => {
              const SpecIcon = spec.icon;
              return (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:hover:border-cyan-400/20 transition-all flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-cyan-400 mb-4">
                    <SpecIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-lg font-black font-display text-white tracking-tight block">{spec.value}</span>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold mt-1.5">{spec.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">{spec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
