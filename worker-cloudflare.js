// Código opcional para o Worker da Cloudflare.
// Se você já colou o código anterior no Worker, ele também funciona.
// Este aqui só melhora o dado inicial padrão para combinar com o admin.html.

const DATA_KEY = "painel-tv-data-v1";

const DEFAULT_DATA = {
  updatedAt: new Date().toISOString(),
  mes: "julho/2026",
  mes_corrida: "julho/2026",
  versao_corrida: "",
  clientes_ativos: 0,
  novos_clientes: 0,
  meta_novos: 0,
  clientes_sairam: 0,
  retencao: 0,
  meta_retencao: 0.95,
  streak: 0,
  metas_setor: [],
  corrida: [
    { nome: "Wesley", meta: 20, realizado: 0, obs: "Muito bem" },
    { nome: "Nádia", meta: 20, realizado: 0, obs: "Muito bem" },
    { nome: "Evelin", meta: 20, realizado: 0, obs: "Muito bem" }
  ],
  conquistas: [],
  contratos: [],
  time: [],
  novos_membros: [],
  clientes: [],
  avisos: [],
  tarefas: []
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: corsHeaders()
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return jsonResponse({
        ok: true,
        message: "API da TV Adapt online",
        endpoints: ["/data"]
      });
    }

    if (url.pathname === "/data" && request.method === "GET") {
      const saved = await env.ADAPT_TV_DATA.get(DATA_KEY);

      if (!saved) {
        await env.ADAPT_TV_DATA.put(DATA_KEY, JSON.stringify(DEFAULT_DATA));
        return jsonResponse(DEFAULT_DATA);
      }

      try {
        return jsonResponse(JSON.parse(saved));
      } catch (error) {
        return jsonResponse({
          ok: false,
          error: "Dados salvos estão inválidos.",
          details: String(error)
        }, 500);
      }
    }

    if (url.pathname === "/data" && request.method === "POST") {
      const token = request.headers.get("X-Admin-Token");

      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return jsonResponse({
          ok: false,
          error: "Token admin inválido."
        }, 401);
      }

      let body;
      try {
        body = await request.json();
      } catch (error) {
        return jsonResponse({ ok: false, error: "JSON inválido." }, 400);
      }

      const nextData = {
        ...body,
        updatedAt: new Date().toISOString()
      };

      await env.ADAPT_TV_DATA.put(DATA_KEY, JSON.stringify(nextData));

      return jsonResponse({
        ok: true,
        savedAt: nextData.updatedAt,
        data: nextData
      });
    }

    return jsonResponse({ ok: false, error: "Rota não encontrada." }, 404);
  }
};
