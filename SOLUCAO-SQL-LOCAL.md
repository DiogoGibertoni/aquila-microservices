# Solução: SQL Server Local para Desenvolvimento

## Problema

O Azure SQL Server está bloqueando conexões externas:
```
Connection was denied because Deny Public Network Access is set to Yes
```

## Solução Rápida: SQL Server Local

Use o arquivo `docker-compose.local.yml` que inclui um SQL Server containerizado.

### Passo 1: Parar containers atuais

```bash
docker-compose down
```

### Passo 2: Subir com SQL Server local

```bash
docker-compose -f docker-compose.local.yml up -d
```

### Passo 3: Inicializar banco de dados

Aguarde ~30 segundos para o SQL Server iniciar, depois execute:

```bash
docker exec -it aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P StrongPassword123! -i /init-sqlserver.sql
```

Ou copie o script manualmente:

```bash
# Copiar script para o container
docker cp init-sqlserver.sql aquila-sqlserver-local:/init-sqlserver.sql

# Executar script
docker exec aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "StrongPassword123!" -i /init-sqlserver.sql
```

### Passo 4: Popular banco novamente

```bash
cd scripts
npm run populate
```

Agora os preços devem ser criados sem erros!

## Credenciais do SQL Server Local

- **Host**: localhost (ou `sqlserver` dentro do Docker)
- **Porta**: 1433
- **Usuário**: sa
- **Senha**: StrongPassword123!
- **Database**: aquilaDB

## Verificar se está funcionando

```bash
# Ver logs do SQL Server
docker logs aquila-sqlserver-local

# Ver logs do Event Processor
docker logs aquila-microservices-event-processor-1

# Testar conexão
docker exec -it aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P StrongPassword123! -Q "SELECT @@VERSION"
```

## Verificar dados no banco

```bash
docker exec -it aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "StrongPassword123!" -Q "USE aquilaDB; SELECT COUNT(*) AS total_prices FROM prices;"
```

## Diferenças do docker-compose.local.yml

1. **Adiciona serviço `sqlserver`**: SQL Server 2022 Express local
2. **Altera variáveis**: price-service e event-processor apontam para o SQL local
3. **Adiciona frontend**: Container Nginx na porta 80
4. **Health check**: Aguarda SQL Server estar pronto antes de iniciar serviços

## Voltar para Azure SQL Server

Se quiser voltar a usar o Azure SQL Server em produção:

1. Habilite acesso público no Azure Portal
2. Use o `docker-compose.yml` original:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Solução Permanente (Produção)

Para usar o Azure SQL Server em produção:

1. Acesse: https://portal.azure.com
2. Vá em **SQL Server** → `aquilasqlserver`
3. **Security** → **Networking**
4. **Desabilite** "Deny public network access"
5. Adicione regras de firewall para seus IPs
6. Ou configure **Private Endpoint** para segurança máxima

## Troubleshooting

### Erro: "Login failed for user 'sa'"

```bash
docker restart aquila-sqlserver-local
# Aguarde 30 segundos
```

### Erro: "Database 'aquilaDB' does not exist"

Execute o script de inicialização novamente:
```bash
docker cp init-sqlserver.sql aquila-sqlserver-local:/init-sqlserver.sql
docker exec aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "StrongPassword123!" -i /init-sqlserver.sql
```

### Verificar se tabela existe

```bash
docker exec -it aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "StrongPassword123!" -Q "USE aquilaDB; SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'prices';"
```

### Limpar dados e recomeçar

```bash
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
# Aguarde 30 segundos
docker cp init-sqlserver.sql aquila-sqlserver-local:/init-sqlserver.sql
docker exec aquila-sqlserver-local /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "StrongPassword123!" -i /init-sqlserver.sql
```

## Estrutura Final

```
localhost:3000  → BFF
localhost:3001  → Product Service (MongoDB Atlas)
localhost:3002  → Price Service (SQL Server Local)
localhost:3003  → Price Analyzer Function
localhost:3004  → Event Processor (SQL Server Local)
localhost:80    → Frontend
localhost:1433  → SQL Server (acesso direto)
```
