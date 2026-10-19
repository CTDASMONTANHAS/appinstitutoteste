/* App do Instituto Cultural das Montanhas — protótipo (SPA com rotas por hash). */

const $ = (sel, root = document) => root.querySelector(sel);
const view = $("#view");

/* ---------- Ícones (traço) ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  news: '<path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v10a2 2 0 0 1-4 0"/><path d="M8 9h5M8 13h5M8 17h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.3 3.8 4 7.2 4c2 0 3.5 1.1 4.8 2.8C13.3 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.4 6.6C19.5 15.4 12 20 12 20z"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.9-3.5 3.4-5.5 6.5-5.5s5.6 2 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3"/>',
  signal: '<path d="M2.5 9a14 14 0 0 1 19 0"/><path d="M6 12.5a9 9 0 0 1 12 0"/><path d="M9.3 16a4 4 0 0 1 5.4 0"/><circle cx="12" cy="19.3" r="1.1" fill="currentColor"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
  bus: '<rect x="4" y="3.5" width="16" height="14" rx="3"/><path d="M4 11h16M8 17.5V20M16 17.5V20"/><circle cx="8" cy="14.3" r=".9" fill="currentColor"/><circle cx="16" cy="14.3" r=".9" fill="currentColor"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>',
};
const icon = (name, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name] || ""}</svg>`;

document.querySelectorAll("[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
$("#btn-voltar").innerHTML = icon("back");
$("#btn-avisos").innerHTML = icon("bell") + '<span class="dot"></span>';

/* ---------- Utilitários ---------- */
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const absUrl = (u) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `${SITE}/${String(u).replace(/^\/+/, "")}`);
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const parseData = (s) => { const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
const fmtData = (s) => { const d = parseData(s); return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };
const waLink = (txt) => `https://wa.me/${INSTITUTO.whatsapp}?text=${encodeURIComponent(txt)}`;

const store = {
  get(k, def) { try { const v = localStorage.getItem("icm_" + k); return v === null ? def : JSON.parse(v); } catch { return def; } },
  set(k, v) { try { localStorage.setItem("icm_" + k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

async function copiar(texto, msg) {
  try { await navigator.clipboard.writeText(texto); } catch {
    const ta = document.createElement("textarea"); ta.value = texto; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch { /* ignora */ } ta.remove();
  }
  toast(msg);
}

function sheet(html) {
  const bg = document.createElement("div");
  bg.className = "sheet-backdrop";
  bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  bg.addEventListener("click", (e) => { if (e.target === bg || e.target.closest("[data-close]")) bg.remove(); });
  $("#app").appendChild(bg);
  return bg;
}

const protoNote = (txt) => `<div class="proto-note">${icon("info")}<span>${txt}</span></div>`;

// Remove scripts, iframes e atributos de evento do HTML vindo do blog.
function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,form,link,meta").forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((n) => {
    [...n.attributes].forEach((a) => {
      const nome = a.name.toLowerCase();
      if (nome.startsWith("on") || nome === "style") n.removeAttribute(a.name);
      if ((nome === "href" || nome === "src") && /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
    });
    if (n.tagName === "IMG") { n.setAttribute("src", absUrl(n.getAttribute("src"))); n.setAttribute("loading", "lazy"); }
    if (n.tagName === "A") { n.setAttribute("target", "_blank"); n.setAttribute("rel", "noopener"); }
  });
  return doc.body.firstChild.innerHTML;
}

/* ---------- Blog (API pública do site, CORS liberado) ---------- */
const cacheNoticias = new Map();
async function buscarNoticias({ categoria = "", limit = 20 } = {}) {
  const chave = `${categoria}|${limit}`;
  if (cacheNoticias.has(chave)) return cacheNoticias.get(chave);
  const qs = new URLSearchParams({ page: "1", limit: String(limit) });
  if (categoria) qs.set("categoria", categoria);
  const r = await fetch(`${BLOG_API}?${qs}`);
  if (!r.ok) throw new Error("blog " + r.status);
  const posts = (await r.json()).posts || [];
  cacheNoticias.set(chave, posts);
  return posts;
}
async function buscarNoticia(slug) {
  const r = await fetch(`${BLOG_API}?slug=${encodeURIComponent(slug)}`);
  if (!r.ok) throw new Error("post " + r.status);
  const j = await r.json();
  return j.post || j;
}
const catNome = (c) => CATEGORIAS[c] || "Instituto";

function newsItem(p) {
  return `<a class="news-item" href="#/noticia/${encodeURIComponent(p.slug)}">
    <img src="${esc(absUrl(p.capa_url))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
    <div><div class="news-meta"><span class="cat">${esc(catNome(p.categoria))}</span><span>${fmtData(p.publicado_em)}</span></div>
    <h3>${esc(p.titulo)}</h3></div></a>`;
}
function newsFeature(p) {
  return `<a class="news-feature" href="#/noticia/${encodeURIComponent(p.slug)}">
    <img src="${esc(absUrl(p.capa_url))}" alt="" loading="lazy">
    <div class="nf-body"><div class="news-meta"><span class="cat">${esc(catNome(p.categoria))}</span><span>${fmtData(p.publicado_em)}</span></div>
    <h3>${esc(p.titulo)}</h3><p>${esc((p.resumo || "").slice(0, 140))}…</p></div></a>`;
}
const skeletonNews = (n = 3) => Array.from({ length: n }, () => `<div class="skeleton" style="height:100px"></div>`).join("");

/* ---------- Telas ---------- */
const sessao = () => store.get("sessao", null);

function telaInicio() {
  const destaque = PROJETOS.find((p) => p.novo);
  const proximos = AGENDA.filter((e) => e.tipo === "evento").slice(0, 3);
  const s = sessao();
  const ola = s ? `Olá, ${esc(s.nome.split(" ")[0])}` : "Bem-vindo(a)";

  view.innerHTML = `
    <p class="eyebrow mt-0" style="margin-bottom:12px">${ola}</p>
    <section class="hero">
      <img src="${img("criancas-violinos-montanhas.jpg")}" alt="">
      <span class="eyebrow">Nas trilhas da cultura</span>
      <h2>Transformando vidas nas <em>montanhas capixabas.</em></h2>
      <p>Música, coral, orquestra e esporte — tudo gratuito, para quem mais precisa.</p>
      <div class="btn-row"><a class="btn gold" href="#/projetos">Conhecer ${icon("arrow")}</a></div>
    </section>

    <nav class="quick" aria-label="Atalhos">
      <a href="#/doar" class="gold"><span class="q-ico">${icon("heart")}</span>Doar</a>
      <a href="#/inscricao/${destaque.id}"><span class="q-ico">${icon("pen")}</span>Inscrever</a>
      <a href="#/ouvidoria"><span class="q-ico">${icon("chat")}</span>Ouvidoria</a>
      <a href="#/sobre"><span class="q-ico">${icon("shield")}</span>Instituto</a>
    </nav>

    ${s ? `<section class="section">
      <a class="card gold row-between" href="#/checkin">
        <div><span class="eyebrow">Sua próxima aula</span>
        <div style="font-weight:800;font-size:16px;margin-top:6px">${esc(ALUNO_DEMO.proximas[0].aula)}</div>
        <div class="small muted">${ALUNO_DEMO.proximas[0].dia}, ${ALUNO_DEMO.proximas[0].data} · ${ALUNO_DEMO.proximas[0].hora}</div></div>
        <span class="icon-btn" style="color:var(--gold)">${icon("signal")}</span>
      </a></section>` : ""}

    <section class="section">
      <div class="section-head"><h2>Inscrições abertas</h2></div>
      <a class="card row-between" href="#/projeto/${destaque.id}" style="gap:14px">
        <img src="${esc(destaque.foto)}" alt="" style="width:76px;height:76px;border-radius:16px;object-fit:cover;filter:grayscale(1);flex:none">
        <div style="flex:1"><span class="chip gold">${esc(destaque.tag)}</span>
        <div style="font-weight:800;margin-top:8px">${esc(destaque.nome)}</div>
        <div class="small muted">${esc(destaque.publico)}</div></div>
        ${icon("chev", 'class="chev" style="width:18px;color:var(--muted)"')}
      </a>
    </section>

    <section class="section">
      <div class="section-head"><h2>Projetos</h2><a href="#/projetos">Ver todos</a></div>
      <div class="hscroll">${PROJETOS.slice(0, 6).map(projCard).join("")}</div>
    </section>

    <section class="section" style="margin-top:8px">
      <div class="section-head"><h2>Nosso impacto</h2></div>
      <div class="stats">${NUMEROS.map((n) => `<div class="stat"><strong>${n.valor}</strong><span>${n.rotulo}</span></div>`).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Próximos eventos</h2><a href="#/agenda">Agenda</a></div>
      ${proximos.map(eventoHtml).join("")}
    </section>

    <section class="section">
      <div class="section-head"><h2>Últimas notícias</h2><a href="#/noticias">Ver todas</a></div>
      <div id="home-news" class="news-list">${skeletonNews(3)}</div>
    </section>

    <p class="footer-note"><b>Instituto Cultural das Montanhas</b><br>Afonso Cláudio · Espírito Santo</p>`;

  buscarNoticias({ limit: 4 }).then((posts) => {
    const box = $("#home-news");
    if (box) box.innerHTML = posts.length ? newsFeature(posts[0]) + posts.slice(1).map(newsItem).join("") : `<p class="muted small">Nenhuma notícia por enquanto.</p>`;
  }).catch(() => { const box = $("#home-news"); if (box) box.innerHTML = `<p class="muted small">Não foi possível carregar as notícias agora.</p>`; });
}

function projCard(p) {
  return `<a class="proj-card" href="#/projeto/${p.id}">
    <img src="${esc(p.foto)}" alt="" loading="lazy">
    <div class="pc-body"><span class="chip outline">${esc(p.area === "esporte" ? "Esporte" : "Cultura")}</span><strong>${esc(p.nome)}</strong></div>
  </a>`;
}

function telaProjetos(params) {
  let area = params.get("area") || "todos";
  const render = () => {
    const lista = PROJETOS.filter((p) => area === "todos" || p.area === area);
    view.innerHTML = `
      <div class="seg" role="tablist">
        ${["todos", "cultura", "esporte"].map((a) => `<button class="${a === area ? "on" : ""}" data-area="${a}">${a}</button>`).join("")}
      </div>
      <div class="proj-list">
        ${lista.map((p) => `<a class="proj-row" href="#/projeto/${p.id}">
          <img src="${esc(p.foto)}" alt="" loading="lazy">
          <div><span class="chip ${p.novo ? "gold" : ""}">${esc(p.tag)}</span><strong>${esc(p.nome)}</strong><p>${esc(p.resumo)}</p></div>
        </a>`).join("")}
      </div>
      ${protoNote("Todos os projetos são <b>gratuitos</b>. A inscrição organiza as turmas e o transporte.")}`;
    view.querySelectorAll("[data-area]").forEach((b) => b.addEventListener("click", () => { area = b.dataset.area; render(); }));
  };
  render();
}

function telaProjeto(id) {
  const p = PROJETOS.find((x) => x.id === id);
  if (!p) return naoEncontrado();
  setTitulo("");
  view.innerHTML = `
    <div class="cover"><img src="${esc(p.foto)}" alt="">
      <div class="cv-body"><span class="chip outline">${esc(p.tag)}</span><h2>${esc(p.nome)}</h2></div></div>
    <p style="color:var(--text-2)">${esc(p.texto)}</p>
    <div class="info-list mt-16">
      <div>${icon("people")}<div><small>Público</small><span>${esc(p.publico)}</span></div></div>
      <div>${icon("pin")}<div><small>Local</small><span>${esc(p.local)}</span></div></div>
      <div>${icon("clock")}<div><small>Horários</small><span>${p.horarios.map(esc).join("<br>")}</span></div></div>
    </div>
    <div class="btn-row" style="margin-top:26px">
      <a class="btn gold block" href="#/inscricao/${p.id}">Quero me inscrever ${icon("arrow")}</a>
      <a class="btn ghost block" href="${waLink(`Olá! Gostaria de saber mais sobre o projeto ${p.nome}.`)}" target="_blank" rel="noopener">${icon("whatsapp")} Tirar dúvidas</a>
    </div>
    <section class="section"><div class="section-head"><h2>Notícias do projeto</h2></div>
      <div id="proj-news" class="news-list">${skeletonNews(2)}</div></section>`;

  const categoria = CATEGORIAS[p.id] ? p.id : "";
  if (!categoria) { $("#proj-news").closest("section").remove(); return; }
  buscarNoticias({ categoria, limit: 3 }).then((posts) => {
    const box = $("#proj-news");
    if (!box) return;
    if (!posts.length) box.closest("section").remove();
    else box.innerHTML = posts.map(newsItem).join("");
  }).catch(() => $("#proj-news")?.closest("section").remove());
}

function telaInscricao(id) {
  const p = PROJETOS.find((x) => x.id === id) || PROJETOS[0];
  view.innerHTML = `
    <div class="auth" style="justify-content:flex-start;padding-top:4px">
      <span class="eyebrow" style="text-align:center">Inscrição gratuita</span>
      <h2 style="margin-top:8px">${esc(p.nome)}</h2>
      <p class="sub">Preencha em menos de 2 minutos. A secretaria entra em contato para confirmar a vaga.</p>
      <form id="f-insc" novalidate>
        <div class="field"><label for="i-nome">Nome do(a) aluno(a)</label><input id="i-nome" required placeholder="Nome completo"></div>
        <div class="field"><label for="i-nasc">Data de nascimento</label><input id="i-nasc" type="date" required></div>
        <div class="field"><label for="i-resp">Responsável (se menor)</label><input id="i-resp" placeholder="Nome do responsável"></div>
        <div class="field"><label for="i-tel">WhatsApp</label><input id="i-tel" type="tel" inputmode="tel" required placeholder="(27) 9 0000-0000"></div>
        <div class="field"><label for="i-escola">Escola</label><input id="i-escola" placeholder="Escola onde estuda"></div>
        <div class="field"><label>Precisa da van?</label><div class="pills" data-pills="van"><button type="button" class="on">Sim</button><button type="button">Não</button></div></div>
        <button class="btn gold block mt-16" type="submit">Enviar inscrição ${icon("arrow")}</button>
      </form>
      ${protoNote("Protótipo: a inscrição não é enviada de verdade. Na versão final, ela cai direto no sistema da secretaria.")}
    </div>`;
  ligarPills();
  $("#f-insc").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#i-nome").value.trim(), tel = $("#i-tel").value.trim();
    if (!nome || !tel) return toast("Preencha nome e WhatsApp.");
    sucesso("Inscrição recebida!", `Obrigado, ${esc(nome.split(" ")[0])}. A secretaria vai falar com você pelo WhatsApp para confirmar a vaga em <b>${esc(p.nome)}</b>.`);
  });
}

function eventoHtml(e) {
  const d = parseData(e.data);
  return `<div class="event ${e.tipo}">
    <div class="ev-date"><strong>${d.getDate()}</strong><span>${MESES[d.getMonth()]}</span></div>
    <div style="min-width:0"><h3>${esc(e.titulo)}</h3><p>${e.hora !== "—" ? esc(e.hora) + " · " : ""}${esc(e.local)}</p></div>
    <button class="icon-btn add" data-lembrar="${esc(e.titulo)}" aria-label="Lembrar">${icon("bell")}</button>
  </div>`;
}

function telaAgenda() {
  const hoje = new Date();
  let sel = null;
  const dias = Array.from({ length: 7 }, (_, i) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i));
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let filtro = "todos";

  const render = () => {
    let lista = AGENDA.filter((e) => filtro === "todos" || (filtro === "eventos" ? e.tipo === "evento" : e.tipo !== "evento"));
    if (sel) lista = lista.filter((e) => e.data === sel);
    const porMes = {};
    lista.forEach((e) => { const d = parseData(e.data); const k = `${["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"][d.getMonth()]} ${d.getFullYear()}`; (porMes[k] ||= []).push(e); });

    view.innerHTML = `
      <div class="week">${dias.map((d) => `<button class="${sel === iso(d) ? "on" : ""} ${AGENDA.some((e) => e.data === iso(d)) ? "has" : ""}" data-dia="${iso(d)}">${DIAS[d.getDay()]}<strong>${d.getDate()}</strong></button>`).join("")}</div>
      <div class="seg">${["todos", "eventos", "aulas"].map((f) => `<button class="${f === filtro ? "on" : ""}" data-f="${f}">${f}</button>`).join("")}</div>
      ${Object.keys(porMes).length ? Object.entries(porMes).map(([m, evs]) => `<div class="month-label">${m}</div>${evs.map(eventoHtml).join("")}`).join("")
        : `<div class="success"><div class="ok">${icon("calendar")}</div><p class="muted">Nada marcado para este dia.</p></div>`}
      ${protoNote("Agenda ilustrativa. Na versão final, ela é alimentada pelo painel do Instituto e avisa por notificação.")}`;
    view.querySelectorAll("[data-dia]").forEach((b) => b.addEventListener("click", () => { sel = sel === b.dataset.dia ? null : b.dataset.dia; render(); }));
    view.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filtro = b.dataset.f; render(); }));
  };
  render();
}

