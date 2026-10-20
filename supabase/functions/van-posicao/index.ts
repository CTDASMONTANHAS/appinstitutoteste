// Recebe o GPS da van (protocolo OsmAnd, usado pelo app gratuito Traccar Client).
// O Traccar envia:  https://<projeto>.supabase.co/functions/v1/van-posicao?id=<CODIGO>&lat=..&lon=..&timestamp=..
// - <CODIGO> é o código do aparelho gerado por criar_dispositivo_van(); só o hash fica no banco.
// - Recusa coordenadas fora da região, leituras velhas e envios em rajada.
// - Grava só a posição ATUAL (sem histórico).
// Publicar com "Verify JWT" DESLIGADO (o Traccar não envia login); a proteção é o código do aparelho.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // disponível só no servidor, nunca no app
  { auth: { persistSession: false } },
);

const REGIAO = { latMin: -20.4, latMax: -19.8, lngMin: -41.4, lngMax: -40.8 };

async function sha256(texto: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const resposta = (status: number, msg = "") => new Response(msg, { status });

Deno.serve(async (req) => {
  if (req.method !== "GET" && req.method !== "POST") return resposta(405);

  // O Traccar manda os dados na URL; aceita também formulário no corpo.
  const params = new URL(req.url).searchParams;
  if (req.method === "POST" && (req.headers.get("content-type") || "").includes("form")) {
    new URLSearchParams(await req.text()).forEach((v, k) => params.set(k, v));
  }

  const codigo = params.get("id") || "";
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lon"));
  if (!/^[0-9a-f]{48}$/.test(codigo)) return resposta(401);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return resposta(400);
  if (lat < REGIAO.latMin || lat > REGIAO.latMax || lng < REGIAO.lngMin || lng > REGIAO.lngMax) return resposta(422);

  // Leitura com mais de 2 minutos (ex.: celular sem sinal reenviando fila) não move a van.
  const ts = Number(params.get("timestamp"));
  if (Number.isFinite(ts) && ts > 0) {
    const ms = ts > 1e12 ? ts : ts * 1000;
    if (Date.now() - ms > 120_000) return resposta(200, "antiga");
  }

  const { data: disp } = await supabase
    .from("van_dispositivos").select("rota_id").eq("token_hash", await sha256(codigo)).eq("ativo", true).maybeSingle();
  if (!disp) return resposta(401);

  // No máximo uma gravação a cada 3 segundos por rota.
  const { data: atual } = await supabase
    .from("van_posicao_atual").select("atualizado_em").eq("rota_id", disp.rota_id).maybeSingle();
  if (atual && Date.now() - new Date(atual.atualizado_em).getTime() < 3000) return resposta(200, "ok");

  const { error } = await supabase.from("van_posicao_atual").upsert({
    rota_id: disp.rota_id, lat, lng, em_rota: true, atualizado_em: new Date().toISOString(),
  });
  return error ? resposta(500) : resposta(200, "ok");
});
