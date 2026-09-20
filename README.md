# AJHA Control

App da família para receitas, cardápio, estoque e lista de mercado.
Instalado no celular como aplicativo (PWA), funciona offline e sincroniza
entre os aparelhos da casa pelo Firebase, com PIN de 4 dígitos.

No ar em: https://js-bpo.github.io/Ajha_Control/

---

## Como está montado

| arquivo | o que é |
|---|---|
| `index.html` | o app inteiro — é aqui que fica o bloco `FIREBASE` |
| `manifest.json` | nome, cores e ícones do app instalado |
| `sw.js` | funcionamento offline (service worker) |
| `icons/` | ícones. O `-maskable-b` é o que o Android recorta em círculo |
| `.nojekyll` | impede o GitHub Pages de processar os arquivos |

O app não tem servidor próprio: o GitHub Pages entrega os arquivos e o
Firebase guarda os dados. Não há nada para manter rodando.

---

## Firebase

**Conta da família.** Não existe cadastro nem login por e-mail. O app usa uma
conta única, criada à mão no console:

- E-mail: `familia@ajha.app` (não é um e-mail de verdade, só o nome da conta)
- Senha: `ajha-` + o PIN de 4 dígitos

Na tela de entrada a família digita só os 4 dígitos; o app completa o `ajha-`
sozinho. O Firebase exige senha de 6 caracteres ou mais — é por isso que o
prefixo existe.

**Trocar o PIN:** dentro do app, ⚙ Ajustes › Trocar o PIN. Todos os celulares
precisam entrar de novo depois.

**Regras do Firestore** (Firestore Database › Regras). É isto que impede
qualquer pessoa de ler ou gravar no banco:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /familias/{id} {
      allow read, write: if request.auth != null
                         && request.auth.token.email == "familia@ajha.app";
    }
  }
}
```

Se mudar o e-mail da conta, ele precisa ser trocado em três lugares: aqui,
no usuário do Authentication e na constante `CONTA_FAMILIA` do `index.html`.

**Domínio autorizado.** `js-bpo.github.io` precisa estar em
Authentication › Settings › Domínios autorizados. Sem isso o PIN é recusado
e a mensagem de erro não explica o motivo.

**SDK do Firebase.** Carregado de `https://www.gstatic.com/firebasejs/10.12.2/`,
que é a fonte oficial do Google. Não use o jsDelivr: o caminho
`/npm/firebase@10.12.2/compat/` não existe e devolve 404.

---

## Publicar uma alteração

1. Edite o arquivo pelo GitHub (ícone de lápis) ou suba a versão nova.
2. **Abra `sw.js` e aumente o número da versão** (`ajha-v5` → `ajha-v6`).
3. Espere cerca de um minuto para o GitHub Pages reconstruir.

O passo 2 não é opcional. Sem trocar o número, os celulares que já instalaram
continuam abrindo a versão guardada em cache, e parece que a alteração não
funcionou.

### Se a alteração for nos ícones

Aí não basta trocar a versão do `sw.js`: **troque o nome dos arquivos**
(`icon-192-b.png` → `icon-192-c.png`) e atualize os nomes no `manifest.json`
e na lista `CASCA` do `sw.js`.

Três caches guardam esses arquivos ao mesmo tempo — o do GitHub, o do Chrome
e o do Android — e nenhum deles é limpo por reinstalar o app. Endereço novo é
a única forma garantida.

Depois, para ver o ícone novo na tela inicial, é preciso **desinstalar e
instalar de novo**: o Android grava o ícone no momento da instalação.

### Conferir o que está no ar

O navegador pode te mostrar uma versão antiga sem avisar. Para ver o que
realmente está no servidor, acrescente qualquer coisa no fim do endereço:

```
https://js-bpo.github.io/Ajha_Control/manifest.json?x=1
```

Endereço diferente, nenhum cache no meio.

---

## Instalar no celular

- **Android / Chrome** — aparece "Instalar app". Se não aparecer: menu ⋮ ›
  Adicionar à tela inicial.
- **iPhone / Safari** — Compartilhar › Adicionar à Tela de Início. Precisa ser
  o Safari; no Chrome do iPhone não instala.

---

## Detalhes do dia a dia

- **Sem internet:** o app abre e funciona normalmente. As alterações sobem
  quando a rede voltar.
- **Imprimir no iPhone:** app instalado no iOS não abre a caixa de impressão.
  Use o botão **Enviar**, que manda a lista pelo WhatsApp já agrupada por
  corredor do mercado — ou abra o mesmo endereço no Safari comum para imprimir.
- **Catálogo de ingredientes:** receita e estoque se ligam pelo código do
  ingrediente, não pelo texto digitado. Por isso "arroz" e "Arroz branco" são
  a mesma coisa para o app, e a lista de compras bate com o estoque. Ao
  cadastrar um ingrediente parecido com um que já existe, o app oferece ligar
  os dois como apelido — vale aceitar.
- **Botão "Cozinhei":** baixa do estoque o que a refeição consumiu, e tira
  essa refeição da lista da semana.
- **Meta do estoque:** é quanto você quer manter em casa. É dela que sai o
  rancho do mês.
