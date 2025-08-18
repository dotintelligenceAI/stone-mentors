# Deploy na Azure - Stone Mentors

## Configuração das Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Azure App Service:

### No Azure Portal:
1. Acesse o Azure Portal
2. Vá para seu App Service `stone-mentors`
3. Navegue até **Configuration** > **Application settings**
4. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://byuumsdspsffxaprgfsh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dXVtc2RzcHNmZnhhcHJnZnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDQ5MTcsImV4cCI6MjA2NTMyMDkxN30.tICPFIioN5AH-vzdGSQzbWIAFQnEEtFbW1Oasg_HzTY
VITE_EVOLUTION_API_URL=https://evolution.amcbots.com.br/message/sendText/stone
VITE_EVOLUTION_API_KEY=8082C8745C8C-4E48-A883-8ED396DA3C09
VITE_APP_TITLE=Stone Mentors
VITE_APP_VERSION=1.0.0
```

## Estrutura do Projeto

- `server.js`: Servidor Express para produção
- `package.json`: Scripts e dependências (sem `type: "module"`)
- `startup.sh`: Script de inicialização para Linux
- `.azure/config.yml`: Configuração específica da Azure

## Comando de Start

O comando `npm start` executa `node server.js` que:
- Serve os arquivos estáticos da pasta `dist`
- Configura rotas para SPA (Single Page Application)
- Escuta na porta definida pela variável `PORT` ou 8080
- Inclui rota de health check em `/health`

## Troubleshooting

### Se o deploy falhar:
1. Verifique se a pasta `dist` foi criada durante o build
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique os logs no Azure Portal
4. Teste a rota `/health` para verificar se o servidor está rodando

### Logs importantes:
- `Iniciando servidor...`
- `Servidor rodando na porta 8080`
- `Caminho da pasta dist: /home/site/wwwroot/dist`
