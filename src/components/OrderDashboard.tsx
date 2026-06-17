import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  RefreshCw, 
  X, 
  Plus, 
  Clock, 
  FileText, 
  Sparkles, 
  ChevronRight,
  Shield,
  HelpCircle,
  Download,
  Bell,
  FileSpreadsheet,
  AlertCircle,
  Terminal,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { PrintOrder, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

// Error code helper for standard logging
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed Logs: ', JSON.stringify(errInfo));
}

interface OrderDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDashboard({ isOpen, onClose }: OrderDashboardProps) {
  const { 
    user, 
    isSimulated, 
    loginWithGoogle, 
    loginAnonymously, 
    loginWithSimulatedMaker 
  } = useAuth();
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  
  // Custom new order form state
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('Anime/Figures');
  const [newMaterial, setNewMaterial] = useState('PLA');
  const [newColor, setNewColor] = useState('Silk Gold');
  const [newInfill, setNewInfill] = useState('25%');
  const [newLayerHeight, setNewLayerHeight] = useState('0.15mm');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Notifications State & Logic
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      addNotification("No telemetry data to export.", "error");
      return;
    }
    const headers = ['Order ID', 'Item Name', 'Category', 'Price (INR)', 'Status', 'Tracking #', 'Carrier', 'Created At', 'Estimated Delivery', 'Material', 'Color', 'Layer Height', 'Infill'];
    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${o.itemName.replace(/"/g, '""')}"`,
      `"${o.category}"`,
      o.price,
      `"${o.status}"`,
      `"${o.trackingNumber}"`,
      `"${o.carrier}"`,
      `"${o.createdAt}"`,
      `"${o.estimatedDelivery}"`,
      `"${o.material}"`,
      `"${o.filamentColor.replace(/"/g, '""')}"`,
      `"${o.layerHeight}"`,
      `"${o.infill}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Banalia3D_Print_Manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("CSV Print Manifest downloaded.", "success");
  };

  const handleExportJSON = () => {
    if (orders.length === 0) {
      addNotification("No telemetry data to export.", "error");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `Banalia3D_Print_Manifest_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("JSON Print Manifest downloaded.", "success");
  };

  // Update/Record completed print quality rating and experience
  const handleRateOrder = async (orderId: string, rating: number, feedback?: string) => {
    try {
      if (isSimulated) {
        const stored = localStorage.getItem('banalia3d_simulated_orders');
        const currentList: PrintOrder[] = stored ? JSON.parse(stored) : [];
        const updatedList = currentList.map(o => {
          if (o.id === orderId) {
            return { ...o, rating, feedback };
          }
          return o;
        });
        localStorage.setItem('banalia3d_simulated_orders', JSON.stringify(updatedList));
        addNotification(`Rating saved! Quality: ${rating}/5 stars. Thank you!`, "success");
        await fetchOrders(true);
      } else {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          rating,
          feedback: feedback || ""
        });
        addNotification(`Rating saved to Firestore! Thank you for the feedback.`, "success");
        await fetchOrders(true);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      addNotification("Could not record rating. Please check permissions.", "error");
    }
  };

  // Fetch orders
  const fetchOrders = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      if (isSimulated) {
        const stored = localStorage.getItem('banalia3d_simulated_orders');
        let fetchedOrders: PrintOrder[] = [];
        if (stored) {
          fetchedOrders = JSON.parse(stored);
        } else {
          // Default seed data for simulated mode
          fetchedOrders = [
            {
              id: "sim-order-1",
              userId: user.uid,
              itemName: "Goku Ultra Instinct Chibi Figurine",
              category: "Anime & Figures",
              price: 1299,
              status: "shipped" as OrderStatus,
              trackingNumber: "IN-7392819-B3D",
              carrier: "Delhivery",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              estimatedDelivery: "June 20, 2026",
              filamentColor: "Silk Pearl White",
              material: "Polished Resin",
              layerHeight: "0.05mm",
              infill: "Solid 100%"
            },
            {
              id: "sim-order-2",
              userId: user.uid,
              itemName: "Self-Watering Dual-Tone Hex Planter",
              category: "Utility & Decor",
              price: 649,
              status: "printing" as OrderStatus,
              trackingNumber: "Awaiting final layer print",
              carrier: "Banalia Logistics",
              createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
              estimatedDelivery: "June 22, 2026",
              filamentColor: "Matte Emerald Green",
              material: "PETG Waterproof",
              layerHeight: "0.20mm",
              infill: "20% Gyroid"
            },
            {
              id: "sim-order-3",
              userId: user.uid,
              itemName: "Banalia Holographic Workspace Organizer",
              category: "Office Utility",
              price: 899,
              status: "delivered" as OrderStatus,
              trackingNumber: "IN-4821948-B3D",
              carrier: "BlueDart Express",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              estimatedDelivery: "June 14, 2026",
              filamentColor: "Galaxy Glitter Purple",
              material: "PLA Heavy Duty",
              layerHeight: "0.15mm",
              infill: "30% Grid"
            }
          ];
          localStorage.setItem('banalia3d_simulated_orders', JSON.stringify(fetchedOrders));
        }
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(fetchedOrders);
      } else {
        const ordersPath = 'orders';
        const q = query(
          collection(db, ordersPath), 
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedOrders: PrintOrder[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            userId: data.userId || user.uid,
            itemName: data.itemName || 'Custom Print Job',
            category: data.category || 'General',
            price: data.price || 499,
            status: data.status || 'pending',
            trackingNumber: data.trackingNumber || 'Pending Assignment',
            carrier: data.carrier || 'Banalia Delivery Team',
            createdAt: data.createdAt || new Date().toISOString(),
            estimatedDelivery: data.estimatedDelivery || 'Calculated on confirmation',
            filamentColor: data.filamentColor || 'Grey',
            material: data.material || 'PLA',
            layerHeight: data.layerHeight || '0.20mm',
            infill: data.infill || '15%',
            rating: typeof data.rating === 'number' ? data.rating : undefined,
            feedback: typeof data.feedback === 'string' ? data.feedback : undefined
          });
        });

        // Sort client-side to avoid requiring custom firestore indexes
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(fetchedOrders);
      }
      addNotification(silent ? "Print records refreshed!" : "Print synchronization checklist complete.", "success");
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
      addNotification("Synchronization failed. Check developer rules.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  // Seeding realistic dummy orders under current user's UID for testing
  const handleSeedOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const seedData = [
        {
          userId: user.uid,
          itemName: "Goku Ultra Instinct Chibi Figurine",
          category: "Anime & Figures",
          price: 1299,
          status: "shipped" as OrderStatus,
          trackingNumber: "IN-7392819-B3D",
          carrier: "Delhivery",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          estimatedDelivery: "June 20, 2026",
          filamentColor: "Silk Pearl White",
          material: "Polished Resin",
          layerHeight: "0.05mm",
          infill: "Solid 100%"
        },
        {
          userId: user.uid,
          itemName: "Self-Watering Dual-Tone Hex Planter",
          category: "Utility & Decor",
          price: 649,
          status: "printing" as OrderStatus,
          trackingNumber: "Awaiting final layer print",
          carrier: "Banalia Logistics",
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
          estimatedDelivery: "June 22, 2026",
          filamentColor: "Matte Emerald Green",
          material: "PETG Waterproof",
          layerHeight: "0.20mm",
          infill: "20% Gyroid"
        },
        {
          userId: user.uid,
          itemName: "Banalia Holographic Workspace Organizer",
          category: "Office Utility",
          price: 899,
          status: "delivered" as OrderStatus,
          trackingNumber: "IN-4821948-B3D",
          carrier: "BlueDart Express",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          estimatedDelivery: "June 14, 2026",
          filamentColor: "Galaxy Glitter Purple",
          material: "PLA Heavy Duty",
          layerHeight: "0.15mm",
          infill: "30% Grid"
        }
      ];

      if (isSimulated) {
        localStorage.setItem('banalia3d_simulated_orders', JSON.stringify(seedData));
        await fetchOrders();
        addNotification("Demo prints seeded into local sandbox!", "success");
      } else {
        const batch = writeBatch(db);
        seedData.forEach((order) => {
          const docRef = doc(collection(db, 'orders'));
          batch.set(docRef, order);
        });
        await batch.commit();
        await fetchOrders();
        addNotification("Interactive demo orders written to Firestore!", "success");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders/seed');
      addNotification("Seeding operations failed. Check database locks.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create customized user print order in real-time
  const handleSubmitNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItemName.trim()) return;

    setFormSubmitting(true);
    try {
      const designPrice = Math.floor(Math.random() * (750 - 250 + 1)) + 250; // Dynamic print cost matrix
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      
      const newOrderPayload = {
        userId: user.uid,
        itemName: newItemName.trim(),
        category: newCategory,
        price: designPrice,
        status: 'pending' as OrderStatus,
        trackingNumber: "Under review by engineer",
        carrier: "Determining courier service",
        createdAt: new Date().toISOString(),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        filamentColor: newColor,
        material: newMaterial,
        layerHeight: newLayerHeight,
        infill: newInfill
      };

      if (isSimulated) {
        const stored = localStorage.getItem('banalia3d_simulated_orders');
        const currentList: PrintOrder[] = stored ? JSON.parse(stored) : [];
        const finalOrder: PrintOrder = {
          id: "sim-order-" + Date.now(),
          ...newOrderPayload
        };
        const updatedList = [finalOrder, ...currentList];
        localStorage.setItem('banalia3d_simulated_orders', JSON.stringify(updatedList));
        
        setFormSuccess(true);
        addNotification(`Spec submitted! "₹${designPrice} INR" quote created.`, "success");
        setTimeout(() => {
          setShowNewOrderForm(false);
          setNewItemName('');
          setFormSuccess(false);
        }, 1500);

        await fetchOrders(true);
      } else {
        const docRef = await addDoc(collection(db, 'orders'), newOrderPayload);
        
        setFormSuccess(true);
        addNotification(`Print specs uploaded to Firestore!`, "success");
        setTimeout(() => {
          setShowNewOrderForm(false);
          setNewItemName('');
          setFormSuccess(false);
        }, 1500);

        // Instantly load new real order
        await fetchOrders(true);
      }

    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
      addNotification("Submission aborted. Database permissions required.", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>PENDING QUOTE</span>
          </span>
        );
      case 'printing':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>PRINTING LAYER</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide">
            <Truck className="w-3 h-3 animate-bounce" />
            <span>IN TRANSIT</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide">
            <CheckCircle className="w-3 h-3" />
            <span>DELIVERED</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide">
            <X className="w-3 h-3" />
            <span>CANCELLED</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Drawer overlay click interceptor */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Main Panel Content Box */}
      <div className="relative w-full max-w-xl bg-[#09090b] border-l border-white/10 h-full overflow-hidden flex flex-col shadow-2xl z-20">
        
        {/* Background glow effects inside drawer panel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 blur-[80px] pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-red-500 flex items-center justify-center shadow-md shadow-cyan-500/10">
              <Package className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-black font-display tracking-tight text-white uppercase flex items-center gap-1.5">
                <span>My Print Dashboard</span>
                <span className="text-[10px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">SECURE</span>
              </h3>
              <p className="text-xs text-gray-400">Track structural jobs, layer state, and delivery timelines.</p>
            </div>
          </div>
          <button 
            id="orders-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-white hover:bg-red-500/5 transition-all outline-none"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Drawer Main Body Scroll Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          
          {/* Real-time Order Actions Notifications Overlay */}
          <div className="absolute top-4 left-6 right-6 z-[100] pointer-events-none space-y-2 max-w-sm ml-auto">
            <AnimatePresence>
              {notifications.map(n => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-[11px] font-mono font-medium ${
                    n.type === 'success' 
                      ? 'bg-emerald-950/85 border-emerald-500/30 text-emerald-300' 
                      : n.type === 'error'
                      ? 'bg-red-950/85 border-red-500/30 text-red-300'
                      : 'bg-[#0f0f12]/95 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {n.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  {n.type === 'info' && <Bell className="w-4 h-4 text-cyan-400 shrink-0" />}
                  <span className="flex-1 leading-snug">{n.message}</span>
                  <button 
                    onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                    className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* User Sign In Guard */}
          {!user ? (
            <div className="bg-[#0c0c0e] border border-white/10 p-6 sm:p-8 rounded-3xl text-center space-y-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black font-display uppercase tracking-widest text-white">ACCESS GUARD IN PLACE</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-1.5">
                  Sign in using Google or connect with sandbox modes to view, search, and register high-precision 3D print orders.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {/* Option 1: Live Google Account */}
                <button 
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (e) {
                      // Handled by Context AuthErrorModal
                    }
                  }}
                  className="w-full py-2.5 bg-[#ffffff] hover:bg-gray-100 text-black rounded-xl text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <span>Connect Google Workspace</span>
                </button>

                {/* Option 2: Live Guest Sign-In */}
                <button 
                  onClick={async () => {
                    await loginAnonymously();
                  }}
                  className="w-full py-2.5 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/20 rounded-xl text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Instant Guest Auth</span>
                </button>

                {/* Option 3: Local Sandbox */}
                <button 
                  onClick={() => {
                    loginWithSimulatedMaker();
                  }}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-red-500/10 rounded-xl text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Local Sandbox Simulation</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={onClose}
                  className="text-[10px] font-mono font-bold text-gray-500 hover:text-white uppercase tracking-widest cursor-pointer"
                >
                  ← BACK TO MAIN PAGE
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Add New Custom Order Button or Panel Banner */}
              {!showNewOrderForm ? (
                <button
                  id="btn-trigger-new-print-order"
                  onClick={() => setShowNewOrderForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-400/10 to-red-500/10 border border-cyan-400/30 hover:border-cyan-400/60 rounded-2xl transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">Book New Custom 3D Print Job</span>
                      <span className="block text-[10px] text-gray-400">Instantly generate structured print parameters in database</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <form 
                  onSubmit={handleSubmitNewOrder}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 relative animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" /> Book Print Specification
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNewOrderForm(false)}
                      className="text-[10px] font-mono text-gray-500 hover:text-white uppercase"
                    >
                      Cancel
                    </button>
                  </div>

                  {formSuccess ? (
                    <div className="py-8 text-center space-y-2">
                      <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white leading-tight uppercase font-display">JOB BOOKED SUCCESSFULLY</h4>
                      <p className="text-xs text-gray-400">Added securely to the live Firestore collection.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-gray-500 uppercase">3D FILE / PRINT DESIGN NAME</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Iron Man Mark 85 Helmet Full Scale"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">MATERIAL</label>
                          <select 
                            value={newMaterial}
                            onChange={(e) => setNewMaterial(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="PLA (Premium)">PLA (Premium)</option>
                            <option value="PETG (Waterproof)">PETG (Waterproof)</option>
                            <option value="Carbon Fiber PETG">Carbon Fiber PETG</option>
                            <option value="Uncompromising ABS">Uncompromising ABS</option>
                            <option value="Ultra Detail Resin">Ultra Detail Resin</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">FILAMENT COLOR</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Silk Gold / Matte Grey"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">LAYER HEIGHT</label>
                          <select 
                            value={newLayerHeight}
                            onChange={(e) => setNewLayerHeight(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="0.05mm (Ultra Detail)">0.05mm (Resin)</option>
                            <option value="0.12mm (Detail)">0.12mm (High)</option>
                            <option value="0.16mm (Standard)">0.16mm (Standard)</option>
                            <option value="0.20mm (Fast Draft)">0.20mm (Utility)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-gray-500 uppercase">INFILL FACTOR</label>
                          <select 
                            value={newInfill}
                            onChange={(e) => setNewInfill(e.target.value)}
                            className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="15% Gyroid">15% Gyroid</option>
                            <option value="25% Gyroid">25% Gyroid</option>
                            <option value="40% Grid">40% Grid</option>
                            <option value="80% Solid structural">80% Structural</option>
                            <option value="100% Solid">100% Solid</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-300 hover:to-red-400 font-bold uppercase text-[11px] tracking-widest text-[#050505] transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {formSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Job payload...</span>
                          </>
                        ) : (
                          <span>Submit Print Order</span>
                        )}
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Filtering Tickers & Export Utilities */}
              <div className="border-t border-b border-white/5 py-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Filter Telemetry</span>
                    <span className="block text-[9px] text-gray-600">Analyze specific build-chamber queues</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'pending', 'printing', 'shipped', 'delivered'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all tracking-wide select-none cursor-pointer ${
                          activeFilter === filter 
                            ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30' 
                            : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-transparent'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-3 text-[10px] font-mono">
                  <span className="text-gray-500 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400/60" /> Export Print Manifest
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCSV}
                      disabled={orders.length === 0}
                      className="px-2.5 py-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 rounded-lg font-bold uppercase text-[9px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-cyan-400/10"
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={handleExportJSON}
                      disabled={orders.length === 0}
                      className="px-2.5 py-1.5 bg-red-400/10 hover:bg-red-400/20 text-rose-400 rounded-lg font-bold uppercase text-[9px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-red-400/10"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Orders Listing State */}
              {loading ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 font-mono">Syncing print history records...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="border border-white/5 bg-[#0b0b0e] p-8 rounded-3xl text-center space-y-6 relative overflow-hidden">
                  
                  {/* Subtle Blueprint Grid Pattern Background overlay */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  
                  {/* Glowing custom build chamber schematic */}
                  <div className="relative w-40 h-40 mx-auto bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center p-4">
                    {/* SVG modeling build bed corners */}
                    <svg className="absolute inset-0 w-full h-full text-cyan-400/20" fill="none" viewBox="0 0 100 100">
                      <path d="M 5,5 L 15,5 M 5,5 L 5,15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      <path d="M 95,5 L 85,5 M 95,5 L 95,15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      <path d="M 5,95 L 15,95 M 5,95 L 5,85" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      <path d="M 95,95 L 85,95 M 95,95 L 95,85" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      {/* Center target cursor */}
                      <circle cx="50" cy="50" r="1.5" className="fill-red-500/60 animate-ping" />
                      <circle cx="50" cy="50" r="1" className="fill-red-500/80" />
                      {/* Diagonal grid reference line */}
                      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                    
                    {/* Pulsing print-head outline */}
                    <div className="w-16 h-16 rounded-xl border border-cyan-400/20 bg-cyan-400/5 flex flex-col items-center justify-center relative animate-pulse">
                      <Terminal className="w-6 h-6 text-cyan-400" />
                      <span className="text-[7px] font-mono tracking-widest text-cyan-300 mt-1 uppercase font-bold">VACUUM</span>
                    </div>

                    {/* Floating dimensional axis indicators */}
                    <span className="absolute bottom-1.5 left-2.5 text-[8px] font-mono text-gray-600 uppercase font-black">X: 0.00mm</span>
                    <span className="absolute top-1.5 right-2.5 text-[8px] font-mono text-gray-600 uppercase font-black">Z: MAX_LIMIT</span>
                  </div>

                  <div className="space-y-2 relative">
                    <h5 className="text-xs font-black text-white uppercase tracking-widest font-mono">Build Chamber Empty</h5>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                      {activeFilter !== 'all' 
                        ? `No telemetry records currently match the "${activeFilter}" build state active filter queue.`
                        : "There are no architectural specification manifests stored on your current profile."
                      }
                    </p>
                  </div>

                  {/* Seed trigger action */}
                  {activeFilter === 'all' ? (
                    <button
                      id="btn-seed-orders"
                      onClick={handleSeedOrders}
                      className="px-5 py-2.5 border border-cyan-400/20 hover:border-cyan-400/50 bg-cyan-400/5 hover:bg-cyan-400/10 text-cyan-400 rounded-xl text-[10px] font-mono font-black tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                      <span>INITIALIZE DEMO DATA RECORDS</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-400/30 text-gray-300 rounded-xl text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer"
                    >
                      Reset Active Queue filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>RECORDED TRANSACTIONS ({filteredOrders.length})</span>
                    {refreshing ? (
                      <span className="text-cyan-400 animate-pulse flex items-center gap-1 text-[9px]">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Live syncing...
                      </span>
                    ) : (
                      <button 
                        onClick={() => fetchOrders(true)} 
                        className="hover:text-white transition-colors"
                        title="Reload order list"
                      >
                        ⚡ RELOAD LIST
                      </button>
                    )}
                  </div>

                  <motion.div layout className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredOrders.map((order) => (
                        <motion.div 
                          key={order.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 220, damping: 22 }}
                          className="border border-white/10 bg-[#0f0f13] hover:border-cyan-400/35 rounded-2xl p-5 space-y-4 transition-all relative overflow-hidden shadow-lg shadow-black/30 group"
                        >
                      {/* Left vertical visual alignment bar */}
                      <div className={`absolute top-0 left-0 w-[4px] h-full ${
                        order.status === 'delivered' ? 'bg-emerald-500' : 
                        order.status === 'shipped' ? 'bg-indigo-500' : 
                        order.status === 'printing' ? 'bg-cyan-400' : 'bg-amber-400'
                      }`} />

                      {/* Header and status */}
                      <div className="flex items-start justify-between">
                        <div className="pl-1">
                          <span className="block text-[10px] font-mono tracking-wider text-gray-500 uppercase">{order.category}</span>
                          <h4 className="text-sm font-extrabold text-white leading-snug font-display mt-0.5">{order.itemName}</h4>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Diagnostic print parameters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3 rounded-xl border border-white/5 text-[10px] font-mono">
                        <div>
                          <span className="block text-gray-600 font-bold uppercase text-[8px]">MATERIAL</span>
                          <span className="text-gray-300 truncate block mt-0.5">{order.material}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600 font-bold uppercase text-[8px]">FILAMENT</span>
                          <span className="text-gray-300 truncate block mt-0.5">{order.filamentColor}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600 font-bold uppercase text-[8px]">LAYER</span>
                          <span className="text-gray-300 truncate block mt-0.5">{order.layerHeight}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600 font-bold uppercase text-[8px]">INFILL</span>
                          <span className="text-gray-300 truncate block mt-0.5">{order.infill}</span>
                        </div>
                      </div>

                      {/* Delivery/Tracking telemetry */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3 sm:gap-2 text-[11px] font-mono">
                        <div className="space-y-0.5">
                          <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold">Courier & Tracking</span>
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <span className="font-semibold text-white">{order.carrier}</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-cyan-400 font-mono tracking-tight bg-cyan-400/5 border border-cyan-400/10 px-1 py-0.2 rounded font-semibold">{order.trackingNumber}</span>
                          </div>
                        </div>
                        <div className="sm:text-right space-y-0.5">
                          <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold">Estimated Delivery</span>
                          <span className="block font-semibold text-white">{order.estimatedDelivery}</span>
                        </div>
                      </div>

                      {/* Print Quality & Satisfaction Rating */}
                      {order.status === 'delivered' && (
                        <OrderRatingWidget 
                          order={order} 
                          onRate={async (rating, feedback) => {
                            await handleRateOrder(order.id, rating, feedback);
                          }}
                        />
                      )}

                      {/* Transaction Footer */}
                      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1 text-[11px] font-mono text-gray-500">
                        <span>PRICE: <strong className="text-white">₹{order.price} INR</strong></span>
                        <span>ORDERED: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
            </>
          )}

        </div>

        {/* Drawer footer details */}
        <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need priority printing? Contact support.</span>
          </div>
          <span className="text-[10px] font-semibold text-cyan-400">91-7408647600</span>
        </div>

      </div>

    </div>
  );
}

// Interactive Star-Rating and Feedback Sub-component for Completed Orders
interface OrderRatingWidgetProps {
  order: PrintOrder;
  onRate: (rating: number, feedback?: string) => Promise<void>;
}

function OrderRatingWidget({ order, onRate }: OrderRatingWidgetProps) {
  const [rating, setRating] = useState<number>(order.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(order.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!order.rating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await onRate(rating, feedback);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing && order.rating) {
    return (
      <div className="bg-[#0e1615]/40 border border-emerald-500/15 rounded-xl p-3.5 mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Print Satisfaction Registered
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= order.rating! ? 'fill-amber-400 text-amber-500' : 'text-gray-800'
                }`}
              />
            ))}
          </div>
        </div>
        {order.feedback ? (
          <p className="text-[10px] font-mono text-gray-400 italic bg-black/25 px-2.5 py-1.5 rounded-lg border border-white/[0.02]">
            "{order.feedback}"
          </p>
        ) : (
          <p className="text-[9px] font-mono text-gray-600 italic">No additional print logs recorded.</p>
        )}
        <div className="text-right">
          <button 
            type="button"
            onClick={() => {
              setRating(order.rating || 0);
              setFeedback(order.feedback || '');
              setIsEditing(true);
            }}
            className="text-[8px] font-mono font-bold text-gray-500 hover:text-cyan-400 uppercase tracking-wider underline cursor-pointer hover:no-underline transition-colors"
          >
            Revise Quality Rating
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#121216] border border-white/5 rounded-2xl p-4 mt-2.5 space-y-3 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.03] pb-2.5">
        <div>
          <span className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Rate Print Quality & Service</span>
          <span className="block text-[8px] text-gray-600 mt-0.5">Evaluate dimensional accuracy, structural strength & colors</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded-lg border border-white/5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`w-4 h-4 transition-all duration-150 ${
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-500 [filter:drop-shadow(0_0_2px_rgba(245,158,11,0.5))]'
                    : 'text-gray-700 hover:text-gray-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider font-bold">Experience feedback notes (optional)</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="e.g., Flawless PLA finish, robust gyroid fill, quick courier dispatch..."
          maxLength={200}
          className="w-full text-[10px] font-mono bg-black/40 border border-white/5 focus:border-cyan-400/50 rounded-xl px-3 py-2 text-white h-14 resize-none outline-none placeholder:text-gray-700 transition-all focus:ring-1 focus:ring-cyan-400/20"
        />
        <div className="flex justify-between items-center text-[8px] text-gray-600 font-mono">
          <span>{200 - feedback.length} CHARS REMAINING</span>
          {order.rating && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-white uppercase transition-colors"
            >
              Cancel changes
            </button>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className={`w-full py-2.5 rounded-xl text-[10px] font-mono font-bold tracking-widest transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 border ${
          rating === 0 
            ? 'bg-white/[0.01] border-white/5 text-gray-600 cursor-not-allowed'
            : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/20 hover:border-amber-400/40'
        }`}
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>SUBMITTING TELEMETRY LOGS...</span>
          </>
        ) : (
          <>
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>SUBMIT PRECISION RATING</span>
          </>
        )}
      </button>
    </form>
  );
}
