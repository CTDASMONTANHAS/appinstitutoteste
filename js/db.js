/*
 * Acesso a dados. Com APP_CONFIG preenchido usa o Supabase (Auth + Postgres com RLS
 * + Realtime); sem ele, roda em modo demonstração com dados fictícios.
 * No modo demo nada é gravado de forma permanente: o estado fica no sessionStorage
 * e some ao fechar o app — dados pessoais não ficam guardados no aparelho.
 */
const DB = (() => {
  const temSupabase = Boolean(APP_CONFIG.usarSupabase && APP_CONFIG.supabaseUrl && APP_CONFIG.supabaseAnonKey && window.supabase);
  const sb = temSupabase
    ? window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: "pkce" },
      })
    : null;

  const sess = {
    get(k, def) { try { const v = sessionStorage.getItem("icm_" + k); return v === null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { v === null ? sessionStorage.removeItem("icm_" + k) : sessionStorage.setItem("icm_" + k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
  };

  const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
  const limpar = (v, max = 120) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max);

  // Usuário curto (ex.: "admin") vira um e-mail interno; no Supabase o usuário é criado
  // com esse e-mail. Nenhum e-mail é enviado para ele.
  const DOMINIO_LOGIN = "app.institutoculturaldasmontanhas.org";
  const paraEmail = (u) => (u.includes("@") ? u : `${u}@${DOMINIO_LOGIN}`).toLowerCase();

  // Freio no aparelho contra tentativas seguidas; o limite de verdade é do Supabase Auth.
  let falhas = 0, bloqueadoAte = 0;

  const ALUNO_PADRAO = {
    id: "demo-aluno-1", nome: "Aluno(a) Exemplo", matricula: "ICM-2026-0147",
    usaVan: true, pontoVan: "Colina do Cruzeiro",
    turmas: ["ojt-violino-b", "ojt-ensaio"], status: "ativa",
  };

  return {
    modo: temSupabase ? "supabase" : "demo",

    validarEmail: (e) => EMAIL_RE.test(String(e).trim()),

    // Login com usuário (ou e-mail) e senha.
    async entrar(usuario, senha) {
      usuario = limpar(usuario, 254).replace(/\s+/g, "");
      if (!usuario || !senha) throw new Error("Preencha usuário e senha.");
      if (Date.now() < bloqueadoAte) {
        throw new Error(`Muitas tentativas. Aguarde ${Math.ceil((bloqueadoAte - Date.now()) / 1000)} s.`);
      }
      const email = paraEmail(usuario);
      if (!EMAIL_RE.test(email)) throw new Error("Usuário inválido.");
      if (sb) {
        const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
        if (error) {
          falhas++;
          if (falhas >= 5) { bloqueadoAte = Date.now() + 60000 * Math.min(falhas - 4, 10); }
          throw new Error(error.status === 429 ? "Muitas tentativas. Tente mais tarde." : "Usuário ou senha incorretos.");
        }
        falhas = 0;
        return data.user;
      }
      const u = { email, nome: usuario };
      sess.set("usuario", u);
      sess.set("saiu", null);
      if (!sess.get("alunos", null)) sess.set("alunos", [ALUNO_PADRAO]);
      return u;
    },

    /* ----- Rotas da van (transporte/coordenação) ----- */
    async rotas() {
      if (!sb) return sess.get("rotas", [{ id: "norte", nome: ROTA_VAN.nome, em_andamento: false, iniciada_em: null }]);
      const { data, error } = await sb.from("rotas").select("id, nome, em_andamento, iniciada_em").eq("ativa", true).order("nome");
      if (error) throw new Error("Não foi possível carregar as rotas.");
      return data;
    },
    async iniciarRota(id) {
      if (!sb) {
        sess.set("rotas", (await this.rotas()).map((r) => ({ ...r, em_andamento: r.id === id, iniciada_em: r.id === id ? new Date().toISOString() : null })));
        return;
      }
      const { error } = await sb.rpc("iniciar_rota", { p_rota: id });
      if (error) throw new Error(error.message.includes("permiss") ? "Seu usuário não pode iniciar rotas." : "Não foi possível iniciar a rota.");
    },
    async encerrarRota(id) {
      if (!sb) {
        sess.set("rotas", (await this.rotas()).map((r) => ({ ...r, em_andamento: false, iniciada_em: null })));
        return;
      }
      const { error } = await sb.rpc("encerrar_rota", { p_rota: id });
      if (error) throw new Error("Não foi possível encerrar a rota.");
    },
    // Última posição recebida (para o transporte conferir se o GPS está chegando).
    async ultimaPosicao() {
      if (!sb) return null;
      const { data } = await sb.from("van_posicao_atual").select("rota_id, atualizado_em").order("atualizado_em", { ascending: false }).limit(1).maybeSingle();
      return data;
    },

    // Papel do usuário logado (responsavel, professor, transporte, coordenacao).
    async meuPapel() {
      if (!sb) return "responsavel";
      const { data: u } = await sb.auth.getUser();
      if (!u.user) return null;
      // Filtra pelo próprio id: a coordenação enxerga todos os perfis.
      const { data } = await sb.from("perfis").select("papel").eq("id", u.user.id).maybeSingle();
      return data?.papel || "responsavel";
    },

    async usuario() {
      if (sb) { const { data } = await sb.auth.getUser(); return data.user || null; }
      // Demonstração: entra direto com a família de exemplo (a não ser que tenha saído).
      // Com o Supabase ligado isso não acontece: Aulas e Van exigem login.
      if (!sess.get("usuario", null) && !sess.get("saiu", false)) {
        sess.set("usuario", { email: "familia.exemplo@demo", nome: "Família Exemplo" });
        sess.set("alunos", [ALUNO_PADRAO]);
      }
      return sess.get("usuario", null);
    },

    async sair() {
      if (sb) await sb.auth.signOut();
      sess.set("usuario", null);
      sess.set("alunos", null);
      sess.set("saiu", true);
    },

    // Alunos sob responsabilidade do usuário logado (RLS filtra no servidor).
    async meusAlunos() {
      if (sb) {
        const { data, error } = await sb.from("alunos")
          .select("id, nome, usa_van, ponto_van, matriculas(numero, status, turma_id)")
          .order("nome");
        if (error) throw new Error("Falha ao carregar seus alunos.");
        return data.map((a) => ({
          id: a.id, nome: a.nome, usaVan: a.usa_van, pontoVan: a.ponto_van,
          matricula: a.matriculas.find((m) => m.status === "ativa")?.numero || "Em análise",
          status: a.matriculas.some((m) => m.status === "ativa") ? "ativa" : "pendente",
          turmas: a.matriculas.filter((m) => m.status !== "cancelada").map((m) => m.turma_id),
        }));
      }
      return sess.get("alunos", []);
    },

    // A matrícula entra sempre como "pendente"; só a coordenação ativa (regra no banco).
    async solicitarMatricula(d) {
      const dados = {
        aluno_nome: limpar(d.alunoNome), aluno_nascimento: limpar(d.nascimento, 10),
        escola: limpar(d.escola), serie: limpar(d.serie, 40), cad_unico: Boolean(d.cadUnico),
        responsavel_nome: limpar(d.respNome), responsavel_telefone: limpar(d.respTel, 20),
        parentesco: limpar(d.parentesco, 30), turma_id: limpar(d.turmaId, 40),
        usa_van: Boolean(d.usaVan), ponto_van: d.usaVan ? limpar(d.pontoVan, 60) : null,
        autoriza_imagem: Boolean(d.autorizaImagem), aceite_lgpd: Boolean(d.aceiteLgpd),
      };
      if (!dados.aceite_lgpd) throw new Error("É preciso aceitar o termo de uso de dados.");
      if (sb) {
        const { data, error } = await sb.rpc("solicitar_matricula", { dados });
        if (error) throw new Error(error.message.includes("limite") ? "Limite de solicitações atingido. Fale com a secretaria." : "Não foi possível enviar a matrícula.");
        return data; // protocolo
      }
      const protocolo = "MAT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const alunos = sess.get("alunos", []);
      alunos.push({ id: "demo-" + protocolo, nome: dados.aluno_nome, matricula: "Em análise", usaVan: dados.usa_van, pontoVan: dados.ponto_van, turmas: [dados.turma_id], status: "pendente", protocolo });
      sess.set("alunos", alunos);
      return protocolo;
    },

    /*
     * Posição da van em tempo real. No Supabase: lê a última posição e assina o
     * canal Realtime (RLS só entrega a famílias com aluno ativo que usa a van).
     * No demo: simula a van andando pelo trajeto real.
     */
    assinarVan(callback) {
      if (sb) {
        let ativo = true;
        const entregar = (p) => {
          if (!ativo) return;
          // Sem linha, rota encerrada ou 3 min sem sinal = fora de rota.
          const vale = p && p.em_rota && Date.now() - new Date(p.atualizado_em) < 180000;
          callback(vale ? p : { em_rota: false });
        };
        // Consulta a cada 10 s (cobre o "Encerrar rota", que apaga a posição) +
        // Realtime para mover a van assim que chega posição nova.
        const consultar = () => sb.from("van_posicao_atual").select("rota_id, lat, lng, atualizado_em, em_rota")
          .order("atualizado_em", { ascending: false }).limit(1).maybeSingle()
          .then(({ data }) => entregar(data));
        consultar();
        const timer = setInterval(consultar, 10000);
        const canal = sb.channel("van")
          .on("postgres_changes", { event: "*", schema: "public", table: "van_posicao_atual" },
            (p) => (p.eventType === "DELETE" ? entregar(null) : entregar(p.new)))
          .subscribe();
        return () => { ativo = false; clearInterval(timer); sb.removeChannel(canal); };
      }
      const pts = ROTA_VAN.pontos;
      const ciclo = ROTA_VAN.duracaoSeg * 1000 * 0.25; // demo acelerado: volta completa em ~6 min
      const tick = () => {
        const f = (Date.now() % ciclo) / ciclo;
        const pos = f * (pts.length - 1);
        const i = Math.floor(pos), t = pos - i;
        const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
        callback({ lat: a[0] + (b[0] - a[0]) * t, lng: a[1] + (b[1] - a[1]) * t, indice: pos, atualizado_em: new Date().toISOString(), em_rota: true });
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    },
  };
})();
