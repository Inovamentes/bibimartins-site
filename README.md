# Bibi Martins - Site Oficial

Site profissional da Bibi Martins, palestrante e mentora corporativa especializada em Liderança Neurodiversa.

## 🌐 Site ao Vivo

[https://bibimartins.com](https://bibimartins.com) *(substituir pelo seu domínio)*

## 🚀 Tecnologias

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **shadcn/ui** (componentes)
- **Lucide React** (ícones)

## 📁 Estrutura do Projeto

```
├── public/
│   └── images/          # Imagens do site
├── src/
│   ├── components/      # Componentes React
│   ├── sections/        # Seções da página
│   ├── App.tsx          # Componente principal
│   └── index.css        # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📦 Deploy na Netlify

### Opção 1: Deploy via GitHub (Recomendado)

1. **Crie um repositório no GitHub**
   - Acesse [github.com](https://github.com)
   - Clique em "New repository"
   - Nome: `bibimartins-site`
   - Deixe público ou privado

2. **Envie o código para o GitHub**
   ```bash
   # No terminal, na pasta do projeto
   git init
   git add .
   git commit -m "Primeiro commit - Site Bibi Martins"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/bibimartins-site.git
   git push -u origin main
   ```

3. **Conecte na Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Faça login (pode usar conta do GitHub)
   - Clique em "Add new site" → "Import an existing project"
   - Selecione o repositório do GitHub
   - Configurações de build:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Clique em "Deploy site"

### Opção 2: Deploy Manual (Drag & Drop)

1. Execute `npm run build` localmente
2. Acesse [netlify.com](https://netlify.com)
3. Arraste a pasta `dist` para a área indicada
4. Pronto! Seu site está no ar!

## 🌐 Configurar Domínio Personalizado (UOL)

### Na Netlify:

1. Vá em **Site settings** → **Domain management**
2. Clique em **Add custom domain**
3. Digite: `bibimartins.com`
4. Clique em **Verify**

### No UOL (Painel de DNS):

1. Acesse o painel do UOL onde está seu domínio
2. Encontre a seção **DNS** ou **Zona DNS**
3. Adicione um registro **A**:
   - Nome: `@` (ou deixe em branco)
   - Valor: `75.2.60.5` *(IP da Netlify - verifique o correto no painel)*
4. Adicione um registro **CNAME**:
   - Nome: `www`
   - Valor: `seu-site-na-netlify.netlify.app`

5. Aguarde a propagação (pode levar até 48h)

### Configurar HTTPS (SSL):

Na Netlify, vá em **Domain management** → **HTTPS**
- O certificado SSL será provisionado automaticamente
- Clique em "Verify DNS configuration" se necessário

## 📝 Conteúdo para Atualizar

### Depoimentos Reais
Substitua os depoimentos fictícios na seção `depoimentos` do arquivo `src/App.tsx` pelos seus depoimentos reais.

### Estatísticas
Atualize as estatísticas na seção Hero conforme você for crescendo:
```tsx
{ value: 'X', label: 'Palestras Realizadas' },
{ value: 'Y', label: 'Empresas Atendidas' },
{ value: 'Z', label: 'Pessoas Impactadas' },
```

### Imagens
Substitua as imagens na pasta `public/images/` pelas suas fotos profissionais.

## 🎨 Personalização

### Cores
As cores principais estão definidas em `tailwind.config.js`:
- **Roxo**: `#9333ea` (primary)
- **Laranja**: `#f97316` (secondary)
- **Teal**: `#14b8a6` (accent)

### Fontes
- **Títulos**: Montserrat
- **Texto**: Open Sans

## 📞 Contato do Site

- **WhatsApp**: +55 11 93214-3117
- **E-mail**: falacomigo@bibimartins.com
- **Instagram**: @bibimartinsoficial

## 📄 Licença

© 2025 Bibi Martins. Todos os direitos reservados.
