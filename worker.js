import HTML_CONTENT from './index.html';

const ALLOWED_PROXY_HOSTS = new Set(['agnes-ai.com', 'apihub.agnes-ai.com']);
const PROXY_LIMIT = { max: 60, windowMs: 60_000 };
const proxyHits = new Map();

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === '/api/proxy') {
      return handleProxy(request);
    }

    return new Response(HTML_CONTENT, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

function allowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return new URL(origin).hostname === new URL(request.url).hostname;
}

function rateLimit(request) {
  const now = Date.now();
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const item = proxyHits.get(ip) || { count: 0, resetAt: now + PROXY_LIMIT.windowMs };
  if (now > item.resetAt) {
    item.count = 0;
    item.resetAt = now + PROXY_LIMIT.windowMs;
  }
  item.count += 1;
  proxyHits.set(ip, item);
  if (proxyHits.size > 1000) {
    for (const [key, value] of proxyHits) if (now > value.resetAt) proxyHits.delete(key);
  }
  return item.count <= PROXY_LIMIT.max;
}

async function handleProxy(request) {
  try {
    if (request.method !== 'POST') return jsonError('Proxy only accepts POST requests', 405);
    if (!allowedOrigin(request)) return jsonError('Proxy origin is not allowed', 403);
    if (!rateLimit(request)) return jsonError('Proxy rate limit exceeded', 429);
    const { targetUrl, method = 'POST', headers = {}, body } = await request.json();
    const target = new URL(targetUrl);
    const proxyMethod = String(method).toUpperCase();

    if (!ALLOWED_PROXY_HOSTS.has(target.hostname)) return jsonError('Proxy target is not allowed', 403);
    if (!['GET', 'POST'].includes(proxyMethod)) return jsonError('Proxy method is not allowed', 405);

    const resp = await fetch(target.toString(), {
      method: proxyMethod,
      headers,
      body: proxyMethod === 'GET' ? undefined : body,
    });
    const contentType = resp.headers.get('Content-Type') || 'application/json';
    return new Response(resp.body, {
      status: resp.status,
      headers: { ...corsHeaders(), 'Content-Type': contentType },
    });
  } catch (err) {
    return jsonError(err.message || 'Proxy request failed', 500);
  }
}
