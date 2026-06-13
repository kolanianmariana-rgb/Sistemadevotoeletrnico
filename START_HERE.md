# 🚀 GUIA DE INÍCIO RÁPIDO - Sistema de Voto Eletrônico

## ⚡ PARA COMEÇAR AGORA

### Opção 1: Windows (Mais Fácil)

1. **Abra PowerShell** (Ctrl+R → `powershell` → Enter)
2. **Cole estes comandos um por um:**

```powershell
cd C:\Users\[SeuUsuário]\Desktop
git clone https://github.com/kolanianmariana-rgb/Sistemadevotoeletrnico.git
cd Sistemadevotoeletrnico
npm install
npm run dev
```

3. **Pronto!** Abra o navegador e vá para: `http://localhost:5173`

---

### Opção 2: Mac

1. **Abra Terminal** (Cmd+Space → `terminal` → Enter)
2. **Cole estes comandos:**

```bash
cd ~/Desktop
git clone https://github.com/kolanianmariana-rgb/Sistemadevotoeletrnico.git
cd Sistemadevotoeletrnico
npm install
npm run dev
```

3. **Pronto!** Abra o navegador e vá para: `http://localhost:5173`

---

### Opção 3: Linux

1. **Abra Terminal**
2. **Cole estes comandos:**

```bash
cd ~/Desktop
git clone https://github.com/kolanianmariana-rgb/Sistemadevotoeletrnico.git
cd Sistemadevotoeletrnico
npm install
npm run dev
```

3. **Pronto!** Abra o navegador e vá para: `http://localhost:5173`

---

## 📋 O QUE ACONTECE

- **npm install** → Baixa todos os componentes e dependências
- **npm run dev** → Inicia o servidor local
- O servidor fica rodando enquanto deixar a janela aberta

---

## 🌐 PÁGINAS DISPONÍVEIS

| URL | Página |
|-----|--------|
| `http://localhost:5173` | 🏠 Home |
| `http://localhost:5173/login` | 🔐 Login |
| `http://localhost:5173/inscricao` | 📝 Inscrição |
| `http://localhost:5173/votar` | 🗳️ Votação |
| `http://localhost:5173/resultados` | 📊 Resultados |
| `http://localhost:5173/assistencia` | 💬 Assistência |
| `http://localhost:5173/sobre` | ℹ️ Sobre |
| `http://localhost:5173/admin` | ⚙️ Admin |

---

## ❌ ERRO? TENTE ISTO

### Erro: "npm não encontrado"
- Instale Node.js: https://nodejs.org (versão LTS)

### Erro: "git não encontrado"
- Instale Git: https://git-scm.com

### Porta 5173 já em uso?
- Mude para outra porta:
```bash
npm run dev -- --port 3000
```

---

## 🛑 PARA PARAR O SERVIDOR
Pressione **Ctrl+C** na janela do terminal

---

## 🏗️ BUILD PARA PRODUÇÃO

```bash
npm run build
```

Isso cria a pasta `dist/` pronta para deployar

---

**Pronto? Comece agora! 🎉**
