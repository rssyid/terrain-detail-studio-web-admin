import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserRole, LicenseEntitlement, DeviceRecord, PresetItem, PluginRelease } from './types';
import { fetchHealth, fetchEntitlements, fetchDevices, fetchPresets, fetchLatestRelease } from './api';

export function App() {
  const [role, setRole] = useState<UserRole>('customer');
  const [isLive, setIsLive] = useState(false);

  const [entitlement, setEntitlement] = useState<LicenseEntitlement | null>(null);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [release, setRelease] = useState<PluginRelease | null>(null);

  const loadData = async () => {
    const health = await fetchHealth();
    setIsLive(health);

    const [entData, devData, preData, relData] = await Promise.all([
      fetchEntitlements(),
      fetchDevices(),
      fetchPresets(),
      fetchLatestRelease(),
    ]);

    setEntitlement(entData);
    setDevices(devData);
    setPresets(preData);
    setRelease(relData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-brutal-bg text-black pb-16">
      <Header currentRole={role} setRole={setRole} isLive={isLive} />

      <main className="max-w-7xl mx-auto px-4">
        {role === 'customer' && entitlement && release && (
          <CustomerPortal
            entitlement={entitlement}
            devices={devices}
            presets={presets}
            release={release}
            onRefresh={loadData}
          />
        )}

        {role === 'admin' && release && (
          <AdminPortal
            devices={devices}
            presets={presets}
            release={release}
            onRefresh={loadData}
          />
        )}
      </main>

      {/* Neo-Brutalist Footer */}
      <footer className="mt-16 border-t-4 border-black bg-white py-6 text-center font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold uppercase">
            © 2026 TERRAIN DETAIL STUDIO — LOCAL-FIRST CARTOGRAPHIC RELIEF SYSTEM FOR QGIS
          </p>
          <div className="flex items-center gap-2">
            <span className="badge-brutal bg-brutal-yellow text-black">NEON DB</span>
            <span className="badge-brutal bg-brutal-cyan text-black">VERCEL API</span>
            <span className="badge-brutal bg-brutal-pink text-white">NEO-BRUTALIST UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
