import HTML_CONTENT from './index.html';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // API proxy
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

async function handleProxy(request) {
  try {
    const { targetUrl, method, headers, body } = await request.json();
    const resp = await fetch(targetUrl, {
      method: method || 'POST',
      headers: headers || { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const contentType = resp.headers.get('Content-Type') || 'application/json';
    return new Response(resp.body, {
      status: resp.status,
      headers: { ...corsHeaders(), 'Content-Type': contentType },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}
