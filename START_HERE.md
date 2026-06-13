# 🚀 GUIA DE INÍCIO RÁPIDO - Sistema de Voto Eletrônico

## ⚡ PARA COMEÇAR AGORA (3 PASSOS SIMPLES)

### 1️⃣ Abra o Terminal/CMD

**Windows:**
- Pressione `Win + R`
- Digite `cmd` e pressione Enter

**Mac:**
- Pressione `Cmd + Space`
- Digite `terminal` e pressione Enter

**Linux:**
- Pressione `Ctrl + Alt + T`

---

### 2️⃣ Cole estes comandos (um por um)

```bash
cd Desktop
git clone https://github.com/kolanianmariana-rgb/Sistemadevotoeletrnico.git
cd Sistemadevotoeletrnico
npm install
npm run dev
```

---

### 3️⃣ Abra seu navegador

Acesse: **http://localhost:5173**

✅ **PRONTO! Seu site está rodando!**

---

## 🌐 PÁGINAS DISPONÍVEIS

Clique ou acesse diretamente:

| Página | URL |
|--------|-----|
| 🏠 **Home** | http://localhost:5173 |
| 🔐 **Login** | http://localhost:5173/login |
| 📝 **Inscrição** | http://localhost:5173/inscricao |
| 🗳️ **Votação** | http://localhost:5173/votar |
| 📊 **Resultados** | http://localhost:5173/resultados |
| 💬 **Assistência** | http://localhost:5173/assistencia |
| ℹ️ **Sobre** | http://localhost:5173/sobre |
| ⚙️ **Admin** | http://localhost:5173/admin |

---

## 📋 O QUE ESTÁ ACONTECENDO

1. **npm install** → Baixa todos os componentes e dependências (demora 2-3 minutos)
2. **npm run dev** → Inicia o servidor local na porta 5173
3. O terminal mostrará: `Local: http://localhost:5173`

---

## 🛑 PARA PARAR O SERVIDOR

Pressione **Ctrl + C** na janela do terminal

---

## ❌ PROBLEMAS?

### Erro: "npm não encontrado"
**Solução:** Instale Node.js em https://nodejs.org (versão LTS recomendada)

### Erro: "git não encontrado"
**Solução:** Instale Git em https://git-scm.com

### Porta 5173 já em uso?
**Use outra porta:**
```bash
npm run dev -- --port 3000
```
Depois acesse: http://localhost:3000

### Ainda com problemas?
1. Feche tudo
2. Delete a pasta do projeto
3. Comece do zero

---

## 📦 BUILD PARA PRODUÇÃO

Quando quiser gerar os arquivos finais:

```bash
npm run build
```

Isso cria a pasta `dist/` pronta para publicar online!

---

## 🎯 ESTRUTURA DO PROJETO

```
Sistemadevotoeletrnico/
├── src/
│   ├── app/
│   │   ├── pages/          # Páginas (Home, Login, etc)
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── context/        # Autenticação e Geolocalização
│   │   └── routes.tsx      # Configuração de rotas
│   ├── styles/             # CSS e temas
│   └── main.tsx            # Arquivo principal
├── package.json            # Dependências
├── vite.config.ts          # Configuração do Vite
└── index.html              # HTML raiz

```

---

**🎉 Bom trabalho! Seu site de votação está pronto para usar!**
