/*
 * Configuração do Supabase.
 * Deixe em branco para o modo demonstração (dados fictícios, nada sai do aparelho).
 *
 * Use SOMENTE a chave pública "anon" (Project Settings → API → anon public).
 * NUNCA coloque a chave "service_role" aqui: ela ignora todas as regras de segurança.
 * A segurança real está nas políticas RLS de supabase/schema.sql.
 */
const APP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
};
