import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Search, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  MessageSquare, 
  Cpu, 
  Settings, 
  Move, 
  Sun, 
  Layers, 
  Play, 
  Pause, 
  Bot,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';

interface CarouselItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceEstimate: string;
  tags: string[];
  threeDType: string;
  stats: {
    precision: string;
    infill: string;
    time: string;
    material: string;
  };
  promptText: string;
  whatsappMessage: string;
  imageUrl: string;
}

const CAROUSEL_PRODUCTS: CarouselItem[] = [
  {
    id: 'nameplate',
    name: 'Custom Holographic Name Plates',
    category: 'Custom Name Plates',
    description: 'Elevate your entryway or executive desk with multi-layered acrylic name plates. Custom typography, textured backing, and glowing neon highlights.',
    priceEstimate: 'Starts at ₹599',
    tags: ['Custom Text', 'Wall Mount', 'Desk Stand', 'Dual-Extrusion'],
    threeDType: 'nameplate',
    stats: {
      precision: '0.08mm',
      infill: '25% Gyroid',
      time: '6.5 Hours',
      material: 'PETG / Silk PLA'
    },
    promptText: "Can Banalia3D design a custom dual-extrusion desktop nameplate with a matte black backplate and polished copper lettering? How long does it take representing high precision?",
    whatsappMessage: "Hi Banalia3D! I calculated a Custom Name Plate design. Details: ",
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nfc-keychain',
    name: 'Smart NFC Keychains & Badges',
    category: 'NFC Tech Accessories',
    description: 'Tap & Share. Embedded with high-frequency programmable NTAG213 microchips. Share your portfolio or website instantly with a tap near any smartphone.',
    priceEstimate: 'Starts at ₹249',
    tags: ['NFC Tech', 'No Battery', 'Custom Logo', 'Waterproof'],
    threeDType: 'keychain',
    stats: {
      precision: '0.12mm',
      infill: '100% Solid',
      time: '1.2 Hours',
      material: 'Nylon / Tough PLA'
    },
    promptText: "How are the NFC chips embedded into the Banalia3D Smart Keychains? Are they fully waterproof and waterproof during printing?",
    whatsappMessage: "Hi Banalia3D! I am interested in ordering a Smart NFC Keychain that routes to: ",
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'anime-figures',
    name: 'Collector Grade Resin Anime Figures',
    category: 'Anime & Pop Culture',
    description: 'Micro-sculpted anime characters printed via high-end SLA stereolithography photo-polymer resin. Flawless smooth surfaces ready for display paint.',
    priceEstimate: 'Starts at ₹899',
    tags: ['Premium SLA Resin', '0.04mm Layers', 'Ultra Solid', 'Fan Favorite'],
    threeDType: 'anime',
    stats: {
      precision: '0.04mm',
      infill: 'Solid Resin',
      time: '14 Hours',
      material: 'Phrozen Aqua Gray SLA'
    },
    promptText: "What is the custom layer resolution of your SLA resin prints? Do you wash, cure, and post-process action figurines before shipment to ensure a smooth paint-ready surface?",
    whatsappMessage: "Hi Banalia3D! I want to command a Collector-grade Anime Figurine. Character detail: ",
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'planters-decor',
    name: 'Low-Poly Geometric Floral Pots',
    category: 'Minimalist Decor',
    description: 'Modern, procedurally calculated geometric succulent pots with dynamic facets. Self-draining bases, built from eco-friendly bio-filaments.',
    priceEstimate: 'Starts at ₹349',
    tags: ['Procedural Design', 'Biodegradable PLA', 'Self-Organizing', 'Matte Pastels'],
    threeDType: 'planter',
    stats: {
      precision: '0.20mm',
      infill: '15% Grid',
      time: '4.8 Hours',
      material: 'Wood-Fill & PLA Blend'
    },
    promptText: "Are the low-poly succulent planters water-resistant and suitable for real potting soil? Which filament type is best for outdoors?",
    whatsappMessage: "Hi Banalia3D! I want to acquire a Low-Poly Geometric Planter. Details: ",
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'personalized-gifts',
    name: 'Holographic Lithophanes & Lightboxes',
    category: 'Relief Magic Gifts',
    description: 'Capture memories inside lifetime physical plastic overlays. Translucent 3D textures reveal highly polished photo-realistic warm monochrome portraits when backlit.',
    priceEstimate: 'Starts at ₹699',
    tags: ['LED Backlight', 'Relief Sculpture', 'Warm Silhouette', 'Photo-Tech'],
    threeDType: 'gift',
    stats: {
      precision: '0.08mm',
      infill: '100% Solid',
      time: '8.2 Hours',
      material: 'Pro-Filament Bright White'
    },
    promptText: "Explain how 3D lithophanes function! What photo quality guidelines do you recommend to print a sharp illuminated light box?",
    whatsappMessage: "Hi Banalia3D! I want to generate a Custom Relief Photo Lithophane. Please guide me: ",
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'utility-products',
    name: 'Precision Engineering Gear Spindles',
    category: 'Industrial Spares',
    description: 'Nylon-carbon reinforced replacement gears, specialized custom clamps, drone components, mechanical seals, and extreme tensile industrial prototyping.',
    priceEstimate: 'Starts at ₹149',
    tags: ['Nylon / Carbon Fiber', 'Extreme Durability', 'Replacement Gears', 'Chemical Safe'],
    threeDType: 'utility',
    stats: {
      precision: '0.12mm',
      infill: '60% Honeycomb',
      time: '11.5 Hours',
      material: 'Co-Polymer PET-G + Carbon'
    },
    promptText: "What are the structural capabilities of carbon-fiber nylon vs normal PLA for heavy load mechanical gear components? What is the maximum heat resistance?",
    whatsappMessage: "Hi Banalia3D! I need a custom industrial replacement spare or gear shell printed. Details: ",
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ThreeCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Scroll trigger states for morph / texture shift on scroll
  const [scrollProg, setScrollProg] = useState(0);
  const scrollProgRef = useRef(0);
  const inlineCanvasRef = useRef<HTMLDivElement>(null);

  // Immersive Modal Three.js state
  const mountRef = useRef<HTMLDivElement>(null);
  const [spinningSpeed, setSpinningSpeed] = useState(1); // 1 = normal, 0 = paused, 3 = fast
  const [wireframeMode, setWireframeMode] = useState(true);
  const [glowingHue, setGlowingHue] = useState<'cyan' | 'ruby' | 'royal'>('cyan');

  // Multi-model config refs for the simulation
  const configRef = useRef({
    activeIdx,
    spinningSpeed,
    wireframeMode,
    glowingHue
  });

  useEffect(() => {
    configRef.current = {
      activeIdx,
      spinningSpeed,
      wireframeMode,
      glowingHue
    };
  }, [activeIdx, spinningSpeed, wireframeMode, glowingHue]);

  // Track window scroll progression past the hero section
  useEffect(() => {
    const handleScroll = () => {
      // The hero section takes roughly 700-800 pixels of vertical space.
      const currentScroll = window.scrollY;
      const triggerThreshold = 800;
      const prog = Math.min(currentScroll / triggerThreshold, 1.0);
      scrollProgRef.current = prog;
      setScrollProg(prog);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial parse to map scroll immediately on load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // INTERACTIVE INLINE 3D CANVAS VIEWPORT SETUP (Morphs & Texture Shifts dynamically on scroll)
  useEffect(() => {
    if (isFullscreen || !inlineCanvasRef.current) return;

    const container = inlineCanvasRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = null; // transparent to display beautifully on top of grids / fallbacks

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.2);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xff00aa, 1.8);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // MODEL WRAPPER
    const group = new THREE.Group();
    scene.add(group);

    // Render exact shape aligned with selected activeIdx
    let itemMesh: THREE.Mesh | THREE.Group;
    const i = activeIdx;

    if (i === 0) {
      // Nameplates (Beveled Plate Box)
      const geometry = new THREE.BoxGeometry(1.3, 0.7, 0.18);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x00f0ff, 
        metalness: 0.8, 
        roughness: 0.3,
        transparent: true,
        opacity: 0.9
      });
      const plate = new THREE.Mesh(geometry, material);
      const outerEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
      );
      plate.add(outerEdges);
      itemMesh = plate;
    } 
    else if (i === 1) {
      // NFC Keychain: Cylindrical fob with geometric link ring
      const innerGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.22, 24);
      const innerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
      const coreSec = new THREE.Mesh(innerGeo, innerMat);
      coreSec.rotation.x = Math.PI / 2;
      
      const keyGroup = new THREE.Group();
      keyGroup.add(coreSec);
      
      const tor = new THREE.Mesh(
        new THREE.TorusGeometry(0.58, 0.09, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0x9d00ff, metalness: 1.0 })
      );
      tor.position.y = 0.58;
      keyGroup.add(tor);
      itemMesh = keyGroup;
    } 
    else if (i === 2) {
      // Resin Anime Figures (Complex Torus Knot representation)
      const resinGeo = new THREE.TorusKnotGeometry(0.48, 0.15, 80, 10);
      const resinMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.15, metalness: 0.6 });
      itemMesh = new THREE.Mesh(resinGeo, resinMat);
    } 
    else if (i === 3) {
      // Planter (Polygonal Icosahedron geometry)
      const geo = new THREE.IcosahedronGeometry(0.68, 1);
      const mat = new THREE.MeshStandardMaterial({ 
        color: 0x10b981, 
        flatShading: true,
        roughness: 0.6,
        metalness: 0.2
      });
      itemMesh = new THREE.Mesh(geo, mat);
    } 
    else if (i === 4) {
      // Lithophane panel surface
      const curvGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.9, 24, 2, true, 0, Math.PI);
      const curvMat = new THREE.MeshStandardMaterial({ 
        color: 0xfef08a, 
        side: THREE.DoubleSide, 
        roughness: 0.4,
        transparent: true,
        opacity: 0.85
      });
      const panel = new THREE.Mesh(curvGeo, curvMat);
      panel.rotation.y = Math.PI / 2;
      itemMesh = panel;
    } 
    else {
      // Special Industrial replacement sprocket gear
      const outerCircleGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.24, 16);
      const outerCircleMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.2 });
      const gear = new THREE.Mesh(outerCircleGeo, outerCircleMat);
      
      const studGeo = new THREE.BoxGeometry(0.14, 0.18, 0.14);
      const studMat = outerCircleMat.clone();
      for (let j = 0; j < 12; j++) {
        const sAngle = (j / 12) * Math.PI * 2;
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(Math.cos(sAngle) * 0.7, 0, Math.sin(sAngle) * 0.7);
        stud.rotation.y = -sAngle;
        gear.add(stud);
      }
      itemMesh = gear;
    }

    group.add(itemMesh);

    // Color pairs representing transition states of the textures
    const morphColorPalettes = [
      { base: 0x00f0ff, scrolled: 0xf43f5e }, // Cyan to Rose
      { base: 0xe11d48, scrolled: 0xf59e0b }, // Red to Amber
      { base: 0xec4899, scrolled: 0x7c3aed }, // Pink to Violet
      { base: 0x10b981, scrolled: 0x06b6d4 }, // Green to Cyan
      { base: 0xfef08a, scrolled: 0xf43f5e }, // Yellow to Rose
      { base: 0x3b82f6, scrolled: 0x00f3ff }  // Blue to Ice
    ];

    const colors = morphColorPalettes[activeIdx] || morphColorPalettes[0];

    // RESIZE MONITOR
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // MOUSE ROTATION PHYSICS
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;

      group.rotation.y += deltaX * 0.015;
      group.rotation.x += deltaY * 0.012;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // GRAPHIC ANIMATION LOOP
    let animationFrameId: number;
    let elapsed = 0;

    const tick = () => {
      elapsed += 0.015;
      const prog = scrollProgRef.current; // reads non-blocking from window scroll position

      // Slow passive rotate that increases slightly as you scroll past the hero section
      if (!isDragging) {
        group.rotation.y += 0.009 + prog * 0.018;
        group.rotation.x = Math.sin(elapsed * 0.4) * 0.12;
      }

      // Slightly morph physical proportions (Morphing Scale / Pulse loop)
      const currentScaleX = 1.0 + Math.sin(elapsed * 1.3) * 0.06 * (1 - prog) + (prog * 0.12);
      const currentScaleY = 1.0 + Math.cos(elapsed * 1.0) * 0.06 * (1 - prog) - (prog * 0.10);
      const currentScaleZ = 1.0 + Math.sin(elapsed * 1.6) * 0.06 * (1 - prog) + (prog * 0.12);
      group.scale.set(currentScaleX, currentScaleY, currentScaleZ);

      // Texture morph: 
      // At scroll progression < 0.35, show high-precision structural hologram (Wireframe).
      // As scroll proceeds, fade dynamically into solid reflecting structural object (Fully metallic!).
      const isWire = prog < 0.35;

      itemMesh.traverse((node: any) => {
        if (node.isMesh) {
          node.material.wireframe = isWire;
          
          // Modify metallic roughness in real-time
          node.material.metalness = THREE.MathUtils.lerp(0.4, 0.95, prog);
          node.material.roughness = THREE.MathUtils.lerp(0.5, 0.15, prog);

          // Interpolate current color of material
          const c1 = new THREE.Color(colors.base);
          const c2 = new THREE.Color(colors.scrolled);
          node.material.color.copy(c1).lerp(c2, prog);

          if (node.material.emissive) {
            node.material.emissive.copy(c1).multiplyScalar(0.2);
            node.material.emissiveIntensity = THREE.MathUtils.lerp(0.8, 2.0, prog);
          }
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // CLEANUP DISPOSE
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeIdx, isFullscreen]);

  // Navigate carousel helper
  const handlePrev = () => {
    setActiveIdx(prev => (prev === 0 ? CAROUSEL_PRODUCTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx(prev => (prev === CAROUSEL_PRODUCTS.length - 1 ? 0 : prev + 1));
  };

  // Launch AI Prompt query inside the Sentry widget
  const triggerAiSentryQuery = (prompt: string) => {
    const chatInput = document.getElementById('input-ai-sentry-message') as HTMLInputElement;
    const sendButton = document.getElementById('btn-ai-send-message') as HTMLButtonElement;
    const widgetTrigger = document.getElementById('btn-ai-widget-trigger') as HTMLButtonElement;

    if (!chatInput || !sendButton) {
      // If widget with ID not open, find and click trigger first
      if (widgetTrigger) {
        widgetTrigger.click();
      }
    }

    // Set a slight timeout to let the drawer render
    setTimeout(() => {
      const refreshedInput = document.getElementById('input-ai-sentry-message') as HTMLInputElement;
      const refreshedSend = document.getElementById('btn-ai-send-message') as HTMLButtonElement;
      
      if (refreshedInput) {
        refreshedInput.value = prompt;
        // Trigger synthetic state change by firing event
        const event = new Event('input', { bubbles: true });
        refreshedInput.dispatchEvent(event);
        
        // Focus the text field
        refreshedInput.focus();
        
        // Scroll the widget into view
        const chatbox = document.getElementById('ai-sentry-chatbox');
        if (chatbox) {
          chatbox.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }, 150);
  };

  // Immersive Three.js orbit rendering inside the fullscreen modal
  useEffect(() => {
    if (!isFullscreen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040407);
    scene.fog = new THREE.FogExp2(0x040407, 0.05);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 0.5, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    const purpleGlow = new THREE.PointLight(0x9d00ff, 2.5, 15);
    purpleGlow.position.set(-3, 2, -3);
    scene.add(purpleGlow);

    // Dynamic variable lights
    const spotLight = new THREE.SpotLight(0x00f0ff, 5, 20, Math.PI / 4, 0.5, 1);
    spotLight.position.set(0, 6, 0);
    scene.add(spotLight);

    // CYBERSTAR PARTICLES BACKGROUND
    const partCount = 500;
    const posArr = new Float32Array(partCount * 3);
    const colArr = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 20;
      posArr[i + 1] = (Math.random() - 0.5) * 12 + 2;
      posArr[i + 2] = (Math.random() - 0.5) * 20;
      
      // glowing shades
      colArr[i] = Math.random();
      colArr[i + 1] = Math.random() * 0.5 + 0.5;
      colArr[i + 2] = 1.0;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    partGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      vertexColors: true
    });
    const starryParticles = new THREE.Points(partGeo, pMat);
    scene.add(starryParticles);

    // CENTRAL STAGE pedestal helper
    const centerPlatformMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.1,
      metalness: 0.9,
    });
    const centralFloorGrid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x141424);
    centralFloorGrid.position.y = -1.5;
    scene.add(centralFloorGrid);

    // RING CONSTELLATION PARENT GROUP
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const radius = 4.5;
    const numItems = CAROUSEL_PRODUCTS.length;
    const modelMeshes: THREE.Group[] = [];

    // Hues maps
    const HUE_COLORS = {
      cyan: { spot: 0x00f0ff, secondary: 0x4f46e5 },
      ruby: { spot: 0xff0055, secondary: 0xe11d48 },
      royal: { spot: 0x8b5cf6, secondary: 0x6d28d9 }
    };

    // Create 6 modular shapes to model the products on pedestals 
    for (let i = 0; i < numItems; i++) {
      const angle = (i / numItems) * Math.PI * 2;
      const pedestalGroup = new THREE.Group();
      
      // Coordinates
      pedestalGroup.position.set(
        Math.sin(angle) * radius,
        -1.0,
        Math.cos(angle) * radius
      );

      // Create physical cylinder pedestal Base
      const pedBaseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.35, 12);
      const pedBaseMat = centerPlatformMat.clone();
      const pedBase = new THREE.Mesh(pedBaseGeo, pedBaseMat);
      pedestalGroup.add(pedBase);

      // Add a glowing indicator ring about base pedestal
      const pedRingGeo = new THREE.RingGeometry(0.72, 0.76, 16);
      const pedRingMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f0ff, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6 
      });
      const pedRing = new THREE.Mesh(pedRingGeo, pedRingMat);
      pedRing.rotation.x = Math.PI / 2;
      pedRing.position.y = 0.18;
      pedestalGroup.add(pedRing);

      // Model Shape representer inside Pedestal
      const shapeContainer = new THREE.Group();
      shapeContainer.position.y = 1.0; // lift off base
      
      // Build distinct procedural primitives reflecting 3D Printing Products!
      let itemMesh: THREE.Mesh | THREE.Group;

      if (i === 0) {
        // Name Plates: Beveled MultiLayered Shield 
        const geometry = new THREE.BoxGeometry(0.9, 0.6, 0.15);
        const material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.8, roughness: 0.3 });
        const plate = new THREE.Mesh(geometry, material);
        
        const outerEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        plate.add(outerEdges);
        itemMesh = plate;
      } 
      else if (i === 1) {
        // Smart Keychain: Fob shape with integrated Gear tooth orbits
        const innerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.18, 16);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
        const coreSec = new THREE.Mesh(innerGeo, innerMat);
        coreSec.rotation.x = Math.PI / 2;
        
        const keyGroup = new THREE.Group();
        keyGroup.add(coreSec);
        
        // add a outer link ring
        const tor = new THREE.Mesh(
          new THREE.TorusGeometry(0.5, 0.08, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0x9d00ff, metalness: 1.0 })
        );
        tor.position.y = 0.5;
        keyGroup.add(tor);
        itemMesh = keyGroup;
      } 
      else if (i === 2) {
        // Anime Figures: SLA Resin cluster (Torus knot high-vertex sculpture)
        const resinGeo = new THREE.TorusKnotGeometry(0.38, 0.12, 60, 8);
        const resinMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.1, metalness: 0.5 });
        itemMesh = new THREE.Mesh(resinGeo, resinMat);
      } 
      else if (i === 3) {
        // LOWPOLY Planters: High facet Icosahedron pot
        const geo = new THREE.IcosahedronGeometry(0.55, 1);
        const mat = new THREE.MeshStandardMaterial({ 
          color: 0x10b981, 
          flatShading: true,
          roughness: 0.7,
          metalness: 0.2
        });
        itemMesh = new THREE.Mesh(geo, mat);
      } 
      else if (i === 4) {
        // Lithophanes: Curved Photo relief panel base
        const curvGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.8, 16, 2, true, 0, Math.PI);
        const curvMat = new THREE.MeshStandardMaterial({ 
          color: 0xfef08a, 
          side: THREE.DoubleSide, 
          roughness: 0.4,
          transparent: true,
          opacity: 0.85
        });
        const panel = new THREE.Mesh(curvGeo, curvMat);
        panel.rotation.y = Math.PI / 2;
        itemMesh = panel;
      } 
      else {
        // Precision Mechanical spare: Multi-sprocket gear
        const outerCircleGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 12);
        const outerCircleMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.2 });
        const gear = new THREE.Mesh(outerCircleGeo, outerCircleMat);
        
        // teeth studs
        const studGeo = new THREE.BoxGeometry(0.12, 0.15, 0.12);
        const studMat = outerCircleMat.clone();
        for (let j = 0; j < 8; j++) {
          const sAngle = (j / 8) * Math.PI * 2;
          const stud = new THREE.Mesh(studGeo, studMat);
          stud.position.set(Math.cos(sAngle) * 0.55, 0, Math.sin(sAngle) * 0.55);
          stud.rotation.y = -sAngle;
          gear.add(stud);
        }
        itemMesh = gear;
      }

      shapeContainer.add(itemMesh);
      pedestalGroup.add(shapeContainer);
      
      // Store reference to modify wireframes dynamically
      pedestalGroup.userData = { 
        index: i, 
        baseAngle: angle,
        renderShape: itemMesh 
      };

      carouselGroup.add(pedestalGroup);
      modelMeshes.push(pedestalGroup);
    }

    // RESIZE EVENT
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 600;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // MOUSE DRAG Physics logic to manually spin the carousel cockpit!
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;

      // Spin relative to drag offset
      targetRotationY += deltaX * 0.012;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      previousMouseX = e.touches[0].clientX;
      targetRotationY += deltaX * 0.015;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleMouseUp);

    // CORE ANIMATION LOOP
    let runAnimation = true;
    let autoRotationVal = 0;

    const tick = () => {
      if (!runAnimation) return;

      // Extract real-time config variables
      const { activeIdx: currIdx, spinningSpeed: speed, wireframeMode: wf, glowingHue: hue } = configRef.current;

      // 1. Light and Color adjustment based on Hue State
      const currentColors = HUE_COLORS[hue] || HUE_COLORS.cyan;
      spotLight.color.setHex(currentColors.spot);
      purpleGlow.color.setHex(currentColors.secondary);

      // 2. Automated lazy rotate if drag not active
      if (!isDragging && speed > 0) {
        autoRotationVal += 0.0035 * speed;
      }

      // Smoothly lerp towards target rotation
      const actualTarget = -((currIdx / numItems) * Math.PI * 2) + targetRotationY + autoRotationVal;
      carouselGroup.rotation.y += (actualTarget - carouselGroup.rotation.y) * 0.055;

      // 3. Make individual models hover slightly and spin about themselves
      const elapsed = Date.now() * 0.0015;
      modelMeshes.forEach((meshGroup, idx) => {
        const shape = meshGroup.userData.renderShape as THREE.Mesh;
        if (shape) {
          // Hover height offset sine loop
          shape.position.y = Math.sin(elapsed + idx * 1.5) * 0.15 + 0.3;
          shape.rotation.y += 0.015;

          // Align materials / wireframes
          shape.traverse((node: any) => {
            if (node.isMesh) {
              node.material.wireframe = wf;
              // Adjust emission for glow effect
              if (node.material.emissive) {
                node.material.emissiveIntensity = wf ? 0.9 : 0.2;
              }
            }
          });
        }

        // Scale up active centered model
        const isSelfActive = idx === currIdx;
        const targetScale = isSelfActive ? 1.3 : 0.85;
        meshGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      // Orbit cyberdust particles
      starryParticles.rotation.y -= 0.001;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();

    // CLEANUP
    return () => {
      runAnimation = false;
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseUp);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

  }, [isFullscreen]);

  const activeItem = CAROUSEL_PRODUCTS[activeIdx];

  return (
    <div id="banalia-carousel-container" className="pt-2 pb-12 w-full font-sans">
      
      {/* SECTION HEADER & CONTROL TICKERS */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-4">
        <div>
          <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest inline-flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-red-500 animate-pulse" /> PROCEDURAL SHAPE SELECTION
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mt-1 font-sans">
            SELECT & CUSTOMIZE NEXT-GEN MODELS
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Click, rotate, preview specs, or trigger instant diagnostic AI search ground queries.
          </p>
        </div>

        {/* TRIGGER IMMERSIVE COCKPIT MODAL BUTTON */}
        <button
          id="btn-trigger-fullscreen-carousel"
          onClick={() => setIsFullscreen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-red-500 hover:opacity-90 active:scale-97 text-white font-mono text-xs font-black tracking-wider uppercase shadow-lg shadow-cyan-500/10 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Maximize2 className="w-4 h-4 animate-pulse text-white" />
          <span>🚀 FULL-SCREEN 3D COCKPIT</span>
        </button>
      </div>

      {/* CORE CAROUSEL INTERACTIVE SLIDER (3D PERSPECTIVE CARD STACK) */}
      <div className="relative max-w-5xl mx-auto px-4 min-h-[440px] flex items-center justify-center">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full relative z-10">
          
          {/* Lhs Carousel Cards with responsive layout and 3D floating visual indicator */}
          <div className="md:col-span-5 flex flex-col justify-center gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono text-cyan-400 tracking-widest font-black uppercase">
                MODEL {activeIdx + 1} OF {CAROUSEL_PRODUCTS.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase font-sans">
                {activeItem.name}
              </h2>
              <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-bold bg-[#1d1d2b] text-cyan-400 rounded-lg uppercase tracking-wider border border-white/5">
                🏷 {activeItem.category}
              </span>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                {activeItem.description}
              </p>
            </div>

            {/* Micro Technical Parameter Tags table */}
            <div className="grid grid-cols-2 gap-2 bg-[#09090f] p-3.5 rounded-2xl border border-white/5">
              <div className="leading-tight">
                <span className="text-[9px] font-mono text-gray-500 uppercase">Layer Height</span>
                <span className="block text-xs font-mono font-bold text-white mt-0.5">
                  {activeItem.stats.precision}
                </span>
              </div>
              <div className="leading-tight">
                <span className="text-[9px] font-mono text-gray-500 uppercase">Infill Density</span>
                <span className="block text-xs font-mono font-bold text-white mt-0.5">
                  {activeItem.stats.infill}
                </span>
              </div>
              <div className="leading-tight mt-2.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase">Print Duration</span>
                <span className="block text-xs font-mono font-bold text-white mt-0.5">
                  {activeItem.stats.time}
                </span>
              </div>
              <div className="leading-tight mt-2.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase">Standard Material</span>
                <span className="block text-xs font-mono font-black text-cyan-400 mt-0.5">
                  {activeItem.stats.material}
                </span>
              </div>
            </div>

            {/* Quick Pricing badge + WA redirect */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">ESTIMATE</span>
                <span className="block text-lg font-black text-white font-mono">{activeItem.priceEstimate}</span>
              </div>
              <a
                href={`https://wa.me/917408647600?text=${encodeURIComponent(activeItem.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[10px] font-mono font-bold tracking-widest text-[#0c0c0f] bg-green-400 hover:bg-green-500 rounded-xl uppercase transition-all shadow-md shadow-green-500/10 active:scale-97"
              >
                📥 Get Quote on WhatsApp
              </a>
            </div>

          </div>

          {/* Rhs 3D Interactive Mock Display Screen */}
          <div className="md:col-span-7 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-lg aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#06060a] relative group shadow-2xl flex items-center justify-center">
              
              {/* Product preview image styled like a blueprint mockup background */}
              <img 
                src={activeItem.imageUrl} 
                alt={activeItem.name} 
                className="w-full h-full object-cover opacity-[0.06] select-none pointer-events-none group-hover:scale-105 transition-all duration-700 absolute inset-0" 
              />

              {/* LIVE DYNAMIC 3D CANVAS VIEWPORT (Handles draggable interactions, scroll-morphs & texture shifts) */}
              <div 
                ref={inlineCanvasRef} 
                className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing" 
                title="Drag to orbit the 3D printed part!"
              />

              {/* Dynamic real-time scroll status HUD toast */}
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1.5 rounded-lg bg-[#040407]/90 border border-white/10 font-mono text-[9px] text-gray-300 pointer-events-none flex items-center gap-1.5 backdrop-blur-sm">
                <span className="font-bold tracking-tight">
                  {scrollProg >= 1.0 ? 'SOLID RENDER' : scrollProg > 0.35 ? 'SHADED MODEL' : 'WIREFRAME MODEL'} ({Math.round(scrollProg * 100)}%)
                </span>
              </div>

              {/* Glowing Blueprint layout over preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-[#00f3ff]/5 flex flex-col justify-between p-6 pointer-events-none select-none">
                
                <div className="flex justify-between items-start">
                  <div className="p-2 px-3 rounded-lg bg-black/60 border border-white/5 text-gray-400 text-[10px] font-mono flex items-center gap-1.5 uppercase font-bold backdrop-blur-md">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>3D VISUALIZATION MODEL</span>
                  </div>
                </div>

                {/* Animated Scanner laser lines */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#00f0ff] translate-y-12 animate-bounce opacity-80 pointer-events-none"></div>

                <div className="flex justify-between items-end">
                  <div className="text-right ml-auto">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase">Interactive Preview</span>
                    <span className="text-white text-xs font-mono font-bold">100% SCALE DISPLAY</span>
                  </div>
                </div>

              </div>
              
              {/* Overlay Prompt Trigger Button directly in preview center */}
              <div className="absolute inset-x-0 bottom-4 px-4 flex justify-center opacity-90 hover:opacity-100 transition-opacity z-10 animate-fade-in">
                <button
                  onClick={() => triggerAiSentryQuery(activeItem.promptText)}
                  className="w-full py-2.5 bg-gray-950/90 border border-[#00f3ff]/30 hover:border-[#00f3ff]/80 text-[#00f0ff] hover:text-white rounded-xl text-[10px] font-mono font-black tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
                  title="Force AI Sentry inquiry automatically"
                >
                  <Bot className="w-4 h-4" />
                  <span>👾 INTERACTIVE PROMPT DIAGNOSTIC</span>
                </button>
              </div>

            </div>

            {/* Clickable Quick Prompts Carousel selector triggers row below preview */}
            <div className="w-full max-w-lg mt-4 hidden sm:flex items-center justify-between gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CAROUSEL_PRODUCTS.map((prod, num) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveIdx(num)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap border cursor-pointer flex-1 text-center ${
                    activeIdx === num 
                      ? 'bg-[#00f0ff]/10 text-cyan-400 border-cyan-400/30' 
                      : 'bg-[#030307]/40 text-gray-500 border-white/5 hover:text-gray-300'
                  }`}
                >
                  ⚙ {prod.threeDType}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>


      {/* FULLSCREEN CONSTELLATION COCKPIT MODAL (HIGH PERFORMANCE THREE.JS ENVIRONMENT) */}
      {isFullscreen && (
        <div id="immersive-3d-cockpit" className="fixed inset-0 z-200 bg-[#040407] flex flex-col justify-between overflow-hidden animate-fade-in text-white font-sans">
          
          {/* HEADER DASHBOARD */}
          <div className="p-4 sm:p-6 border-b border-white/5 bg-[#06060c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-red-500 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#040407] rounded-[11px] flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <h2 className="text-sm font-black font-mono uppercase tracking-wider text-white">
                    BANALIA3D CONSTELLATION COCKPIT 
                  </h2>
                  <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[8px] font-mono text-red-400 uppercase font-bold tracking-wide">
                    interactive simulation
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Drag with mouse/touch to spin mechanical pedestals. Use controls below to toggle parameters.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-red-400 font-mono text-xs text-gray-400 cursor-pointer flex items-center gap-1.5 transition-all"
              title="Close telemetry view"
            >
              <Minimize2 className="w-4 h-4" />
              <span>EXIT COCKPIT</span>
            </button>
          </div>

          {/* MAIN TWO-COLUMN EXPERIMENTAL SPLIT SCREEN */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
            
            {/* LHS Telemetry Column: Model detail panel */}
            <div className="lg:col-span-4 p-6 border-r border-white/5 bg-[#05050a]/90 overflow-y-auto space-y-6 flex flex-col justify-between z-10">
              
              <div className="space-y-5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black block border-b border-white/5 pb-2">
                  📡 ORBIT SEGMENT SELECTOR
                </span>

                {/* Flat Navigation of products in cockpit */}
                <div className="space-y-1.5">
                  {CAROUSEL_PRODUCTS.map((prod, num) => (
                    <button
                      key={prod.id}
                      onClick={() => setActiveIdx(num)}
                      className={`w-full text-left p-3.5 rounded-xl border font-mono transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        activeIdx === num 
                          ? 'bg-gradient-to-r from-cyan-950/20 to-blue-950/10 border-cyan-400/40 text-cyan-400 shadow-md' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="leading-tight truncate max-w-[80%]">
                        <span className="text-[9px] text-gray-500 block uppercase mb-0.5">SEG {num + 1} • {prod.category}</span>
                        <span className="text-[11px] font-black uppercase tracking-tight">{prod.name}</span>
                      </div>
                      <span className="text-xs">⚙</span>
                    </button>
                  ))}
                </div>

                {/* Focused Model Detail Specs card */}
                <div className="bg-[#0b0b14] border border-white/10 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white font-mono leading-tight">
                      {activeItem.name} Technical Sheet
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                    {activeItem.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5 text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-gray-600 block uppercase">CAD HEIGHT</span>
                      <span className="text-white font-semibold">{activeItem.stats.precision} layers</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-600 block uppercase">INFILL DENSITY</span>
                      <span className="text-white font-semibold">{activeItem.stats.infill}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-600 block uppercase">COMPILER DURATION</span>
                      <span className="text-white font-semibold">{activeItem.stats.time}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-600 block uppercase">FILAMENT GRADE</span>
                      <span className="text-cyan-400 font-black">{activeItem.stats.material}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION COMMAND CENTER */}
              <div className="space-y-2.5 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    triggerAiSentryQuery(activeItem.promptText);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00f3ff]/10 hover:bg-[#00f3ff]/15 border border-[#00f3ff]/30 text-cyan-400 font-mono text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Bot className="w-4.5 h-4.5 animate-bounce" />
                  <span>👾 TRIGGER LIVE AI SENTRY PROMPT</span>
                </button>

                <a
                  href={`https://wa.me/917408647600?text=${encodeURIComponent(activeItem.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 font-mono text-xs font-bold text-center text-white flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>CLAIM EXPERIMENTAL QUOTE ON WHATSAPP</span>
                </a>
              </div>

            </div>

            {/* THREEJS SIMULATION INTERACTIVE PANEL CONTAINER */}
            <div className="lg:col-span-8 relative bg-[#040407] flex flex-col justify-between overflow-hidden">
              
              {/* Three.js viewport canvas placement */}
              <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

              {/* Floating Orbit Help Overlays */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/60 border border-white/5 text-[9px] font-mono text-gray-400 pointer-events-none uppercase leading-relaxed text-left">
                <div className="flex items-center gap-1.5 text-[#00f3ff] font-bold">
                  <Move className="w-3.5 h-3.5 animate-pulse" />
                  <span>3D NAVIGATION GUIDE:</span>
                </div>
                <span>• Drag left/right to orbit pedestals manually</span><br />
                <span>• Active Segment: {activeItem.name.toUpperCase()}</span>
              </div>

              {/* CONTROL DECK CONTROLLER DASHBOARD OVER THE CANVAS BOTTOM */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-10">
                
                {/* 1. Spin controllers */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Rotation:</span>
                  <div className="flex rounded-lg bg-white/5 border border-white/10 p-1 font-mono text-[9px]">
                    <button
                      onClick={() => setSpinningSpeed(0)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        spinningSpeed === 0 ? 'bg-cyan-500/20 text-cyan-400 font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Pause className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setSpinningSpeed(1)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        spinningSpeed === 1 ? 'bg-cyan-500/20 text-cyan-400 font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      1X
                    </button>
                    <button
                      onClick={() => setSpinningSpeed(3)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        spinningSpeed === 3 ? 'bg-cyan-500/20 text-cyan-400 font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      3X FAST
                    </button>
                  </div>
                </div>

                {/* 2. Wireframe / Solid mode switches */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Visual Shader:</span>
                  <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono font-black transition-all cursor-pointer ${
                      wireframeMode 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]' 
                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {wireframeMode ? '📟 HOLO WIREFRAME ACTIVE' : '🔮 SOLID SOLID OBJECTS'}
                  </button>
                </div>

                {/* 3. Glowing hue chooser */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Sensory Hue:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setGlowingHue('cyan')}
                      className={`w-3.5 h-3.5 rounded-full bg-cyan-400 transition-transform ${
                        glowingHue === 'cyan' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Neon Cyan"
                    />
                    <button
                      onClick={() => setGlowingHue('ruby')}
                      className={`w-3.5 h-3.5 rounded-full bg-rose-500 transition-transform ${
                        glowingHue === 'ruby' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Crimson Ruby"
                    />
                    <button
                      onClick={() => setGlowingHue('royal')}
                      className={`w-3.5 h-3.5 rounded-full bg-violet-500 transition-transform ${
                        glowingHue === 'royal' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Royal Orchid Purple"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
