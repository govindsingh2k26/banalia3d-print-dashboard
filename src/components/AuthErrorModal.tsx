import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Settings, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  Database,
  X,
  UserCheck
} from 'lucide-react';

export default function AuthErrorModal() {
  const { 
    authError, 
    clearAuthError, 
    loginAnonymously, 
    loginWithSimulatedMaker 
  } = useAuth();

  if (!authError) return null;

  const isUnauthorizedDomain = authError.code === 'unauthorized-domain';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#09090b] border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/5 animate-fade-in my-8">
        
        {/* Futuristic glowing alerts */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-cyan-500" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/5 blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 bg-black/40 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5.5 h-5.5 text-red-400" />
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-black tracking-tight font-display text-white uppercase">
                {isUnauthorizedDomain ? 'Firebase Domain Notice' : 'Connection Error'}
              </h3>
              <p className="text-xs text-red-400 font-mono mt-0.5 font-bold uppercase tracking-widest">
                {isUnauthorizedDomain ? 'AUTH_UNAUTHORIZED_DOMAIN' : 'AUTH_STREAM_BLOCKED'}
              </p>
            </div>
          </div>
          <button
            onClick={clearAuthError}
            className="p-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {isUnauthorizedDomain ? (
            <>
              <div className="space-y-2.5">
                <p className="text-xs text-gray-300 leading-normal">
                  Your current preview application is running on a secure sandbox container at Google Cloud. 
                  To protect your database, Firebase Auth blocks Google Sign-In popups until your new development domains are explicitly allow-listed in the project console.
                </p>
                <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl font-mono text-[10px] text-red-300 select-all leading-normal">
                  <strong>Detected Error Code:</strong> auth/unauthorized-domain<br />
                  <strong>Current Host:</strong> {window.location.hostname}
                </div>
              </div>

              {/* Step by step fix manual */}
              <div className="space-y-3 bg-black/60 p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  <span>How to authorize in 45 seconds:</span>
                </div>
                
                <ol className="space-y-3.5 text-xs text-gray-400 font-mono list-decimal pl-4 leading-normal">
                  <li>
                    Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a>
                  </li>
                  <li>
                    Select your active project, navigate to <strong className="text-white">Authentication</strong> &gt; <strong className="text-white">Settings</strong> &gt; <strong className="text-white">Authorized Domains</strong>
                  </li>
                  <li>
                    Click <strong className="text-white">Add domain</strong> and paste the following active address:
                    <div className="mt-1.5 flex flex-col gap-1.5">
                      <code className="text-white bg-gray-900 border border-white/10 px-2 py-1 rounded block select-all text-[10.5px]">
                        {window.location.hostname}
                      </code>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Bypass Options Header */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Solution Bypasses</span>
                </h4>
                <p className="text-[11px] text-gray-500">Enable one of our alternative connection engines to start exploring fully functional dashboards instantly!</p>
              </div>

              {/* Express Solutions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Alternative 1: Anonymous Sign-In (Live Database) */}
                <button
                  onClick={async () => {
                    await loginAnonymously();
                  }}
                  className="p-4 bg-gradient-to-tr from-cyan-400/5 to-cyan-500/10 border border-cyan-400/20 hover:border-cyan-400/50 rounded-2xl text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <span className="block text-xs font-bold text-cyan-300 uppercase tracking-wide group-hover:text-cyan-200">1. Anonymous Auth Access</span>
                  <p className="block text-[10px] text-gray-400 leading-normal mt-1">
                    Authenticates instantly with Firebase. Keeps live Firestore queries active without needing a Google Account.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-400 tracking-wider uppercase mt-3">
                    <Database className="w-3.5 h-3.5" /> Live Cloud Store
                  </span>
                </button>

                {/* Alternative 2: Simulated Local Mode */}
                <button
                  onClick={() => {
                    loginWithSimulatedMaker();
                  }}
                  className="p-4 bg-gradient-to-tr from-rose-400/5 to-rose-500/10 border border-red-500/10 hover:border-red-500/30 rounded-2xl text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <span className="block text-xs font-bold text-rose-300 uppercase tracking-wide group-hover:text-rose-200">2. Simulate Customer Profile</span>
                  <p className="block text-[10px] text-gray-400 leading-normal mt-1">
                    Bypasses Firebase Auth completely. Simulates your user account locally so you can play with 3D print orders right away.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-rose-400 tracking-wider uppercase mt-3">
                    <UserCheck className="w-3.5 h-3.5" /> High-Speed Local Sandbox
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-500/5 border border-red-500/15 p-4 rounded-xl font-mono text-[11px] text-red-400">
                <strong>Error Details:</strong> {authError.message}
              </div>
              
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Suggested Troubleshooting:</span>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Check if your browser allows popups inside sandboxed domains, disable tracking blockers for the current view tab, or click the button below to use client simulation mode.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    loginWithSimulatedMaker();
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:border-red-500/20 text-xs font-mono font-bold text-rose-400 rounded-xl transition-all uppercase cursor-pointer"
                >
                  Launch Client Simulator
                </button>
                <button
                  onClick={clearAuthError}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-red-500 text-black text-xs font-mono font-bold rounded-xl hover:opacity-90 transition-all uppercase cursor-pointer"
                >
                  Dismiss Warning
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Facing persistent problems? Contact Banali3D team directly.</span>
          </div>
          <span className="font-bold text-cyan-400">91-7408647600</span>
        </div>

      </div>
    </div>
  );
}
