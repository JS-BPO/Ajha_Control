# AJHA Control

App da família para receitas, cardápio, estoque e lista de mercado.
Funciona no celular como aplicativo (PWA), offline, e sincroniza entre os
aparelhos da casa pelo Firebase, com PIN de 4 dígitos.

---

## 1. Firebase

**a) Criar o projeto**
Console do Firebase › Adicionar projeto. Pode recusar o Google Analytics.

**b) Registrar o app da Web**
Na visão geral do projeto, clique no ícone `</>` e dê um apelido qualquer.
Ele mostra um bloco `firebaseConfig`. Copie os 4 valores.

**c) Colar no `index.html`**
Logo no começo do `<script>` tem este bloco. Preencha e salve:

```js
const FIREBASE = {
  apiKey:     "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId:  "seu-projeto",
  appId:      "1:000:web:abc"
};
```

Esses dados são públicos por natureza — quem protege o banco são as regras
do passo (e), não o sigilo deles.

**d) Criar o PIN**
Authentication › Sign-in method › ative **E-mail/senha**.
Depois Authentication › Users › **Add user**:

| campo | valor |
|---|---|
| E-mail | `familia@ajha.app` |
| Senha | `ajha-` + o PIN. Ex.: PIN **1234** → senha `ajha-1234` |

Esse e-mail não precisa existir de verdade — é só o identificador da conta.
Na tela de entrada a família digita **só os 4 dígitos**; o app completa o resto.

**e) Travar o banco**
Firestore Database › Criar banco de dados › modo de produção.
Depois na aba **Regras**, apague tudo e cole:

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

Publique. Sem isso, o banco fica aberto para qualquer um.

---

## 2. GitHub Pages

1. Crie um repositório (pode ser público — não há segredo aqui).
2. Suba estes arquivos na **raiz** do repositório.
3. Settings › Pages › Source: **Deploy from a branch** › branch `main`, pasta `/ (root)`.
4. Em um ou dois minutos sai o endereço: `https://SEU-USUARIO.github.io/SEU-REPO/`

**Passo que falta em 9 de 10 tutoriais:** volte ao Firebase em
Authentication › Settings › **Domínios autorizados** e adicione
`SEU-USUARIO.github.io`. Sem isso o PIN nunca passa.

---

## 3. Instalar no celular

Abra o endereço do GitHub Pages no celular.

- **Android / Chrome** — aparece "Instalar app". Se não aparecer: menu ⋮ › Adicionar à tela inicial.
- **iPhone / Safari** — botão Compartilhar › Adicionar à Tela de Início.
  Precisa ser o Safari; no Chrome do iPhone não instala.

Depois de instalado abre em tela cheia e funciona sem internet.
Só a sincronização precisa de rede.

---

## Ao publicar uma alteração

Abra `sw.js` e troque a versão:

```js
const VERSAO = "ajha-v1";   // vire v2, v3, v4...
```

Sem isso os celulares continuam mostrando a versão antiga guardada em cache.

---

## Arquivos

| arquivo | o que é |
|---|---|
| `index.html` | o app inteiro — é aqui que fica o bloco `FIREBASE` |
| `manifest.json` | nome, cores e ícones do app instalado |
| `sw.js` | funcionamento offline (service worker) |
| `icons/` | ícones. `icon-512-maskable.png` é o que o Android recorta em círculo |
| `.nojekyll` | impede o GitHub Pages de processar os arquivos |

## Observações

- **Trocar o PIN depois:** dentro do app, ⚙ Ajustes › Trocar o PIN.
- **Sem internet:** o app abre e funciona; as mudanças sobem quando a rede voltar.
- **Imprimir no iPhone:** app instalado no iOS não abre a caixa de impressão.
  Use o botão **Enviar** (manda a lista pelo WhatsApp) ou abra o mesmo
  endereço no Safari normal para imprimir.
