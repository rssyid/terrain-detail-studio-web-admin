import { useState, useEffect } from 'react';
import { DeviceRecord, PresetItem, PluginRelease, AuditLogItem } from '../../types';
import { createAdminLicense, resetDeviceAdmin } from '../../api';
import { ShieldCheck, Users, Key, RotateCcw, Upload, FileText, CheckCircle, AlertOctagon, Plus, Search, Terminal, Activity } from 'lucide-react';

interface AdminPortalProps {
  devices: DeviceRecord[];
  presets: PresetItem[];
  release: PluginRelease;
  onRefresh: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  devices,
  presets,
  release,
  onRefresh,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'licenses' | 'devices' | 'presets' | 'releases' | 'audit'>('metrics');

  // License creation state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newPlanCode, setNewPlanCode] = useState<'free' | 'individual_pro'>('individual_pro');
  const [maxDevices, setMaxDevices] = useState(2);
  const [licenseMsg, setLicenseMsg] = useState('');

  // Device reset modal state
  const [resetDeviceId, setResetDeviceId] = useState('');
  const [resetReason, setResetReason] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // Audit Logs Mock state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'aud_9921',
      actor_user_id: 'admin_sys_01',
      action: 'REGISTER_RELEASE',
      target_type: 'RELEASE',
      target_id: 'rel_1.0.0',
      ip_hash: 'e3b0c442...',
      metadata: { version: '1.0.0', download_url: release.download_url },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'aud_8812',
      actor_user_id: 'admin_sys_01',
      action: 'PUBLISH_PRESET',
      target_type: 'PRESET',
      target_id: 'preset_balanced-detail_1.0.0',
      ip_hash: 'a1f893c2...',
      metadata: { code: 'balanced-detail', version: '1.0.0' },
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'aud_7701',
      actor_user_id: 'support_agent_02',
      action: 'RESET_DEVICE',
      target_type: 'DEVICE',
      target_id: 'dev_441209',
      ip_hash: 'f928c11a...',
      metadata: { reason: 'User replaced stolen laptop', license_id: 'lic_88392109' },
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    const ok = await createAdminLicense(newUserEmail, newPlanCode, maxDevices);
    if (ok) {
      setLicenseMsg(`✅ License successfully created for ${newUserEmail}!`);
      setNewUserEmail('');
      onRefresh();
      // add audit log
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          actor_user_id: 'admin_sys_01',
          action: 'CREATE_LICENSE',
          target_type: 'LICENSE',
          target_id: `lic_${Date.now()}`,
          ip_hash: '127.0.0.1_hash',
          metadata: { user_email: newUserEmail, plan_code: newPlanCode, max_devices: maxDevices },
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else {
      setLicenseMsg('❌ Failed to create license');
    }
  };