function telaNoticias() {
  let cat = "";
  const cats = ["", "geral", "orquestra-jonice-tristao", "corais-das-montanhas", "musicalizacao-agricola", "scfv", "voleibol-feminino", "artes-marciais", "basquete"];
  view.innerHTML = `
    <div class="chips-scroll">${cats.map((c) => `<button class="${c === cat ? "on" : ""}" data-cat="${c}">${c ? catNome(c) : "Todas"}</button>`).join("")}</div>
    <div id="news-box" class="news-list">${skeletonNews(5)}</div>`;
  const carregar = async () => {
    const box = $("#news-box");
    box.innerHTML = skeletonNews(5);
    try {
      const posts = await buscarNoticias({ categoria: cat, limit: 20 });
      if (!$("#news-box")) return;
      box.innerHTML = posts.length ? newsFeature(posts[0]) + posts.slice(1).map(newsItem).join("") : `<p class="muted">Sem notícias nesta categoria.</p>`;
    } catch { box.innerHTML = `<p class="muted">Não foi possível carregar as notícias. Verifique sua conexão.</p>`; }
  };
  view.querySelectorAll("[data-cat]").forEach((b) => b.addEventListener("click", () => {
    cat = b.dataset.cat;
    view.querySelectorAll("[data-cat]").forEach((x) => x.classList.toggle("on", x === b));
    carregar();
  }));
  carregar();
}

