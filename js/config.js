/*
 * Configuração do Supabase.
 * Deixe em branco para o modo demonstração (dados fictícios, nada sai do aparelho).
 *
 * Use SOMENTE a chave pública (Project Settings → API Keys → "publishable" / "anon").
 * NUNCA coloque a chave "service_role" aqui: ela ignora todas as regras de segurança.
 * A segurança real está nas políticas RLS de supabase/schema.sql.
 */
const APP_CONFIG = {
  // false = modo demonstração (sem login). Mude para true quando o login por e-mail
  // estiver configurado no Supabase: Aulas, Van e Perfil passam a exigir login.
  usarSupabase: true,
  supabaseUrl: "https://lfobxtowakiwaxdkwuhe.supabase.co",
  supabaseAnonKey: "sb_publishable_Zx2qwelgdx9zHLomaf3TOg_ZDDTQZe8",
};
