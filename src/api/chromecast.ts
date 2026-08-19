export type ProbeState = 'idle' | 'running' | 'ok' | 'warn' | 'error';

export interface ChromecastEndpointResult {
  label: string;
  path: string;
  method: 'GET';
  state: ProbeState;
  status?: number;
  summary: string;
  detail?: unknown;
}

export interface ChromecastDiagnosticReport {
  host: string;
  startedAt: string;
  finishedAt: string;
  endpoints: ChromecastEndpointResult[];
  capabilities: string[];
  limitations: string[];
}

const SETUP_ENDPOINTS: Array<Pick<ChromecastEndpointResult, 'label' | 'path' | 'method'>> = [
  { label: 'Eureka info', path: '/setup/eureka_info?params=version,name,build_info,device_info,net,setup,wifi,opencast', method: 'GET' },
  { label: 'Device info', path: '/setup/device_info', method: 'GET' },
  { label: 'Applications', path: '/setup/app_device_id', method: 'GET' },
  { label: 'Supported locales', path: '/setup/supported_locales', method: 'GET' },
  { label: 'Open screen state', path: '/setup/open_eureka_info', method: 'GET' },
];

const TIMEOUT_MS = 7000;

function normalizeHost(input: string): string {
  return input.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function summarizePayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'Endpoint responded, but did not return structured JSON.';
  const record = payload as Record<string, unknown>;
  const parts = [record.name, record.product_name, record.release_track, record.build_version, record.setup_state]
    .filter((value) => value !== undefined && value !== null)
    .map(String);
  return parts.length > 0 ? parts.join(' • ') : 'Endpoint returned JSON; inspect raw details below.';
}

async function fetchJsonWithTimeout(url: string): Promise<{ status: number; body: unknown }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { method: 'GET', signal: controller.signal });
    const text = await response.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    return { status: response.status, body };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runChromecastDiagnostics(hostInput: string): Promise<ChromecastDiagnosticReport> {
  const host = normalizeHost(hostInput);
  const startedAt = new Date().toISOString();
  const endpoints: ChromecastEndpointResult[] = [];

  for (const endpoint of SETUP_ENDPOINTS) {
    const url = `http://${host}:8008${endpoint.path}`;
    try {
      const { status, body } = await fetchJsonWithTimeout(url);
      endpoints.push({
        ...endpoint,
        status,
        state: status >= 200 && status < 300 ? 'ok' : 'warn',
        summary: status >= 200 && status < 300 ? summarizePayload(body) : `HTTP ${status}; endpoint exists but is not openly readable.`,
        detail: body,
      });
    } catch (error) {
      endpoints.push({
        ...endpoint,
        state: 'error',
        summary: error instanceof Error ? error.message : 'Request failed.',
      });
    }
  }

  const readable = endpoints.filter((endpoint) => endpoint.state === 'ok').map((endpoint) => endpoint.label);
  return {
    host,
    startedAt,
    finishedAt: new Date().toISOString(),
    endpoints,
    capabilities: [
      readable.length > 0 ? `Readable local setup surfaces: ${readable.join(', ')}.` : 'No readable local setup endpoints found yet.',
      'Expo Go can test HTTP setup surfaces and build a modular diagnostic workflow without Google Home sign-in.',
      'A custom Android development build can add mDNS discovery and Cast V2 TLS control on port 8009.',
    ],
    limitations: [
      'Expo Go cannot ship arbitrary native networking modules, so automatic mDNS discovery and raw Cast V2 socket control need a dev build.',
      'Write operations such as Wi-Fi provisioning, rename, reboot, or factory-reset may require device setup mode or a local authorization token.',
      'This tool does not bypass account, DRM, firmware-signature, or receiver-app restrictions.',
    ],
  };
}

export function formatReport(report: ChromecastDiagnosticReport): string {
  return JSON.stringify(report, null, 2);
}
