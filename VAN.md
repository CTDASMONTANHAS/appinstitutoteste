# Van em tempo real — como ligar

```
Celular do transporte (Traccar Client) ──► função van-posicao (Supabase) ──► app das famílias
```

- O transporte **inicia a rota no app** (aba Van) e liga o Traccar → a van aparece para as famílias.
- Ao **encerrar a rota no app**, a posição é apagada e a van **some do mapa na hora**.
- Sem rota iniciada, o GPS recebido é **ignorado** (Traccar esquecido ligado não expõe nada).
- Se o sinal parar por **3 minutos** durante a rota, a van também some (fora de rota).
- O banco guarda **só a posição atual** — sem histórico de trajeto.
- Só veem a van famílias com aluno **ativo** que **usa a van**.

## 1. Banco (uma vez)
No Supabase → **SQL Editor**, rode nesta ordem:
1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/migracoes/003_transporte.sql` (papel "transporte")
4. `supabase/migracoes/002_rotas.sql` (rotas com iniciar/encerrar)
5. `supabase/migracoes/004_duas_rotas.sql` (ida **Sede (Campo 21) → Grama** e volta **Grama → Sede (Campo 21)**)

## 2. Receptor do GPS (uma vez)
Supabase → **Edge Functions** → **Deploy a new function** → **Via editor**:
- Nome: `van-posicao` (no projeto atual ela foi publicada como **`swift-api`** — tudo bem, o que vale é o endereço)
- Cole o conteúdo de `supabase/functions/van-posicao/index.ts` → **Deploy**
- Em **Details / Settings** da função: **desligue "Verify JWT"** (o Traccar não faz login; a proteção é o código do aparelho).

## 3. Código do aparelho (um por celular)
No **SQL Editor**:
```sql
select public.criar_dispositivo_van('norte', 'Celular do transporte');
```
Aparece um código de 48 caracteres. **Ele só aparece uma vez** — anote direto no celular do transporte (passo 4). No banco fica só uma versão embaralhada (hash).

Para bloquear um celular perdido: `update public.van_dispositivos set ativo = false where nome = 'Celular do transporte';`

## 4. Celular do transporte
1. Instale **Traccar Client** (Play Store / App Store, gratuito).
2. Configure:
   - **Device identifier**: o código do passo 3
   - **Server URL**: `https://lfobxtowakiwaxdkwuhe.supabase.co/functions/v1/swift-api`
   - **Frequency / Interval**: `10` segundos
   - **Distance**: `0` · **Accuracy**: `High`
3. Permita localização **"o tempo todo"** e desative a economia de bateria para o Traccar.
4. No dia a dia: **app → Van → escolher a rota → Iniciar rota → ligar o Traccar**. No fim: **Encerrar rota → desligar o Traccar**.

## 4b. Login do transporte (uma vez)
1. Supabase → **Authentication → Users → Add user**: e-mail `transporte@app.institutoculturaldasmontanhas.org`, senha com 6+ caracteres, **Auto Confirm**.
2. No **SQL Editor**:
```sql
update public.perfis set papel = 'transporte', nome = 'Transporte'
where id = (select id from auth.users where email = 'transporte@app.institutoculturaldasmontanhas.org');
```
No app, entra com o usuário **transporte**.

Rotas atuais: `sede-grama` (ida) e `grama-sede` (volta). O desenho no mapa vem de `js/rota.js`; as paradas intermediárias são provisórias até gravarmos o trajeto real.

## 5. Teste
Com o serviço ligado, abra a aba **Van** com uma conta de família que tenha aluno ativo com van. O selo deve mostrar **"Ao vivo · atualizado agora"**.