async function telaNoticia(slug) {
  view.innerHTML = `<div class="skeleton" style="height:240px;margin:-8px -18px 0;border-radius:0"></div><div class="skeleton mt-16" style="height:28px"></div><div class="skeleton mt-12" style="height:160px"></div>`;
  try {
    const p = await buscarNoticia(slug);
    if (location.hash !== `#/noticia/${encodeURIComponent(slug)}` && location.hash !== `#/noticia/${slug}`) return;
    view.innerHTML = `<article class="article">
      ${p.capa_url ? `<div class="article-cover"><img src="${esc(absUrl(p.capa_url))}" alt=""></div>` : ""}
      <div class="news-meta" style="margin-top:14px"><span class="cat">${esc(catNome(p.categoria))}</span><span>${fmtData(p.publicado_em)}</span></div>
      <h1>${esc(p.titulo)}</h1>
      ${p.resumo ? `<p class="lead">${esc(p.resumo)}</p>` : ""}
      <div class="body">${sanitize(p.conteudo || "")}</div>
      <div class="btn-row mt-16">
        <button class="btn block" id="btn-share">Compartilhar ${icon("arrow")}</button>
      </div></article>`;
    $("#btn-share").addEventListener("click", async () => {
      const url = `${SITE}/blog-post.html?slug=${encodeURIComponent(slug)}`;
      if (navigator.share) { try { await navigator.share({ title: p.titulo, url }); } catch { /* cancelado */ } }
      else copiar(url, "Link copiado!");
    });
  } catch { view.innerHTML = `<div class="success"><div class="ok">${icon("news")}</div><h2>Ops!</h2><p class="muted">Não conseguimos abrir esta notícia.</p></div>`; }
}

