import React, { useState } from 'react';
import { LicenseEntitlement, DeviceRecord, PresetItem, PluginRelease } from '../../types';
import { revokeDevice } from '../../api';
import { Laptop, Download, Sliders, CheckCircle2, XCircle, Copy, AlertTriangle, Key, HardDrive, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

interface CustomerPortalProps {
  entitlement: LicenseEntitlement;
  devices: DeviceRecord[];
  presets: PresetItem[];
  release: PluginRelease;
  onRefresh: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  entitlement,
  devices,
  presets,
  release,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'downloads' | 'presets'>('overview');
  const [copiedSha, setCopiedSha] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetItem | null>(presets[0] || null);

  const handleCopySha = () => {
    navigator.clipboard.writeText(release.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (confirm('Are you sure you want to revoke this device? It will be blocked from running new Pro jobs on next online sync.')) {
      await revokeDevice(id);
      onRefresh();
    }
  };

  const activeDeviceCount = devices.filter((d) => !d.revoked_at).length;

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-4 border-black pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-sm uppercase tracking-wider transition-all border-3 border-black ${
            activeTab === 'overview'
              ? 'bg-brutal-cyan text-black shadow-brutal translate-x-0 -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Key className="w-4 h-4" />
          LICENSE OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-sm uppercase tracking-wider transition-all border-3 border-black ${
            activeTab === 'devices'
              ? 'bg-brutal-yellow text-black shadow-brutal translate-x-0 -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Laptop className="w-4 h-4" />
          MY DEVICES ({activeDeviceCount}/{entitlement.limits.devices})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-sm uppercase tracking-wider transition-all border-3 border-black ${
            activeTab === 'downloads'
              ? 'bg-brutal-green text-black shadow-brutal translate-x-0 -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Download className="w-4 h-4" />
          PLUGIN DOWNLOADS
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-sm uppercase tracking-wider transition-all border-3 border-black ${
            activeTab === 'presets'
              ? 'bg-brutal-pink text-white shadow-brutal translate-x-0 -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          CARTOGRAPHIC PRESETS
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main License Card */}
          <div className="md:col-span-2 card-brutal bg-white space-y-6">
            <div className="flex items-center justify-between border-b-3 border-black pb-4">
              <div>
                <span className="badge-brutal bg-brutal-yellow text-black mb-2">
                  PLAN: {entitlement.plan_code.toUpperCase()}
                </span>
                <h2 className="font-mono text-2xl font-bold uppercase">INDIVIDUAL PRO SUBSCRIPTION</h2>
                <p className="text-xs font-mono text-neutral-600">LICENSE ID: {entitlement.license_id || 'N/A'}</p>
              </div>
              <div className="text-right">
                <span
                  className={`badge-brutal ${
                    entitlement.status === 'active'
                      ? 'bg-brutal-green text-black'
                      : 'bg-brutal-pink text-white'
                  } py-1 px-3 text-sm`}
                >
                  STATUS: {entitlement.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-3 border-black p-3 bg-neutral-50">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">EXPIRES AT</span>
                <span className="font-mono font-bold text-sm block mt-1">
                  {entitlement.expires_at ? new Date(entitlement.expires_at).toLocaleDateString() : 'Lifetime'}
                </span>
              </div>
              <div className="border-3 border-black p-3 bg-neutral-50">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">OFFLINE LEASE</span>
                <span className="font-mono font-bold text-sm text-brutal-pink block mt-1">
                  7 DAYS MAX (VALID UNTIL {entitlement.offline_until ? new Date(entitlement.offline_until).toLocaleDateString() : 'N/A'})
                </span>
              </div>
              <div className="border-3 border-black p-3 bg-neutral-50">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">DEVICE LIMIT</span>
                <span className="font-mono font-bold text-sm block mt-1">
                  {activeDeviceCount} OF {entitlement.limits.devices} ACTIVE
                </span>
              </div>
            </div>

            {/* Feature Entitlements Grid */}
            <div>
              <h3 className="font-mono font-bold uppercase text-sm mb-3 border-b-2 border-black pb-1">
                ENTITLED PRO FEATURES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(entitlement.features).map(([feat, granted]) => (
                  <div
                    key={feat}
                    className={`flex items-center justify-between p-2.5 border-2 border-black ${
                      granted ? 'bg-brutal-green/20 text-black' : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    <span className="font-bold uppercase">{feat.replace('_', ' ')}</span>
                    {granted ? (
                      <span className="badge-brutal bg-brutal-green text-black">GRANTED</span>
                    ) : (
                      <span className="badge-brutal bg-neutral-200 text-neutral-600">LOCKED</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Support & Local-First Banner */}
          <div className="space-y-6">
            <div className="card-brutal bg-brutal-yellow">
              <h3 className="font-mono font-bold text-lg uppercase mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                LOCAL-FIRST PROMISE
              </h3>
              <p className="text-xs font-mono mb-4 leading-relaxed">
                All raster processing (MDHS, Slope, Gaussian LRM) runs on your local workstation. Your LiDAR DTM GeoTIFF files are <strong>never uploaded</strong> to any server.
              </p>
              <div className="border-2 border-black bg-white p-3 font-mono text-[11px]">
                <strong className="block mb-1 uppercase text-brutal-pink">OFFLINE LEASE INSTRUCTIONS:</strong>
                Launch QGIS plugin while online to auto-renew your 7-day signed lease before offline field surveys.
              </div>
            </div>

            <div className="card-brutal bg-black text-white">
              <h3 className="font-mono font-bold text-lg uppercase mb-2 text-brutal-cyan flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                DEVICE MANAGEMENT
              </h3>
              <p className="text-xs font-mono text-neutral-300 mb-4">
                Individual Pro entitles you to 2 active workstations. If you upgrade your PC or reinstall QGIS, revoke your unused device in the Devices tab.
              </p>
              <button
                onClick={() => setActiveTab('devices')}
                className="btn-brutal-cyan w-full text-center py-2 text-xs"
              >
                MANAGE MY DEVICES →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVICES */}
      {activeTab === 'devices' && (
        <div className="card-brutal bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
            <div>
              <h2 className="font-mono text-xl font-bold uppercase">REGISTERED WORKSTATIONS & DEVICES</h2>
              <p className="text-xs font-mono text-neutral-600">
                ACTIVE DEVICES: {activeDeviceCount} / {entitlement.limits.devices} ALLOWED
              </p>
            </div>
            <button onClick={onRefresh} className="btn-brutal-yellow text-xs flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> REFRESH
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-3 border-black">
              <thead className="bg-black text-white uppercase border-b-3 border-black">
                <tr>
                  <th className="p-3 border-r-2 border-white">Device Label</th>
                  <th className="p-3 border-r-2 border-white">Platform</th>
                  <th className="p-3 border-r-2 border-white">QGIS / Plugin</th>
                  <th className="p-3 border-r-2 border-white">Last Seen</th>
                  <th className="p-3 border-r-2 border-white">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((dev) => (
                  <tr key={dev.id} className="border-b-2 border-black hover:bg-neutral-50">
                    <td className="p-3 border-r-2 border-black font-bold">{dev.label}</td>
                    <td className="p-3 border-r-2 border-black">{dev.platform}</td>
                    <td className="p-3 border-r-2 border-black">
                      <span className="badge-brutal bg-neutral-100 text-black mb-1">QGIS {dev.qgis_version}</span>
                      <br />
                      <span className="text-[10px] text-neutral-500">Plugin v{dev.plugin_version}</span>
                    </td>
                    <td className="p-3 border-r-2 border-black">
                      {new Date(dev.last_seen_at).toLocaleDateString()} {new Date(dev.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 border-r-2 border-black">
                      {dev.revoked_at ? (
                        <span className="badge-brutal bg-brutal-pink text-white">REVOKED</span>
                      ) : (
                        <span className="badge-brutal bg-brutal-green text-black">ACTIVE</span>
                      )}
                    </td>
                    <td className="p-3">
                      {!dev.revoked_at ? (
                        <button
                          onClick={() => handleRevoke(dev.id)}
                          className="px-2.5 py-1 bg-brutal-pink text-white font-mono text-[11px] font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700"
                        >
                          REVOKE
                        </button>
                      ) : (
                        <span className="text-neutral-400 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card-brutal bg-white space-y-6">
            <div className="border-b-3 border-black pb-4">
              <span className="badge-brutal bg-brutal-green text-black mb-2">CURRENT RELEASE: v{release.version}</span>
              <h2 className="font-mono text-2xl font-bold uppercase">TERRAIN DETAIL STUDIO FOR QGIS</h2>
              <p className="text-xs font-mono text-neutral-600 mt-1">Requires QGIS {release.min_qgis_version} LTR or later (Windows 10/11)</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border-3 border-black bg-brutal-yellow/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono font-bold text-lg uppercase">Plugin ZIP Installer</h3>
                  <p className="text-xs font-mono text-neutral-700">Official release archive (`terrain_detail_studio-{release.version}.zip`)</p>
                </div>
                <a
                  href={release.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-brutal-green flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD ZIP
                </a>
              </div>

              {/* SHA-256 Checksum */}
              <div className="p-4 border-3 border-black bg-neutral-50">
                <span className="text-xs font-mono font-bold uppercase block mb-1">SHA-256 CHECKSUM</span>
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-white p-2.5 border-2 border-black">
                  <span className="truncate">{release.sha256}</span>
                  <button onClick={handleCopySha} className="btn-brutal-cyan text-[11px] py-1 px-3 flex items-center gap-1 shrink-0">
                    <Copy className="w-3 h-3" /> {copiedSha ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Release Notes */}
              <div>
                <h3 className="font-mono font-bold uppercase text-sm mb-2 border-b-2 border-black pb-1">RELEASE NOTES</h3>
                <div className="p-4 border-3 border-black bg-white font-mono text-xs space-y-2 leading-relaxed">
                  <p>{release.release_notes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Guide */}
          <div className="card-brutal bg-brutal-cyan space-y-4">
            <h3 className="font-mono font-bold text-lg uppercase flex items-center gap-2">
              <HardDrive className="w-5 h-5" /> QGIS INSTALLATION
            </h3>
            <ol className="list-decimal list-inside font-mono text-xs space-y-3 leading-relaxed border-2 border-black bg-white p-4">
              <li>Open <strong>QGIS 3.28 LTR</strong> or later.</li>
              <li>Go to <strong>Plugins → Manage and Install Plugins...</strong></li>
              <li>Click <strong>Install from ZIP</strong> in the left menu.</li>
              <li>Browse and select <code>terrain_detail_studio-{release.version}.zip</code>.</li>
              <li>Click <strong>Install Plugin</strong>.</li>
              <li>Launch Terrain Detail Studio from the Raster menu or toolbar.</li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 4: PRESETS */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Presets List */}
          <div className="card-brutal bg-white space-y-3">
            <h3 className="font-mono font-bold text-base uppercase border-b-3 border-black pb-2">PRO CARTOGRAPHIC PRESETS</h3>
            {presets.map((p) => (
              <div
                key={p.code}
                onClick={() => setSelectedPreset(p)}
                className={`p-3 border-3 border-black cursor-pointer transition-all ${
                  selectedPreset?.code === p.code
                    ? 'bg-brutal-yellow shadow-brutal translate-x-1'
                    : 'bg-neutral-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-bold text-sm uppercase">{p.name}</h4>
                  <span className="badge-brutal bg-black text-white text-[10px]">v{p.version}</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600 mt-1">Code: <code>{p.code}</code></p>
              </div>
            ))}
          </div>

          {/* Preset Payload Inspector */}
          <div className="md:col-span-2 card-brutal bg-brutal-darkCard text-white space-y-4">
            {selectedPreset ? (
              <>
                <div className="flex items-center justify-between border-b-2 border-white pb-3">
                  <div>
                    <span className="badge-brutal bg-brutal-pink text-white text-xs mb-1">PRESET PAYLOAD INSPECTOR</span>
                    <h3 className="font-mono text-xl font-bold uppercase text-brutal-yellow">{selectedPreset.name}</h3>
                  </div>
                  <span className="badge-brutal bg-brutal-green text-black">IMMUTABLE PRESET</span>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-400 block uppercase">JSON RECIPE PAYLOAD:</span>
                  <pre className="font-mono text-xs bg-black p-4 border-2 border-white text-brutal-green overflow-x-auto max-h-96">
                    {JSON.stringify(selectedPreset.payload, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="font-mono text-xs text-neutral-400">Select a preset from the left panel to inspect its parameters.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
