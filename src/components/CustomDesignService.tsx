import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Layers, 
  Cpu, 
  CheckCircle, 
  Calculator, 
  MessageSquare, 
  Save, 
  FolderOpen, 
  Trash2, 
  Check, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

export default function CustomDesignService() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Instant Estimation Calculator State
  const [material, setMaterial] = useState<'PLA' | 'PETG' | 'ABS' | 'Resin'>('PLA');
  const [infill, setInfill] = useState<number>(25); // Infill density
  const [length, setLength] = useState<number>(10); // in cm
  const [width, setWidth] = useState<number>(10); // in cm
  const [height, setHeight] = useState<number>(5); // in cm
  const [ideaText, setIdeaText] = useState('');

  // Firestore quote state integrations
  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch helper for quotes
  const fetchQuotes = async () => {
    if (!user) {
      setSavedQuotes([]);
      return;
    }
    setIsFetching(true);
    try {
      const quotesCol = collection(db, 'quotes');
      const q = query(quotesCol, orderBy('createdAt', 'desc'));
      const qs = await getDocs(q);
      const list: any[] = [];
      qs.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.userId === user.uid) {
          list.push({ id: docSnap.id, ...d });
        }
      });
      setSavedQuotes(list);
    } catch (error) {
      console.error("Error drawing design quotes from cloud db:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Synchronize design quotes whenever active user session flips
  useEffect(() => {
    fetchQuotes();
  }, [user]);

  const handleSaveQuote = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await addDoc(collection(db, 'quotes'), {
        userId: user.uid,
        material,
        infill,
        dimensions: {
          length,
          width,
          height
        },
        estimatedWeight: estimatedWeightGrams,
        estimatedPrice: finalPriceEstimate,
        ideaText: ideaText || 'My custom 3D model project design',
        createdAt: serverTimestamp()
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchQuotes();
    } catch (err) {
      console.error("Error writing saved quote model to DB:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      await deleteDoc(doc(db, 'quotes', quoteId));
      fetchQuotes();
    } catch (err) {
      console.error("Error dropping selected quote document:", err);
    }
  };

  const steps = [
    {
      title: 'IDEA / CAD FILE',
      icon: Lightbulb,
      subtitle: 'Conceptualization',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-400/25',
      glow: 'shadow-cyan-400/10',
      description: 'You send us your visual idea, hand-drawn vector sketches, or high-tolerance standard CAD files (STL, OBJ, STP, 3MF). Don\'t have a file? Don\'t worry, our in-house engineers can sculpt it for you from scratch!',
      checklist: [
        'Supports standard formats: .STL, .STP, .STEP, .OBJ, .3MF',
        'Optional dimensional drawing input with millimeter specifications',
        'Expert guidance on high-impact wall structures and draft overhangs'
      ]
    },
    {
      title: '3D CAD DESIGN',
      icon: Layers,
      subtitle: 'Slicing & Tuning',
      color: 'text-purple-400',
      borderColor: 'border-purple-400/25',
      glow: 'shadow-purple-400/10',
      description: 'Our team performs structural checks for structural engineering flaws. We then optimize placement, design support scaffoldings, and slice using customized OrcaSlicer templates tuned precisely to our premium machines.',
      checklist: [
        'Wall thickness optimization to avoid printing splits and high warping',
        'Support generation using modern, clean organic-tree patterns',
        'Preview blueprints shared with you for design confirmation'
      ]
    },
    {
      title: 'PRECISION PRINTING',
      icon: Cpu,
      subtitle: 'Additive Synthesis',
      color: 'text-pink-400',
      borderColor: 'border-pink-400/25',
      glow: 'shadow-pink-400/10',
      description: 'Your design is fabricated inside our closed-chamber high-speed CoreXY custom printers or carbon-shielded Resin tanks, producing consistent layers with tight dimensional resolution.',
      checklist: [
        'CoreXY speeds of up to 250mm/s for rapid prototype shipments',
        '0.04mm extrusion layer tolerances for ultra-smooth tactile finishes',
        'Consistent thermal controls preventing layer-shifts or structural fractures'
      ]
    },
    {
      title: 'SECURE DELIVERY',
      icon: CheckCircle,
      subtitle: 'Premium Fulfillment',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-400/25',
      glow: 'shadow-emerald-400/10',
      description: 'We perform sandblasting post-processing, inspect the structural integrity of thin joints, pack the item carefully inside double-layered heavy bubble wrap boxes, and dispatch via premium express air shipping.',
      checklist: [
        'Post-print structural layer checks ensuring no fragile sections',
        'Sandblast polishing options for clean finish textures',
        'Tracking links provided on WhatsApp; safe handoff guaranteed across India'
      ]
    }
  ];

  // Logic to calculate estimated weight and price in Indian Rupees (INR)
  // Weight estimation: volume * infill factor * material density
  const volume = length * width * height; // in cm3
  const infillFactor = (infill / 100) * 0.4 + 0.6; // 0.6 to 1.0 multiplier
  const densityMultiplier = material === 'Resin' ? 1.2 : material === 'PETG' ? 1.27 : material === 'ABS' ? 1.04 : 1.24; // PLA
  const estimatedWeightGrams = Math.round(volume * densityMultiplier * infillFactor * 0.4); // lightweight estimation
  
  // Calculate price estimate based on grams and machine run-time
  // Material price/gram + base machine operating cost
  const materialCostPerGram = material === 'Resin' ? 8 : material === 'PETG' ? 5 : material === 'ABS' ? 6 : 4; // PLA is cheapest
  const machineRunCost = Math.round((volume * 0.3) * 15); // larger is slower
  const rawPrice = (estimatedWeightGrams * materialCostPerGram) + machineRunCost + 150; // base startup cost
  const finalPriceEstimate = Math.max(199, Math.round(rawPrice));

  const getEstimatorWhatsAppLink = () => {
    const textDetails = `Hi Banalia3D! I calculated a Custom Design Quote on your website.
Details:
- Material: ${material}
- Dimensions: ${length}cm (L) x ${width}cm (W) x ${height}cm (H)
- Infill Density: ${infill}%
- Estimated weight: ~${estimatedWeightGrams}g
- Estimated Price: ₹${finalPriceEstimate}
- My Idea: ${ideaText || "I want to custom print a prototype model"}`;
    return `https://wa.me/917408647600?text=${encodeURIComponent(textDetails)}`;
  };

  return (
    <section id="workflow" className="py-24 relative overflow-hidden">
      
      {/* Background shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-400/20 text-xs font-mono text-purple-400 mb-4 uppercase tracking-[3px]">
            <Layers className="w-4 h-4" />
            <span>Industrial Workflow</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Cohesive <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Design Timeline</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            From an initial abstract thought on paper to a highly precise tactile object held in your hands. Click each step below to inspect how we enforce production metrics.
          </p>
        </div>

        {/* TIMELINE INTERACTION WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Timeline Nodes Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  id={`timeline-step-btn-${index}`}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                    isActive 
                      ? `glass-panel bg-white/10 ${step.borderColor} ${step.glow} border-l-4 border-l-cyan-400 shadow-xl backdrop-blur-md scale-[1.01]` 
                      : 'glass-panel border-white/5 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-tr from-cyan-400 to-red-500 text-white' 
                      : 'bg-[#050505] text-gray-500 border border-white/5'
                  }`}>
                    <StepIcon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">STAGE 0{index + 1}</span>
                    <span className="block text-sm font-bold font-display text-white mt-0.5 tracking-wide">{step.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Connected Stage Detail Display Card */}
          <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl border border-white/10 min-h-[300px] flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md bg-white/5">
            
            {/* Grid graphic */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded">
                    {steps[activeStep].subtitle}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-2 tracking-wide">{steps[activeStep].title}</h3>
                </div>
                <div className="text-[40px] font-bold text-gray-800 font-mono select-none">
                  0{activeStep + 1}
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div>
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">QUALITY ASSURANCE CHECKLIST</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {steps[activeStep].checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/2">
                      <span className="text-cyan-400 select-none font-bold font-mono">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              <span className="text-xs font-mono text-gray-500 font-bold">CURRENT STAGE PARAMETERS CONFIGURED IN REALTIME</span>
              <a 
                id="timeline-read-guidelines"
                href="#contact" 
                className="text-xs font-mono text-cyan-400 hover:text-white transition-colors flex items-center gap-1 hover:underline"
              >
                <span>Browse our engineering capabilities</span>
                <span className="text-[10px]">→</span>
              </a>
            </div>

          </div>

        </div>

        {/* QUOTE ACTION SPACE & INSTANT PRICE ESTIMATOR */}
        <div id="calculator-anchor" className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md bg-[#050505]/40">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form settings */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-white flex items-center gap-2">
                  <Calculator className="w-5.5 h-5.5 text-cyan-400" />
                  <span>Instant Print Price Estimator</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Adjust dimensions, materials, and fill density to instantly calculate a weight and startup build fee. No login required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Material Choice */}
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">FILAMENT MATERIAL</label>
                  <select
                    id="calc-material-select"
                    value={material}
                    onChange={(e: any) => setMaterial(e.target.value)}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 font-semibold"
                  >
                    <option value="PLA" className="bg-[#0b0b0d]">PLA (Standard, High Polish, Eco Vibe)</option>
                    <option value="PETG" className="bg-[#0b0b0d]">PETG (Waterproof, Elastic Strength)</option>
                    <option value="ABS" className="bg-[#0b0b0d]">ABS (Tough, High Heat Resistance)</option>
                    <option value="Resin" className="bg-[#0b0b0d]">Resin SLA (Microscopic Details, Smooth)</option>
                  </select>
                </div>

                {/* Infill slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">INFILL DENSITY</label>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{infill}%</span>
                  </div>
                  <input
                    id="calc-infill-slider"
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                    <span>10% (Draft)</span>
                    <span>40% (Structural)</span>
                    <span>100% (Solid Gear)</span>
                  </div>
                </div>

              </div>

              {/* Dimensional Sliders */}
              <div className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/2">
                <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">BOUNDING BOX BOUNDS (CM)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Length slider */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                      <span>LENGTH</span>
                      <span className="text-white font-bold">{length} cm</span>
                    </div>
                    <input
                      id="calc-length-slider"
                      type="range"
                      min={2}
                      max={40}
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Width slider */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                      <span>WIDTH</span>
                      <span className="text-white font-bold">{width} cm</span>
                    </div>
                    <input
                      id="calc-width-slider"
                      type="range"
                      min={2}
                      max={40}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Height slider */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                      <span>HEIGHT</span>
                      <span className="text-white font-bold">{height} cm</span>
                    </div>
                    <input
                      id="calc-height-slider"
                      type="range"
                      min={1}
                      max={40}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Description Idea Input */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">BRIEFLY DESCRIBE YOUR DESIGN IDEA</label>
                <textarea
                  id="calc-idea-textarea"
                  rows={2}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="e.g. A hollow robotic handle with internal structural screw cylinders..."
                  className="w-full bg-[#050505]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>

            </div>

            {/* Calculations Render Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center flex flex-col justify-between h-full relative backdrop-blur-3xl shadow-2xl">
                
                {/* Neon blur accent */}
                <div className="absolute inset-0 bg-cyan-400/2 opacity-5 blur-xl rounded-2xl" />

                <div className="space-y-4 relative z-10 font-sans">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">MATHEMATICAL BOUNDS ANALYSIS</span>
                  
                  <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">ESTIMATED WEIGHT</span>
                      <span className="block text-lg font-bold font-display text-cyan-400 mt-1">~{estimatedWeightGrams} Grams</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">DENSITY MODE</span>
                      <span className="block text-lg font-bold font-display text-purple-400 mt-1">{(infill / 100) > 0.6 ? 'SOLID STRUCT' : 'BALANCED'}</span>
                    </div>
                  </div>

                  <div className="py-2">
                    <span className="text-xs font-mono text-gray-400 block mb-1">TOTAL STARTUP FEE ESTIMATE</span>
                    <span className="text-4xl md:text-5.5xl font-black font-display text-white">
                      ₹{finalPriceEstimate}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-400 mt-1.5 font-semibold">✓ Includes standard quality inspection</span>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left text-[11px] text-gray-400 leading-normal font-light">
                    <span className="text-amber-400 font-bold">Note:</span> Real-time quote factors in base material rates and printer nozzle run-time. Real invoice will be confirmed on WhatsApp based on raw 3D mesh slicing analysis.
                  </div>
                </div>

                <div className="mt-6 relative z-10 flex flex-col gap-3">
                  <a
                    id="calc-submit-wa"
                    href={getEstimatorWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>CLAIM QUOTE ON WHATSAPP</span>
                  </a>

                  {user ? (
                    <button
                      id="calc-save-to-profile"
                      onClick={handleSaveQuote}
                      disabled={isSaving}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-xl text-xs font-mono font-bold text-white transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Save className="w-4 h-4 text-cyan-400" />
                      )}
                      <span>
                        {isSaving ? 'INVOKING ARCHIVE...' : saveSuccess ? 'SAVED TO CLOUD!' : 'SAVE THIS QUOTE TO PROFILE'}
                      </span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-[10px] text-gray-500 font-mono text-center flex items-center justify-center gap-1">
                      <span>💡 Connect your Google Account at top to backup designs!</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* CLOUD HISTORICAL SAVED QUOTES DASHBOARD */}
          {user && (
            <div id="cloud-quotes-dashboard" className="mt-12 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400">
                    <FolderOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                      <span>MY SECURED 3D DESIGN QUOTES PANEL</span>
                      <span className="text-[9px] bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase select-none">
                        FIRESTORE SECURED
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Syncing calculations for {user.email} in real time.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-gray-500">
                  {savedQuotes.length} record{savedQuotes.length === 1 ? '' : 's'} found
                </span>
              </div>

              {isFetching ? (
                <div className="flex items-center justify-center py-8 text-xs font-mono text-cyan-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Invoking Firestore bucket snap...</span>
                </div>
              ) : savedQuotes.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                  <p className="text-xs font-mono text-gray-500">
                    You haven't archived any custom quotients yet. Adjust sliders and click "Save This Quote" above to record them securely!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedQuotes.map((qRecord) => (
                    <div 
                      key={qRecord.id}
                      className="bg-white/5 border border-white/5 hover:border-cyan-400/20 p-4 rounded-xl flex flex-col justify-between gap-4 transition-all hover:bg-white/[0.07]"
                    >
                      <div className="space-y-2 font-mono">
                        <div className="flex justify-between items-start">
                          <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 font-bold uppercase">
                            ⚙ {qRecord.material} • {qRecord.infill}%
                          </span>
                          <button
                            onClick={() => handleDeleteQuote(qRecord.id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Drop archive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-gray-400 space-y-1 pt-1.5 border-t border-white/5">
                          <div className="flex justify-between">
                            <span>Sizing Bounds:</span>
                            <span className="text-white font-bold">
                              {qRecord.dimensions?.length} x {qRecord.dimensions?.width} x {qRecord.dimensions?.height} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Computed mass:</span>
                            <span className="text-cyan-400 font-bold">~{qRecord.estimatedWeight}g</span>
                          </div>
                          {qRecord.ideaText && (
                            <div className="text-[10px] text-gray-500 italic truncate pt-1 max-w-xs">
                              "{qRecord.ideaText}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="leading-tight">
                          <span className="block text-[8px] font-mono text-gray-500">EST PRICE</span>
                          <span className="text-lg font-bold text-white font-display">₹{qRecord.estimatedPrice}</span>
                        </div>

                        <a
                          href={`https://wa.me/917408647600?text=${encodeURIComponent(
                            `Hi Banalia3D! I calculated a saved Quote from my customer profile:\n- Material: ${qRecord.material}\n- Dims: ${qRecord.dimensions?.length}x${qRecord.dimensions?.width}x${qRecord.dimensions?.height}cm\n- Infill: ${qRecord.infill}%\n- Grams: ~${qRecord.estimatedWeight}g\n- Price: ₹${qRecord.estimatedPrice}\n- Idea: ${qRecord.ideaText}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>SEND</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