/* ----- Minha área: login → código → painel ----- */
function telaEu() {
  const s = sessao();
  if (!s) return telaLogin("entrar");
  const a = ALUNO_DEMO;
  const C = 2 * Math.PI * 42;
  view.innerHTML = `
    <div class="id-card">
      <div class="id-top"><span class="eyebrow">Carteirinha digital</span><span class="chip gold">Ativo</span></div>
      <h3>${esc(s.nome)}</h3>
      <div class="id-sub">${esc(a.projeto)} · ${esc(a.turma)}</div>
      <div class="id-bottom">
        <div><small>Matrícula</small><b>${a.matricula}</b><small style="margin-top:10px">Validade</small><b style="color:var(--text)">12/2026</b></div>
        <div class="qr" aria-label="QR code da carteirinha">${qrFake(a.matricula)}</div>
      </div>
    </div>

    <a class="btn gold block mt-16" style="margin-top:22px" href="#/checkin">${icon("signal")} Fazer check-in na aula</a>

    <section class="section">
      <div class="section-head"><h2>Minha frequência</h2></div>
      <div class="card">
        <div class="ring-wrap">
          <div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#1d1f23" stroke-width="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - a.frequencia / 100)}"/><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#e2c483"/><stop offset="1" stop-color="#c9a55a"/></linearGradient></defs></svg><b>${a.frequencia}%</b></div>
          <div><div style="font-weight:800;font-size:15px">Muito bem!</div>
          <div class="small muted" style="margin-top:4px">${a.presencas} presenças · ${a.faltas} faltas no semestre</div>
          <span class="chip gold mt-8" style="margin-top:10px">Sem alertas</span></div>
        </div>
        <div class="bars">${a.mensal.map((m) => `<div><i style="height:${m.v * .7}%"></i>${m.m}</div>`).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Próximas aulas</h2></div>
      <div class="card">${a.proximas.map((c) => `<div class="class-row"><div class="cr-day"><small>${c.dia}</small><strong>${c.data.slice(0, 2)}</strong></div><div><div style="font-weight:700;font-size:14px">${esc(c.aula)}</div><div class="small muted">${c.hora} · Sede do Instituto</div></div></div>`).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Avisos</h2></div>
      <div class="list">${a.avisos.map((v) => `<div class="li"><span class="li-ico">${icon("bell")}</span><div class="li-txt"><strong>${esc(v.titulo)}</strong><span>${esc(v.texto)}</span></div><span class="small muted" style="flex:none">${v.quando}</span></div>`).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Serviços</h2></div>
      <div class="list">
        <a href="#" data-acao="van"><span class="li-ico">${icon("bus")}</span><div class="li-txt"><strong>Transporte (van)</strong><span>Horários e ponto de embarque</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="#" data-acao="falta"><span class="li-ico">${icon("doc")}</span><div class="li-txt"><strong>Justificar falta</strong><span>Envie o motivo para a coordenação</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="#/ouvidoria"><span class="li-ico">${icon("chat")}</span><div class="li-txt"><strong>Falar com o Instituto</strong><span>Ouvidoria e contato</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="#" data-acao="sair"><span class="li-ico">${icon("logout")}</span><div class="li-txt"><strong>Sair</strong><span>Encerrar sessão neste aparelho</span></div>${icon("chev", 'class="chev"')}</a>
      </div>
    </section>
    ${protoNote("Dados fictícios de demonstração. Na versão final, frequência e aulas vêm do sistema pedagógico do Instituto.")}`;

  view.querySelectorAll("[data-acao]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    const acao = el.dataset.acao;
    if (acao === "sair") { store.set("sessao", null); toast("Você saiu da sua conta."); render(); }
    if (acao === "van") sheet(`<h3>Transporte gratuito</h3><div class="info-list">
      <div>${icon("clock")}<div><small>Saída</small><span>13h20 — Praça do Centro</span></div></div>
      <div>${icon("pin")}<div><small>Seu ponto</small><span>Ponto 4 — Colina do Cruzeiro</span></div></div>
      <div>${icon("people")}<div><small>Monitora</small><span>Equipe de transporte do Instituto</span></div></div></div>
      <button class="btn block mt-16" style="margin-top:20px" data-close>Fechar</button>`);
    if (acao === "falta") {
      const bg = sheet(`<h3>Justificar falta</h3>
        <div class="field"><label>Data da aula</label><input type="date" value="2026-10-15"></div>
        <div class="field"><label>Motivo</label><textarea placeholder="Ex.: consulta médica, viagem da família…"></textarea></div>
        <button class="btn gold block" data-enviar>Enviar justificativa</button>`);
      bg.querySelector("[data-enviar]").addEventListener("click", () => { bg.remove(); toast("Justificativa enviada à coordenação."); });
    }
  }));
}

