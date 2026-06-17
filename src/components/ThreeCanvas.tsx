import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RefreshCw, RotateCw, Sparkles, Sun, Cpu } from 'lucide-react';

interface ThreeCanvasProps {
  currentModelType?: 'all' | 'nameplate' | 'keychain' | 'anime' | 'planter' | 'gift' | 'utility' | 'printer';
  customText?: string;
  glowColor?: 'blue' | 'red' | 'purple';
}

export default function ThreeCanvas({
  currentModelType = 'printer',
  customText = "BANALIA",
  glowColor = 'blue'
}: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedShape, setSelectedShape] = useState<'printer' | 'torus' | 'gear' | 'nameplate' | 'lowpoly'>('printer');
  const [wireframe, setWireframe] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Use state or ref to communicate changes directly to the anim loop
  const configRef = useRef({
    modelType: currentModelType,
    customText,
    glowColor,
    isRotating,
    wireframe,
    zoomLevel
  });

  // Update refs when props change
  useEffect(() => {
    configRef.current = {
      modelType: currentModelType,
      customText,
      glowColor,
      isRotating,
      wireframe,
      zoomLevel
    };
  }, [currentModelType, customText, glowColor, isRotating, wireframe, zoomLevel]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 7);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 2, 50);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const secondaryLight = new THREE.PointLight(0xff0055, 1.5, 50);
    secondaryLight.position.set(-5, 3, -5);
    scene.add(secondaryLight);

    // GROUP FOR ROTATING SCENE COMPONENTS
    const activeModelGroup = new THREE.Group();
    scene.add(activeModelGroup);

    // 1. PARTICLES (Cyber Dust)
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // spread in cube
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 15;

      // Cyber Colors
      if (Math.random() > 0.5) {
        colors[i] = 0.0;     // R
        colors[i + 1] = 0.94; // G
        colors[i + 2] = 1.0;  // B (neon blue)
      } else {
        colors[i] = 1.0;     // R
        colors[i + 1] = 0.0; // G
        colors[i + 2] = 0.33; // B (neon red)
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas round particle helper
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const starParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starParticles);

    // 2. THE FLOATING 3D PRINTING BED & SCAFFOLD
    const printerGroup = new THREE.Group();

    // Bed Platform (Glassmorphism outline)
    const bedGeo = new THREE.BoxGeometry(4.5, 0.1, 4.5);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.6
    });
    const printerBed = new THREE.Mesh(bedGeo, bedMat);
    printerBed.position.y = -1.5;
    printerGroup.add(printerBed);

    // Bed Grid lines
    const gridHelper = new THREE.GridHelper(4.5, 12, 0x00f0ff, 0x222233);
    gridHelper.position.y = -1.44;
    printerGroup.add(gridHelper);

    // Dual vertical posts
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 4, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.9, roughness: 0.1 });
    
    const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
    pillarL.position.set(-2.2, 0.5, 0);
    printerGroup.add(pillarL);

    const pillarR = pillarL.clone();
    pillarR.position.set(2.2, 0.5, 0);
    printerGroup.add(pillarR);

    // Horizontal gantry bar
    const gantryGeo = new THREE.BoxGeometry(4.5, 0.1, 0.2);
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.9 });
    const gantry = new THREE.Mesh(gantryGeo, gantryMat);
    gantry.position.set(0, 1.2, 0);
    printerGroup.add(gantry);

    // Printer Extruder head (glowing neon cyan / danger red laser beam nozzle)
    const nozzleGroup = new THREE.Group();
    const extruderGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const extruderMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8 });
    const extruder = new THREE.Mesh(extruderGeo, extruderMat);
    nozzleGroup.add(extruder);

    // laser pointer red tip
    const laserTipGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
    const laserTipMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const laserTip = new THREE.Mesh(laserTipGeo, laserTipMat);
    laserTip.position.y = -0.25;
    laserTip.rotation.x = Math.PI;
    nozzleGroup.add(laserTip);

    nozzleGroup.position.set(0, 1.15, 0);
    printerGroup.add(nozzleGroup);

    // Laser print line beam
    const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.5, 4);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const laserBeam = new THREE.Mesh(beamGeo, beamMat);
    laserBeam.position.set(0, -0.1, 0); // pointing down
    nozzleGroup.add(laserBeam);

    // Half printed low-poly geometric artifact (Vibrant mesh on the bed)
    const printArtifactGeo = new THREE.CylinderGeometry(1.2, 1.6, 2, 8, 4);
    const printArtifactMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.2
    });
    const printedArtifact = new THREE.Mesh(printArtifactGeo, printArtifactMat);
    printedArtifact.position.set(0, -0.4, 0);
    printerGroup.add(printedArtifact);

    activeModelGroup.add(printerGroup);

    // 3. SEPARATE CORE FLOATING MODELS FOR SELECTABLE VIEWS
    // Torus / Low-Poly planter
    const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 120, 12, 3, 4);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(0, 0.4, 0);

    // Custom Low-Poly Modern Planter Geometry
    const planterGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const planterMat = new THREE.MeshStandardMaterial({
      color: 0x9d00ff,
      roughness: 0.5,
      metalness: 0.8,
      flatShading: true,
      wireframe: false
    });
    const planterMesh = new THREE.Mesh(planterGeo, planterMat);
    planterMesh.position.set(0, 0.4, 0);

    // Cyber Keychain Gear Shape
    const gearGroup = new THREE.Group();
    const centralRing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9 }));
    centralRing.rotation.x = Math.PI / 2;
    gearGroup.add(centralRing);

    // Add gear teeth
    const toothGeo = new THREE.BoxGeometry(0.3, 0.3, 0.5);
    const toothMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.1 });
    for (let index = 0; index < 12; index++) {
      const angle = (index / 12) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, toothMat);
      tooth.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 0);
      tooth.rotation.z = angle;
      gearGroup.add(tooth);
    }
    gearGroup.position.set(0, 0.4, 0);

    // Custom Hologram Name Plate representation
    const plateGroup = new THREE.Group();
    const backplate = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 0.15), new THREE.MeshStandardMaterial({
      color: 0x10101b,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    }));
    plateGroup.add(backplate);

    // glowing edges
    const outlineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.65, 1.45, 0.17)), outlineMat);
    plateGroup.add(wire);
    
    // Mini letters placeholder geometry inside
    const coreHolder = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 0.25), new THREE.MeshStandardMaterial({
      color: 0xff0055,
      emissive: 0xff0055,
      emissiveIntensity: 0.5,
      wireframe: true
    }));
    plateGroup.add(coreHolder);
    plateGroup.position.set(0, 0.4, 0);


    // RESIZE OBSERVER
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // INTERACTION: Mouse Move parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const targetProps = configRef.current;
      const time = clock.getElapsedTime();

      // Slow lerp mouse positions for smooth parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Camera parallax
      camera.position.x = mouseX * 2.0;
      camera.position.y = 2.5 + mouseY * 1.2;
      camera.lookAt(0, 0.4, 0);

      // Model switches base on user selection action
      const currentSelected = targetProps.modelType === 'all' ? selectedShape : targetProps.modelType;

      // Clear non-active main models from primary group
      while (activeModelGroup.children.length > 0) {
        activeModelGroup.remove(activeModelGroup.children[0]);
      }

      // Add appropriate model representation
      if (currentSelected === 'printer') {
        activeModelGroup.add(printerGroup);
        
        // Custom animation for printer head (sine movement on grid)
        nozzleGroup.position.x = Math.sin(time * 2) * 1.5;
        nozzleGroup.position.z = Math.cos(time * 1.3) * 1.2;
        
        // laser flash effect
        laserBeam.scale.y = 0.8 + Math.sin(time * 15) * 0.2;
        
        // Rotate printing gear slowly
        printedArtifact.rotation.y = time * 0.15;
      } else if (currentSelected === 'planter' || currentSelected === 'lowpoly') {
        activeModelGroup.add(planterMesh);
        planterMesh.material.wireframe = targetProps.wireframe;
      } else if (currentSelected === 'keychain' || currentSelected === 'gear') {
        activeModelGroup.add(gearGroup);
        // Rotate keychain
        gearGroup.rotation.z = time * 0.5;
        gearGroup.rotation.x = Math.sin(time * 0.2) * 0.3;
      } else if (currentSelected === 'nameplate') {
        activeModelGroup.add(plateGroup);
        plateGroup.rotation.y = Math.sin(time * 0.4) * 0.4;
        plateGroup.rotation.x = Math.cos(time * 0.3) * 0.15;
      } else {
        // default Torus fallback
        activeModelGroup.add(torusMesh);
        torusMesh.material.wireframe = targetProps.wireframe;
      }

      // Rotate group if rotation enabled
      if (targetProps.isRotating) {
        activeModelGroup.rotation.y += 0.007;
      }

      // Modify materials base on Neon Color Scheme
      const colHex = targetProps.glowColor === 'red' 
        ? 0xff0055 
        : targetProps.glowColor === 'purple' 
          ? 0x9d00ff 
          : 0x00f0ff;

      mainLight.color.setHex(colHex);
      
      // Rotate cosmic dust background
      starParticles.rotation.y = -time * 0.03;
      starParticles.rotation.x = time * 0.01;

      // Apply zoom level dynamically
      camera.zoom = targetProps.zoomLevel;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // dispose geometries/materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      pTexture.dispose();
      bedGeo.dispose();
      bedMat.dispose();
      pillarGeo.dispose();
      pillarMat.dispose();
      gantryGeo.dispose();
      gantryMat.dispose();
      extruderGeo.dispose();
      extruderMat.dispose();
      laserTipGeo.dispose();
      laserTipMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      printArtifactGeo.dispose();
      printArtifactMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      planterGeo.dispose();
      planterMat.dispose();
      toothGeo.dispose();
      toothMat.dispose();
      centralRing.geometry.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[32rem] md:h-[40rem] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl backdrop-blur-md">
      {/* 3D Render Port container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing absolute inset-0 z-0 bg-transparent" />

      {/* Subtle organic light accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-red-500/5 pointer-events-none z-1" />

      {/* UI Cockpit Controller / Info */}
      <div className="absolute top-4 left-4 z-10 glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center justify-center">
        <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">INTERACTIVE 3D SANDBOX</span>
      </div>

      <div className="absolute top-4 right-4 z-10 glass-panel px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-4 text-xs font-mono">
        <button 
          id="btn-rotate-toggle"
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1.5 hover:text-cyan-400 transition-colors ${isRotating ? 'text-cyan-400' : 'text-gray-400'}`}
          title="Toggle Auto-Rotation"
        >
          {isRotating ? <RefreshCw className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isRotating ? 'AUTO-SPIN' : 'PAUSED'}</span>
        </button>

        <button 
          id="btn-wireframe-toggle"
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 hover:text-cyan-400 transition-colors ${wireframe ? 'text-pink-400' : 'text-gray-400'}`}
          title="Toggle Wireframe Blueprint Mode"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{wireframe ? 'BLUEPRINT' : 'SOLID'}</span>
        </button>
      </div>

      {/* Shapes Cockpit Selector: only visible if currentModelType is 'all' */}
      {currentModelType === 'all' && (
        <div className="absolute bottom-4 left-4 right-4 z-10 glass-panel p-2.5 rounded-2xl border border-white/10 flex flex-wrap gap-2 justify-center items-center">
          <span className="text-xs font-mono text-gray-400 mr-2 border-r border-white/10 pr-3">SELECT MODULE:</span>
          {[
            { id: 'printer', label: '3D Printer Frame', icon: RefreshCw },
            { id: 'torus', label: 'Helix Node', icon: Sparkles },
            { id: 'lowpoly', label: 'Planter Hex', icon: Sun },
            { id: 'gear', label: 'NFC Key Ring', icon: Cpu },
            { id: 'nameplate', label: 'Holo Plate', icon: RotateCw },
          ].map((item) => (
            <button
              key={item.id}
              id={`shape-selector-${item.id}`}
              onClick={() => setSelectedShape(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-1.5 ${
                selectedShape === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-400/30 font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cyberpunk Zoom Indicator */}
      <div className="absolute bottom-16 right-4 md:bottom-4 md:right-4 z-10 flex flex-col items-center gap-1.5 glass-panel p-2 rounded-xl border border-white/5">
        <label className="text-[9px] font-mono text-gray-500">RENDER SCALE</label>
        <div className="flex items-center gap-1">
          <button 
            id="btn-zoom-dec"
            onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.15))}
            className="w-6 h-6 rounded bg-gray-900 border border-white/5 hover:border-cyan-400 hover:text-cyan-400 text-xs flex items-center justify-center font-mono font-bold"
          >
            -
          </button>
          <span className="text-xs font-mono text-cyan-400 font-semibold w-8 text-center bg-gray-900 p-1 rounded border border-white/5">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            id="btn-zoom-inc"
            onClick={() => setZoomLevel(Math.min(1.6, zoomLevel + 0.15))}
            className="w-6 h-6 rounded bg-gray-900 border border-white/5 hover:border-cyan-400 hover:text-cyan-400 text-xs flex items-center justify-center font-mono font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