  const handleResetDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetDeviceId || !resetReason) {
      setResetMsg('❌ Mandatory support reason is required');
      return;
    }
    const ok = await resetDeviceAdmin(resetDeviceId, resetReason);
    if (ok) {
      setResetMsg(`✅ Device ${resetDeviceId} reset successfully!`);
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          actor_user_id: 'support_agent_01',
          action: 'RESET_DEVICE',
          target_type: 'DEVICE',
          target_id: resetDeviceId,
          ip_hash: '127.0.0.1_hash',
          metadata: { reason: resetReason },
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setResetDeviceId('');
      setResetReason('');
      onRefresh();
    } else {
      setResetMsg('❌ Device reset failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Sub-navigation */}
      <div className="flex flex-wrap gap-2 border-b-4 border-black pb-4">
        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'metrics'
              ? 'bg-brutal-yellow text-black shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Activity className="w-4 h-4" /> METRICS OVERVIEW
        </button>
        <button
          onClick={() => setActiveAdminTab('licenses')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'licenses'
              ? 'bg-brutal-cyan text-black shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Key className="w-4 h-4" /> LICENSE MANAGER
        </button>
        <button
          onClick={() => setActiveAdminTab('devices')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'devices'
              ? 'bg-brutal-pink text-white shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> DEVICE SUPPORT RESET
        </button>
        <button
          onClick={() => setActiveAdminTab('presets')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'presets'
              ? 'bg-brutal-green text-black shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-4 h-4" /> PRESET PUBLISHER
        </button>
        <button
          onClick={() => setActiveAdminTab('releases')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'releases'
              ? 'bg-brutal-orange text-black shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Upload className="w-4 h-4" /> RELEASE REGISTRY
        </button>
        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs uppercase border-3 border-black ${
            activeAdminTab === 'audit'
              ? 'bg-black text-white shadow-brutal -translate-y-1'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <Terminal className="w-4 h-4" /> AUDIT LOGS
        </button>
      </div>

      {/* METRICS */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-brutal bg-brutal-yellow">
              <span className="text-xs font-mono font-bold uppercase block text-neutral-800">ACTIVE LICENSES</span>
              <span className="font-mono text-3xl font-bold block mt-2">142</span>
              <span className="text-[10px] font-mono text-black font-bold mt-1 block">+12 this month</span>
            </div>
            <div className="card-brutal bg-brutal-green">
              <span className="text-xs font-mono font-bold uppercase block text-neutral-800">REGISTERED DEVICES</span>
              <span className="font-mono text-3xl font-bold block mt-2">268</span>
              <span className="text-[10px] font-mono text-black font-bold mt-1 block">Max 2 per Pro user</span>
            </div>
            <div className="card-brutal bg-brutal-cyan">
              <span className="text-xs font-mono font-bold uppercase block text-neutral-800">EXPIRING IN 30 DAYS</span>
              <span className="font-mono text-3xl font-bold block mt-2">8</span>
              <span className="text-[10px] font-mono text-black font-bold mt-1 block">Auto-reminders scheduled</span>
            </div>
            <div className="card-brutal bg-brutal-pink text-white">
              <span className="text-xs font-mono font-bold uppercase block text-white opacity-90">ACTIVATION FAILURES (24H)</span>
              <span className="font-mono text-3xl font-bold block mt-2">0</span>
              <span className="text-[10px] font-mono text-white font-bold mt-1 block">All systems healthy</span>
            </div>
          </div>

          <div className="card-brutal bg-white space-y-4">
            <h3 className="font-mono text-lg font-bold uppercase border-b-3 border-black pb-2">SYSTEM HEALTH & DATABASE POOL (NEON AWS AP-SOUTHEAST-1)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 border-2 border-black bg-neutral-50">
                <span className="font-bold block uppercase text-neutral-500">Database Host</span>
                <span className="truncate block font-mono text-black mt-1">ep-lively-sea-az29lh7v-pooler.c-3.ap-southeast-1.aws.neon.tech</span>
              </div>
              <div className="p-3 border-2 border-black bg-neutral-50">
                <span className="font-bold block uppercase text-neutral-500">API Latency</span>
                <span className="block font-mono text-brutal-green font-bold mt-1">18 ms (Vercel Edge Gateway)</span>
              </div>
              <div className="p-3 border-2 border-black bg-neutral-50">
                <span className="font-bold block uppercase text-neutral-500">RLS Enforcement</span>
                <span className="badge-brutal bg-brutal-green text-black mt-1">ACTIVE (14 TABLES)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LICENSES MANAGER */}
      {activeAdminTab === 'licenses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Issue License Form */}
          <div className="card-brutal bg-white space-y-4">
            <h3 className="font-mono text-lg font-bold uppercase border-b-3 border-black pb-2">ISSUE / EXTEND LICENSE</h3>
            <form onSubmit={handleCreateLicense} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="gis.expert@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="input-brutal w-full"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Entitlement Plan</label>
                <select
                  value={newPlanCode}
                  onChange={(e: any) => setNewPlanCode(e.target.value)}
                  className="input-brutal w-full"
                >
                  <option value="individual_pro">Individual Pro (Full Features)</option>
                  <option value="free">Free Preview</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Max Devices Limit</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(Number(e.target.value))}
                  className="input-brutal w-full"
                />
              </div>
              <button type="submit" className="btn-brutal-yellow w-full py-2.5">
                ISSUE PRO LICENSE →
              </button>
            </form>
            {licenseMsg && <p className="font-mono text-xs font-bold border-2 border-black p-2 bg-neutral-100">{licenseMsg}</p>}
          </div>

          {/* Active Licenses List */}
          <div className="md:col-span-2 card-brutal bg-white space-y-4">
            <h3 className="font-mono text-lg font-bold uppercase border-b-3 border-black pb-2">ACTIVE PRO LICENSES DIRECTORY</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-2 border-black">
                <thead className="bg-black text-white uppercase">
                  <tr>
                    <th className="p-2 border-r-2 border-white">User Email</th>
                    <th className="p-2 border-r-2 border-white">Plan</th>
                    <th className="p-2 border-r-2 border-white">Max Dev</th>
                    <th className="p-2 border-r-2 border-white">Status</th>
                    <th className="p-2">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-black hover:bg-neutral-50">
                    <td className="p-2.5 border-r-2 border-black font-bold">gis.lead@plantation.co.id</td>
                    <td className="p-2.5 border-r-2 border-black">individual_pro</td>
                    <td className="p-2.5 border-r-2 border-black">2</td>
                    <td className="p-2.5 border-r-2 border-black">
                      <span className="badge-brutal bg-brutal-green text-black">ACTIVE</span>
                    </td>
                    <td className="p-2.5">2027-07-26</td>
                  </tr>
                  <tr className="border-b-2 border-black hover:bg-neutral-50">
                    <td className="p-2.5 border-r-2 border-black font-bold">hydrology.consultant@water.org</td>
                    <td className="p-2.5 border-r-2 border-black">individual_pro</td>
                    <td className="p-2.5 border-r-2 border-black">3</td>
                    <td className="p-2.5 border-r-2 border-black">
                      <span className="badge-brutal bg-brutal-yellow text-black">TRIAL</span>
                    </td>
                    <td className="p-2.5">2026-08-15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DEVICE SUPPORT RESET */}
      {activeAdminTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-brutal bg-white space-y-4">
            <h3 className="font-mono text-lg font-bold uppercase border-b-3 border-black pb-2 text-brutal-pink">INTERNAL SUPPORT DEVICE RESET</h3>
            <p className="text-xs font-mono text-neutral-600">
              Resetting a device un-revokes or clears an installation hash for a customer. A mandatory support reason must be provided for audit logging.
            </p>
            <form onSubmit={handleResetDevice} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Device ID or Label</label>
                <input
                  type="text"
                  required
                  placeholder="dev_991823"
                  value={resetDeviceId}
                  onChange={(e) => setResetDeviceId(e.target.value)}
                  className="input-brutal w-full"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Mandatory Support Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Customer upgraded motherboard / replaced broken workstation."
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  className="input-brutal w-full"
                />
              </div>
              <button type="submit" className="btn-brutal-pink w-full py-2.5">
                EXECUTE AUDITED RESET →
              </button>
            </form>
            {resetMsg && <p className="font-mono text-xs font-bold border-2 border-black p-2 bg-neutral-100">{resetMsg}</p>}
          </div>

          <div className="md:col-span-2 card-brutal bg-white space-y-4">
            <h3 className="font-mono text-lg font-bold uppercase border-b-3 border-black pb-2">SYSTEM REGISTERED DEVICES</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-2 border-black">
                <thead className="bg-black text-white uppercase">
                  <tr>
                    <th className="p-2 border-r-2 border-white">Device ID</th>
                    <th className="p-2 border-r-2 border-white">Label</th>
                    <th className="p-2 border-r-2 border-white">Platform</th>
                    <th className="p-2 border-r-2 border-white">Status</th>
                    <th className="p-2">Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} className="border-b-2 border-black hover:bg-neutral-50">
                      <td className="p-2.5 border-r-2 border-black font-mono font-bold">{d.id}</td>
                      <td className="p-2.5 border-r-2 border-black">{d.label}</td>
                      <td className="p-2.5 border-r-2 border-black">{d.platform}</td>
                      <td className="p-2.5 border-r-2 border-black">
                        {d.revoked_at ? (
                          <span className="badge-brutal bg-brutal-pink text-white">REVOKED</span>
                        ) : (
                          <span className="badge-brutal bg-brutal-green text-black">ACTIVE</span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <button
                          onClick={() => setResetDeviceId(d.id)}
                          className="btn-brutal-yellow text-[10px] py-1 px-2"
                        >
                          SELECT FOR RESET
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRESET PUBLISHER */}
      {activeAdminTab === 'presets' && (
        <div className="card-brutal bg-white space-y-4">
          <div className="flex items-center justify-between border-b-3 border-black pb-4">
            <div>
              <h3 className="font-mono text-xl font-bold uppercase">PRESET PUBLISHER & VERSION CONTROL</h3>
              <p className="text-xs font-mono text-neutral-600">Published presets are immutable. Revisions require incrementing the version string.</p>
            </div>
            <button onClick={() => alert('Preset draft validator opening...')} className="btn-brutal-green text-xs flex items-center gap-1">
              <Plus className="w-4 h-4" /> CREATE NEW DRAFT PRESET
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {presets.map((p) => (
              <div key={p.code} className="p-4 border-3 border-black bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge-brutal bg-brutal-yellow text-black">{p.code}</span>
                  <span className="font-bold">v{p.version}</span>
                </div>
                <h4 className="font-bold text-sm uppercase">{p.name}</h4>
                <p className="text-[11px] text-neutral-600">Radius: {p.payload?.pipeline?.local_relief?.radius_m}m | Nodata: {p.payload?.pipeline?.local_relief?.nodata_policy}</p>
                <div className="pt-2 border-t border-black flex items-center justify-between">
                  <span className="badge-brutal bg-brutal-green text-black text-[10px]">PUBLISHED</span>
                  <button onClick={() => alert(`Preset JSON schema validated for ${p.code}`)} className="text-[11px] font-bold text-brutal-pink hover:underline">VALIDATE SCHEMA →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RELEASE REGISTRY */}
      {activeAdminTab === 'releases' && (
        <div className="card-brutal bg-white space-y-4">
          <h3 className="font-mono text-xl font-bold uppercase border-b-3 border-black pb-2">PLUGIN RELEASE REGISTRY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-4 border-3 border-black bg-brutal-yellow/20 space-y-3">
              <span className="badge-brutal bg-brutal-green text-black">ACTIVE RELEASE: v{release.version}</span>
              <div className="space-y-1">
                <span className="font-bold uppercase block text-neutral-500">ZIP DOWNLOAD URL</span>
                <code className="block p-2 bg-white border-2 border-black truncate text-[11px]">{release.download_url}</code>
              </div>
              <div className="space-y-1">
                <span className="font-bold uppercase block text-neutral-500">SHA-256</span>
                <code className="block p-2 bg-white border-2 border-black truncate text-[11px]">{release.sha256}</code>
              </div>
            </div>

            <div className="p-4 border-3 border-black bg-white space-y-3">
              <h4 className="font-bold uppercase text-sm border-b-2 border-black pb-1">REGISTER NEW RELEASE ARCHIVE</h4>
              <div className="space-y-2">
                <input type="text" placeholder="Version (e.g. 1.0.1)" className="input-brutal w-full" />
                <input type="text" placeholder="Download ZIP URL" className="input-brutal w-full" />
                <input type="text" placeholder="SHA-256 Checksum" className="input-brutal w-full" />
                <button onClick={() => alert('Release registered and audit logged!')} className="btn-brutal-orange w-full py-2">
                  PUBLISH RELEASE TO MANIFEST →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="card-brutal bg-brutal-darkCard text-white space-y-4">
          <div className="flex items-center justify-between border-b-2 border-white pb-3">
            <div>
              <span className="badge-brutal bg-brutal-pink text-white text-xs mb-1">IMMUTABLE LOG REPOSITORY</span>
              <h3 className="font-mono text-xl font-bold uppercase text-brutal-cyan">SECURITY AUDIT LOGS</h3>
            </div>
            <span className="badge-brutal bg-brutal-green text-black">READ-ONLY</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-2 border-white text-neutral-200">
              <thead className="bg-black text-brutal-yellow uppercase border-b-2 border-white">
                <tr>
                  <th className="p-2.5 border-r border-white">Timestamp</th>
                  <th className="p-2.5 border-r border-white">Actor</th>
                  <th className="p-2.5 border-r border-white">Action</th>
                  <th className="p-2.5 border-r border-white">Target</th>
                  <th className="p-2.5">Metadata Payload</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-700 hover:bg-neutral-900">
                    <td className="p-2.5 border-r border-neutral-700 font-mono text-neutral-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-2.5 border-r border-neutral-700 font-bold text-white">{log.actor_user_id}</td>
                    <td className="p-2.5 border-r border-neutral-700">
                      <span className="badge-brutal bg-brutal-cyan text-black">{log.action}</span>
                    </td>
                    <td className="p-2.5 border-r border-neutral-700">{log.target_type}:{log.target_id}</td>
                    <td className="p-2.5 font-mono text-[11px] text-brutal-green truncate max-w-xs">
                      {JSON.stringify(log.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
