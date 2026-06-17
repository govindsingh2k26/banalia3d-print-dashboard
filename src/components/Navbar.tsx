import { useState, useEffect } from 'react';
import { Menu, X, Printer, MessageSquare, LogIn, LogOut, User as UserIcon, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenDashboard: () => void;
}

export default function Navbar({ onOpenDashboard }: NavbarProps) {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'SHOWROOM', href: '#products' },
    { label: 'WORKFLOW', href: '#workflow' },
    { label: 'SPECS & ABOUT', href: '#specs-about' },
    { label: 'DOCK (BLOG)', href: '#blog' },
    { label: 'DOCK CONTACT', href: '#contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
      scrolled 
        ? 'glass-panel border-b border-white/10 py-3 backdrop-blur-md bg-[#050505]/40' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <a id="nav-logo" href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-red-500 rounded-lg transform rotate-45 flex items-center justify-center shadow-lg shadow-cyan-400/20 group-hover:scale-105 transition-all">
            <div className="w-4 h-4 bg-[#050505] rounded-sm flex items-center justify-center transform -rotate-45">
              <Printer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-sm font-black tracking-widest font-display text-white">
              BANALIA<span className="text-cyan-400">3D</span>
            </span>
            <span className="block text-[8px] font-mono tracking-[4px] text-gray-400 font-bold">STUDIO</span>
          </div>
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider font-medium text-gray-300">
          {menuItems.map((item) => (
            <a
              key={item.label}
              id={`nav-item-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
              href={item.href}
              className="relative py-2 hover:text-cyan-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-red-500 hover:after:w-full after:transition-all duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE Tickers / Action Call */}
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <button
              id="btn-nav-dashboard"
              onClick={onOpenDashboard}
              className="px-3.5 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/20 hover:border-cyan-400/40 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4 animate-pulse" />
              <span>MY DASHBOARD</span>
            </button>
          )}
          {/* Auth State Button or Card */}
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1.5 pl-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-6 h-6 rounded-lg pointer-events-none border border-cyan-400/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-gray-400 uppercase">CONNECTED</span>
                  <span className="block text-[11px] font-black tracking-tight text-white max-w-[70px] truncate">
                    {user.displayName?.split(' ')[0] || 'Maker'}
                  </span>
                </div>
              </div>
              <button
                id="btn-nav-logout"
                onClick={logout}
                className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/30 hover:text-red-400 cursor-pointer transition-colors"
                title="Disconnect Workspace"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-google-login"
              onClick={loginWithGoogle}
              className="px-4 py-2 text-xs font-mono font-bold uppercase text-cyan-400 border border-cyan-400/30 hover:bg-cyan-500/10 active:scale-98 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer bg-[#050505]/40"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Google</span>
            </button>
          )}

          <a
            id="nav-whatsapp-direct"
            href="https://wa.me/917408647600?text=Hi%20Banalia3D!%20I%20am%20visiting%20your%20website%20and%20want%20to%20discuss%20a%203D%20printing%20design."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-mono text-white rounded-xl bg-gradient-to-r from-cyan-400 to-red-500 hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-cyan-400/10 active:scale-[0.98] transition-all flex items-center gap-1.5 font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TALK TO US</span>
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white glass-panel border border-white/10"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full glass-panel-heavy border-b border-white/10 py-6 px-4 flex flex-col gap-4 animate-fade-in z-50">
          <nav className="flex flex-col gap-4 text-sm font-mono tracking-wider">
            {menuItems.map((item) => (
              <a
                key={item.label}
                id={`mobile-nav-item-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-all border-l-2 border-transparent hover:border-cyan-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {/* Mobile Auth Area */}
            {user ? (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl mx-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-xl border border-cyan-400/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] text-gray-500 uppercase">CONNECTED ACCOUNT</span>
                    <span className="block text-xs font-black text-white">
                      {user.displayName || user.email}
                    </span>
                  </div>
                </div>
                <button
                  id="mobile-btn-logout"
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="p-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>EXIT</span>
                </button>
              </div>
            ) : (
              <button
                id="mobile-btn-login"
                onClick={() => { loginWithGoogle(); setIsOpen(false); }}
                className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-center text-cyan-400 bg-white/5 border border-cyan-400/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            )}

            {user && (
              <button
                id="mobile-btn-dashboard"
                onClick={() => { onOpenDashboard(); setIsOpen(false); }}
                className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-center text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Package className="w-4 h-4 animate-pulse" />
                <span>OPEN MY PRINT DASHBOARD</span>
              </button>
            )}

            <a
              id="mobile-nav-whatsapp"
              href="https://wa.me/917408647600?text=Hi%20Banalia3D!%20I%20am%20visiting%20your%20website%20and%20want%20to%20discuss%20a%203D%20printing%20design."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-center text-white bg-gradient-to-r from-cyan-400 to-red-500 shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
