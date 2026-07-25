import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, Terminal, Radio, Server, Activity } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, setRole, isLive }) => {
  return (
    <header className="border-b-4 border-black bg-brutal-yellow px-4 py-3 shadow-brutal mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-brutal-yellow flex items-center justify-center font-mono font-bold text-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            TDS
          </div>
          <div>
            <h1 className="font-mono text-xl md:text-2xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
              TERRAIN DETAIL STUDIO
              <span className="badge-brutal bg-black text-white text-[10px] py-0.5">v1.0</span>
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-black opacity-80">
              QGIS CARTOGRAPHIC RELIEF SYSTEM — WEB CONTROL PORTAL
            </p>
          </div>
        </div>

        {/* Live Status & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Backend Connection Status Badge */}
          <div className={`badge-brutal ${isLive ? 'bg-brutal-green text-black' : 'bg-brutal-pink text-white'} flex items-center gap-1.5 py-1 px-3`}>
            <Activity className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />
            <span>{isLive ? 'API CONNECTED' : 'DEMO MODE'}</span>
          </div>

          {/* Role Switcher */}
          <div className="flex border-3 border-black bg-white shadow-brutal-sm p-1 gap-1">
            <button
              onClick={() => setRole('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                currentRole === 'customer'
                  ? 'bg-brutal-cyan text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              CUSTOMER PORTAL
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                currentRole === 'admin'
                  ? 'bg-brutal-pink text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black hover:bg-neutral-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              INTERNAL ADMIN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