function telaLogin(modo) {
  view.innerHTML = `
    <div class="auth">
      <h2>${modo === "entrar" ? "Bem-vindo de volta!" : "Olá! Vamos começar"}</h2>
      <p class="sub">${modo === "entrar" ? "Acesse a área do aluno e do responsável." : "Crie o acesso do aluno ou responsável."}</p>
      <div class="seg" style="margin-bottom:24px">
        <button class="${modo === "entrar" ? "on" : ""}" data-modo="entrar">Entrar</button>
        <button class="${modo === "cadastrar" ? "on" : ""}" data-modo="cadastrar">Cadastrar</button>
      </div>
      <form id="f-login" novalidate>
        ${modo === "cadastrar" ? `<div class="input-wrap">${icon("user")}<input id="l-nome" placeholder="Nome completo" autocomplete="name"></div>
          <div class="input-wrap">${icon("phone")}<input id="l-tel" type="tel" inputmode="tel" placeholder="WhatsApp" autocomplete="tel"></div>`
        : `<div class="input-wrap">${icon("id")}<input id="l-mat" placeholder="Matrícula ou CPF" autocomplete="username"></div>`}
        <div class="input-wrap">${icon("lock")}<input id="l-senha" type="password" placeholder="Senha" autocomplete="${modo === "entrar" ? "current-password" : "new-password"}"></div>
        <button class="btn block" type="submit" style="margin-top:22px">${modo === "entrar" ? "Entrar" : "Criar acesso"} ${icon("arrow")}</button>
      </form>
      ${modo === "entrar" ? `<button class="link-btn" data-esqueci>Esqueci minha senha</button>` : ""}
      ${protoNote("Protótipo: use qualquer matrícula e senha para ver a área do aluno com dados de exemplo.")}
    </div>`;
  view.querySelectorAll("[data-modo]").forEach((b) => b.addEventListener("click", () => telaLogin(b.dataset.modo)));
  view.querySelector("[data-esqueci]")?.addEventListener("click", () => toast("Enviaremos um código pelo WhatsApp cadastrado."));
  $("#f-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = modo === "cadastrar" ? ($("#l-nome").value.trim() || "Aluno(a) Exemplo") : ALUNO_DEMO.nome;
    telaCodigo(nome);
  });
}

