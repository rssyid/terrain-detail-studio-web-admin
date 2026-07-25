export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  status: 'active' | 'suspended';
  created_at: string;
}

export interface LicenseEntitlement {
  license_id: string | null;
  plan_code: 'free' | 'individual_pro';
  status: 'active' | 'expired' | 'trial' | 'revoked' | 'none';
  expires_at: string | null;
  offline_until: string | null;
  limits: {
    devices: number;
    batch_items_per_run: number;
  };
  features: {
    md_hillshade: boolean;
    slope_texture: boolean;
    local_relief: boolean;
    cartographic_style: boolean;
    preset_pro: boolean;
    batch_processing: boolean;
    vrt_builder: boolean;
  };
}

export interface DeviceRecord {
  id: string;
  label: string;
  platform: string;
  qgis_version: string;
  plugin_version: string;
  first_seen_at: string;
  last_seen_at: string;
  revoked_at: string | null;
  status: 'active' | 'revoked';
}

export interface PresetItem {
  code: string;
  name: string;
  version: string;
  min_plugin_version: string;
  required_features: string[];
  payload: any;
  published_at: string;
}

export interface PluginRelease {
  version: string;
  min_qgis_version: string;
  download_url: string;
  sha256: string;
  release_notes: string;
  published_at: string;
}

export interface AuditLogItem {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  ip_hash: string | null;
  metadata: any;
  created_at: string;
}

export interface AdminMetrics {
  total_users: number;
  active_licenses: number;
  expiring_30_days: number;
  active_devices: number;
  activation_failures_24h: number;
}
