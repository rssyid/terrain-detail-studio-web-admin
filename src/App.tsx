import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserRole, LicenseEntitlement, DeviceRecord, PresetItem, PluginRelease } from './types';
import { fetchHealth, fetchEntitlements, fetchDevices, fetchPresets, fetchLatestRelease } from './api';

export function App() {
  const [role, setRole] = useState<UserRole>('customer');
  const [isLive, setIsLive] = useState(true);

  const [entitlement, setEntitlement] = useState<LicenseEntitlement>({
    license_id: 'lic_88392109-pro',
    plan_code: 'individual_pro',
    status: 'active',
    expires_at: '2027-07-26T00:00:00Z',
    offline_until: '2026-08-02T00:00:00Z',
    limits: { devices: 2, batch_items_per_run: 100 },
    features: {
      md_hillshade: true,
      slope_texture: true,
      local_relief: true,
      cartographic_style: true,
      preset_pro: true,
      batch_processing: true,
      vrt_builder: true,
    },
  });

  const [devices, setDevices] = useState<DeviceRecord[]>([
    {
      id: 'dev_991823',
      label: 'Main Workstation (Dell Precision Windows 11)',
      platform: 'Windows 11 x86_64',
      qgis_version: '3.34.4-Prizren',
      plugin_version: '1.0.0',
      first_seen_at: '2026-06-15T10:30:00Z',
      last_seen_at: '2026-07-25T23:45:00Z',
      revoked_at: null,
      status: 'active',
    },
  ]);

  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [release, setRelease] = useState<PluginRelease>({
    version: '1.0.0',
    min_qgis_version: '3.28.0',
    download_url: '/releases/terrain_detail_studio-1.0.0.zip',
    sha256: 'be279c9213ec98faf101d550e1a4861d55c219769b919de6d6b48e9c5874652c',
    release_notes: 'Initial v1.0.0 commercial release. Full local MDHS, Slope, and Gaussian LRM pipeline.',
    published_at: '2026-07-26T00:00:00Z',
  });

  const loadData = async () => {
    try {
      const health = await fetchHealth();
      setIsLive(health);
    } catch {}

    try {
      const entData = await fetchEntitlements();
      if (entData) setEntitlement(entData);
    } catch {}

    try {
      const devData = await fetchDevices();
      if (devData && devData.length > 0) setDevices(devData);
    } catch {}

    try {
      const preData = await fetchPresets();
      if (preData && preData.length > 0) setPresets(preData);
    } catch {}

    try {
      const relData = await fetchLatestRelease();
      if (relData) setRelease(relData);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-brutal-bg text-black pb-16">
      <Header currentRole={role} setRole={setRole} isLive={isLive} />

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {role === 'customer' && (
          <CustomerPortal
            entitlement={entitlement}
            devices={devices}
            presets={presets}
            release={release}
            onRefresh={loadData}
          />
        )}

        {role === 'admin' && (
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