function telaCodigo(nome) {
  view.innerHTML = `
    <div class="auth">
      <h2>Verificar acesso</h2>
      <p class="sub">Enviamos um código de 4 dígitos para o WhatsApp<br>cadastrado <b style="color:var(--text-2)">(27) 9 ••••-6584</b></p>
      <div class="otp">${[0, 1, 2, 3].map((i) => `<input inputmode="numeric" autocomplete="one-time-code" aria-label="Dígito ${i + 1}" data-otp="${i}">`).join("")}</div>
      <button class="btn block" id="btn-verificar">Verificar ${icon("arrow")}</button>
      <button class="link-btn" id="btn-reenviar">Reenviar código</button>
      ${protoNote("Protótipo: digite quaisquer 4 números.")}
    </div>`;
  const campos = [...view.querySelectorAll("[data-otp]")];
  campos[0].focus();
  campos.forEach((c, i) => {
    // Distribui os dígitos pelos campos seguintes (digitação rápida, colar, autofill do SMS).
    c.addEventListener("input", () => {
      const dig = c.value.replace(/\D/g, "").split("");
      c.value = "";
      let j = i;
      dig.forEach((d) => { if (campos[j]) campos[j++].value = d; });
      (campos[Math.min(j, campos.length - 1)] || c).focus();
      if (campos.every((x) => x.value)) verificar();
    });
    c.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !c.value && campos[i - 1]) campos[i - 1].focus(); });
  });
  const verificar = () => {
    if (!campos.every((x) => x.value)) return toast("Digite os 4 números do código.");
    store.set("sessao", { nome });
    toast("Acesso liberado!");
    render();
  };
  $("#btn-verificar").addEventListener("click", verificar);
  $("#btn-reenviar").addEventListener("click", () => toast("Novo código enviado."));
}

function telaCheckin() {
  if (!sessao()) { location.hash = "#/eu"; return; }
  const aula = ALUNO_DEMO.proximas[0];
  view.innerHTML = `
    <div class="auth" style="text-align:center">
      <h2>Check-in na aula</h2>
      <p class="sub">${esc(aula.aula)} · ${aula.hora}<br>Aproxime-se da sede do Instituto</p>
      <div class="radar" id="radar"><span class="pulse"></span><span class="pulse" style="animation-delay:1.2s"></span>${icon("signal")}</div>
      <p id="ck-status" style="font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-size:11px;color:var(--muted)">Procurando a sala…</p>
      <button class="btn block mt-16" id="btn-ck" disabled style="opacity:.5">Confirmar presença ${icon("arrow")}</button>
      ${protoNote("Protótipo: na versão final o check-in usa o QR code da sala ou a localização, e marca presença direto na chamada do professor.")}
    </div>`;
  const t = setTimeout(() => {
    const st = $("#ck-status"), b = $("#btn-ck");
    if (!st) return;
    st.textContent = "Sala encontrada · Sede do Instituto"; st.style.color = "var(--gold)";
    b.disabled = false; b.style.opacity = 1; b.classList.add("gold");
  }, 2200);
  $("#btn-ck").addEventListener("click", () => { clearTimeout(t); sucesso("Presença confirmada!", `Bom ensaio! Sua presença em <b>${esc(aula.aula)}</b> foi registrada às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`, "#/eu", "Voltar à minha área"); });
}

function telaDoar() {
  let valor = 50;
  view.innerHTML = `
    <section class="hero" style="min-height:220px">
      <img src="${img("orquestra-1.jpg")}" alt="">
      <span class="eyebrow">Faça parte dessa história</span>
      <h2>Uma oportunidade pode <em>mudar uma vida.</em></h2>
    </section>

    <section class="section">
      <div class="section-head"><h2>Escolha um valor</h2></div>
      <div class="amounts">${[20, 50, 100, 150, 300].map((v) => `<button data-v="${v}" class="${v === valor ? "on" : ""}">R$ ${v}</button>`).join("")}<button data-v="0">Outro</button></div>
      <p class="small muted" id="impacto" style="margin-top:14px"></p>
    </section>

    <section class="card section">
      <span class="eyebrow">Doe pelo PIX</span>
      <div style="font-weight:800;margin-top:8px">${INSTITUTO.nome}</div>
      <div class="pix-box"><code>${INSTITUTO.cnpj}</code><button class="icon-btn" id="btn-pix" aria-label="Copiar chave PIX" style="color:var(--gold)">${icon("copy")}</button></div>
      <p class="small muted" style="margin:0">Chave PIX: CNPJ. No app do seu banco, escolha PIX, cole a chave e confira o nome do Instituto antes de confirmar.</p>
    </section>

    <section class="section">
      <div class="section-head"><h2>Outras formas de apoiar</h2></div>
      <div class="list">
        <a href="#" data-info="fia"><span class="li-ico">${icon("star")}</span><div class="li-txt"><strong>FIA — Imposto de Renda</strong><span>Destine parte do seu IR à infância</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="#" data-info="nota"><span class="li-ico">${icon("doc")}</span><div class="li-txt"><strong>Nota Premiada Capixaba</strong><span>CPF na nota apoia o Instituto</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="${waLink("Olá! Tenho interesse em ser patrocinador do Instituto.")}" target="_blank" rel="noopener"><span class="li-ico">${icon("people")}</span><div class="li-txt"><strong>Seja patrocinador</strong><span>Empresas e Leis de Incentivo</span></div>${icon("chev", 'class="chev"')}</a>
      </div>
    </section>`;
  const impacto = () => {
    const txt = valor >= 150 ? "mantém um aluno com instrumento, aula e transporte por um mês." :
      valor >= 100 ? "garante um mês de transporte gratuito para um aluno." :
      valor >= 50 ? "ajuda a comprar cordas e material para uma turma." :
      valor > 0 ? "contribui com lanche e material nas aulas." : "Qualquer valor faz diferença.";
    $("#impacto").innerHTML = valor > 0 ? `<b style="color:var(--gold)">R$ ${valor}</b> ${txt}` : txt;
  };
  view.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
    valor = Number(b.dataset.v);
    view.querySelectorAll("[data-v]").forEach((x) => x.classList.toggle("on", x === b));
    impacto();
  }));
  impacto();
  $("#btn-pix").addEventListener("click", () => copiar(INSTITUTO.cnpj.replace(/\D/g, ""), "Chave PIX copiada!"));
  view.querySelectorAll("[data-info]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    if (el.dataset.info === "fia") sheet(`<h3>FIA · Infância e adolescência</h3><p class="muted">A destinação de parte do Imposto de Renda aos Fundos dos Direitos da Criança e do Adolescente fortalece iniciativas como as do Instituto, conforme as regras aplicáveis. Siga as orientações do CMDCA de Afonso Cláudio.</p><button class="btn block mt-16" data-close>Entendi</button>`);
    else sheet(`<h3>Nota Premiada Capixaba</h3><p class="muted">Cadastre-se no programa e escolha <b style="color:var(--text)">Instituto Tres Pontoes de Acao Social e Cultural - Instituto Cultural das Montanhas</b> como entidade apoiada. Depois, é só pedir CPF na nota.</p><button class="btn block mt-16" data-close>Entendi</button>`);
  }));
}

