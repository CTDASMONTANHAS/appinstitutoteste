# Van em tempo real — como ligar

```
Celular da monitora (Traccar Client) ──► função van-posicao (Supabase) ──► app das famílias
```

- A van **aparece** no mapa enquanto o celular da monitora estiver enviando.
- Se parar de enviar por **3 minutos**, a van **some** do mapa (fora de rota).
- O banco guarda **só a posição atual** — sem histórico de trajeto.
- Só veem a van famílias com aluno **ativo** que **usa a van**.

## 1. Banco (uma vez)
No Supabase → **SQL Editor**, rode nesta ordem:
1. `supabase/schema.sql`
2. `supabase/seed.sql`

## 2. Receptor do GPS (uma vez)
Supabase → **Edge Functions** → **Deploy a new function** → **Via editor**:
- Nome: `van-posicao` (no projeto atual ela foi publicada como **`swift-api`** — tudo bem, o que vale é o endereço)
- Cole o conteúdo de `supabase/functions/van-posicao/index.ts` → **Deploy**
- Em **Details / Settings** da função: **desligue "Verify JWT"** (o Traccar não faz login; a proteção é o código do aparelho).

## 3. Código do aparelho (um por celular)
No **SQL Editor**:
```sql
select public.criar_dispositivo_van('norte', 'Celular da monitora');
```
Aparece um código de 48 caracteres. **Ele só aparece uma vez** — anote direto no celular da monitora (passo 4). No banco fica só uma versão embaralhada (hash).

Para bloquear um celular perdido: `update public.van_dispositivos set ativo = false where nome = 'Celular da monitora';`

## 4. Celular da monitora
1. Instale **Traccar Client** (Play Store / App Store, gratuito).
2. Configure:
   - **Device identifier**: o código do passo 3
   - **Server URL**: `https://lfobxtowakiwaxdkwuhe.supabase.co/functions/v1/swift-api`
   - **Frequency / Interval**: `10` segundos
   - **Distance**: `0` · **Accuracy**: `High`
3. Permita localização **"o tempo todo"** e desative a economia de bateria para o Traccar.
4. **Ligou a chave "Service status" = van no mapa. Desligou = van some.**

## 5. Teste
Com o serviço ligado, abra a aba **Van** com uma conta de família que tenha aluno ativo com van. O selo deve mostrar **"Ao vivo · atualizado agora"**.