function telaOuvidoria() {
  view.innerHTML = `
    <div class="auth" style="justify-content:flex-start;padding-top:4px">
      <h2>Fale com o Instituto</h2>
      <p class="sub">Elogios, sugestões, dúvidas ou reclamações. Todas as mensagens são lidas pela coordenação.</p>
      <form id="f-ouv" novalidate>
        <div class="field"><label>Tipo de mensagem</label><div class="pills" data-pills="tipo">${["Elogio", "Sugestão", "Dúvida", "Reclamação"].map((t, i) => `<button type="button" class="${i === 0 ? "on" : ""}">${t}</button>`).join("")}</div></div>
        <div class="field"><label>Quer se identificar?</label><div class="seg" data-ident><button type="button" class="on" data-id="sim">Sim</button><button type="button" data-id="nao">Anônimo</button></div></div>
        <div id="ident-campos">
          <div class="field"><label for="o-nome">Nome</label><input id="o-nome" placeholder="Seu nome"></div>
          <div class="field"><label for="o-cont">E-mail ou telefone</label><input id="o-cont" placeholder="Para retorno"></div>
        </div>
        <div class="field"><label for="o-msg">Mensagem</label><textarea id="o-msg" placeholder="Escreva aqui…"></textarea></div>
        <button class="btn gold block" type="submit">Enviar mensagem ${icon("arrow")}</button>
      </form>
      <section class="section">
        <div class="section-head"><h2>Outros canais</h2></div>
        <div class="list">
          <a href="${waLink("Olá, tudo bem? Gostaria de saber mais sobre o Instituto Cultural das Montanhas")}" target="_blank" rel="noopener"><span class="li-ico">${icon("whatsapp")}</span><div class="li-txt"><strong>WhatsApp</strong><span>${INSTITUTO.telefone}</span></div>${icon("chev", 'class="chev"')}</a>
          <a href="mailto:${INSTITUTO.ouvidoria}"><span class="li-ico">${icon("mail")}</span><div class="li-txt"><strong>E-mail da ouvidoria</strong><span>${INSTITUTO.ouvidoria}</span></div>${icon("chev", 'class="chev"')}</a>
          <a href="${INSTITUTO.instagram}" target="_blank" rel="noopener"><span class="li-ico">${icon("instagram")}</span><div class="li-txt"><strong>Instagram</strong><span>@institutodasmontanhas</span></div>${icon("chev", 'class="chev"')}</a>
          <div class="li"><span class="li-ico">${icon("pin")}</span><div class="li-txt"><strong>Endereço</strong><span>${INSTITUTO.endereco}</span></div></div>
        </div>
      </section>
      ${protoNote("Protótipo: a mensagem não é enviada. Na versão final, usa a mesma ouvidoria do site.")}
    </div>`;
  ligarPills();
  view.querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => {
    view.querySelectorAll("[data-id]").forEach((x) => x.classList.toggle("on", x === b));
    $("#ident-campos").hidden = b.dataset.id === "nao";
  }));
  $("#f-ouv").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!$("#o-msg").value.trim()) return toast("Escreva sua mensagem.");
    sucesso("Mensagem recebida!", "Obrigado por falar com a gente. A coordenação vai ler e, se você se identificou, responder em breve.");
  });
}

function telaSobre() {
  view.innerHTML = `
    <section class="hero" style="min-height:230px">
      <img src="${img("coral-1.jpg")}" alt="">
      <span class="eyebrow">Desde 2021</span>
      <h2>Cultura, esporte e educação <em>para quem mais precisa.</em></h2>
    </section>
    <section class="section"><div class="list">
      <div class="li"><span class="li-ico">${icon("star")}</span><div class="li-txt"><strong>Missão</strong><span>${esc(INSTITUTO.missao)}</span></div></div>
      <div class="li"><span class="li-ico">${icon("signal")}</span><div class="li-txt"><strong>Visão</strong><span>${esc(INSTITUTO.visao)}</span></div></div>
      <div class="li"><span class="li-ico">${icon("heart")}</span><div class="li-txt"><strong>Valores</strong><span>${esc(INSTITUTO.valores)}</span></div></div>
    </div></section>
    <section class="section">
      <div class="section-head"><h2>Nossa trajetória</h2></div>
      <ul class="timeline">${LINHA_DO_TEMPO.map((t) => `<li><strong>${t.ano}</strong>${t.marcos.map((m) => `<p>${esc(m)}</p>`).join("")}</li>`).join("")}</ul>
    </section>
    <section class="section">
      <div class="section-head"><h2>Transparência</h2></div>
      <div class="list">
        <a href="${SITE}/transparencia.html" target="_blank" rel="noopener"><span class="li-ico">${icon("doc")}</span><div class="li-txt"><strong>Documentos e termos de fomento</strong><span>Estatuto, atas, certificados e prestação de contas</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="${SITE}/perfil-dos-atendidos.html" target="_blank" rel="noopener"><span class="li-ico">${icon("people")}</span><div class="li-txt"><strong>Perfil dos atendidos</strong><span>494 alunos · 100% escola pública</span></div>${icon("chev", 'class="chev"')}</a>
        <a href="${SITE}/assets/docs/relatorio-anual-2025.pdf" target="_blank" rel="noopener"><span class="li-ico">${icon("news")}</span><div class="li-txt"><strong>Relatório anual 2025</strong><span>Conquistas e números do ano</span></div>${icon("chev", 'class="chev"')}</a>
      </div>
    </section>
    <p class="footer-note"><b>${INSTITUTO.razao}</b><br>CNPJ ${INSTITUTO.cnpj}<br>${INSTITUTO.endereco}</p>`;
}

function sucesso(titulo, texto, href = "#/inicio", rotulo = "Voltar ao início", ico = "check") {
  view.innerHTML = `<div class="auth"><div class="success"><div class="ok">${icon(ico)}</div><h2>${titulo}</h2><p class="muted">${texto}</p>
    <a class="btn block mt-16" style="margin-top:24px" href="${href}">${rotulo}</a></div></div>`;
}
function naoEncontrado() { sucesso("Página não encontrada", "O endereço não existe neste protótipo.", "#/inicio", "Voltar ao início", "info"); }

function ligarPills() {
  view.querySelectorAll("[data-pills]").forEach((g) => g.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
    g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
  })));
}

// QR decorativo, determinístico a partir de um texto (não é um QR real).
function qrFake(seed) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = 21; let rects = "";
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#1b1d21"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#eceef1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1b1d21"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
    h = (h * 1103515245 + 12345) >>> 0;
    if ((h >>> 16) & 1) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><g fill="#1b1d21">${rects}</g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}

/* ---------- Avisos (sino) ---------- */
$("#btn-avisos").addEventListener("click", () => {
  $("#btn-avisos .dot")?.remove();
  sheet(`<h3>Avisos</h3><div class="list">
    <div class="li"><span class="li-ico">${icon("star")}</span><div class="li-txt"><strong>Hidroginástica 60+</strong><span>Inscrições abertas para aulas gratuitas.</span></div></div>
    <div class="li"><span class="li-ico">${icon("calendar")}</span><div class="li-txt"><strong>Cantata de Natal</strong><span>Reserve a data: 19 de dezembro, 19h.</span></div></div>
    <div class="li"><span class="li-ico">${icon("bus")}</span><div class="li-txt"><strong>Van</strong><span>Novo horário de saída a partir de segunda.</span></div></div>
  </div><button class="btn block mt-16" style="margin-top:20px" data-close>Fechar</button>`);
});

view.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lembrar]");
  if (b) { b.style.color = "var(--gold)"; toast("Lembrete criado: " + b.dataset.lembrar); }
});

/* ---------- Roteador ---------- */
const ABAS = ["inicio", "projetos", "agenda", "noticias", "eu"];
const TITULOS = { projeto: "", inscricao: "Inscrição", noticia: "Notícia", doar: "Doar", ouvidoria: "Ouvidoria", sobre: "O Instituto", checkin: "Check-in" };

function setTitulo(t) { $("#topbar-title").textContent = t; }

function render() {
  const hash = location.hash.replace(/^#\/?/, "") || "inicio";
  const [caminho, query = ""] = hash.split("?");
  const [rota, param] = caminho.split("/");
  const params = new URLSearchParams(query);
  const ehAba = ABAS.includes(rota);

  $("#btn-voltar").hidden = ehAba;
  $("#brand").hidden = !ehAba;
  $("#topbar-title").hidden = ehAba;
  setTitulo(TITULOS[rota] ?? "");
  const abaAtiva = ehAba ? rota : rota === "projeto" || rota === "inscricao" ? "projetos" : rota === "noticia" ? "noticias" : rota === "checkin" ? "eu" : "";
  document.querySelectorAll("#tabbar a").forEach((a) => a.classList.toggle("active", a.dataset.tab === abaAtiva));

  const telas = {
    inicio: telaInicio, projetos: () => telaProjetos(params), projeto: () => telaProjeto(param),
    inscricao: () => telaInscricao(param), agenda: telaAgenda, noticias: telaNoticias,
    noticia: () => telaNoticia(decodeURIComponent(param || "")), eu: telaEu, checkin: telaCheckin,
    doar: telaDoar, ouvidoria: telaOuvidoria, sobre: telaSobre,
  };
  (telas[rota] || naoEncontrado)();
  view.scrollTop = 0;
  view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter");
}

$("#btn-voltar").addEventListener("click", () => { if (history.length > 1) history.back(); else location.hash = "#/inicio"; });
window.addEventListener("hashchange", render);
render();

// Tela de abertura
setTimeout(() => $("#splash")?.classList.add("hide"), 1300);

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
