# Scripts de População do Banco de Dados

Scripts para popular o banco de dados do Aquila com dados de teste.

## O que o script faz?

1. **Cria 8 produtos** no MongoDB (via Product Service):
   - Notebook Dell Inspiron 15
   - Smart TV Samsung 50"
   - iPhone 14 Pro 128GB
   - Geladeira Brastemp Frost Free
   - Tênis Nike Air Max
   - Cafeteira Nespresso
   - Fone JBL Tune 510BT
   - Ar Condicionado LG 12000 BTUs

2. **Cria histórico de 30 dias de preços** para cada produto no SQL Server (via Event Processor):
   - Preços normais
   - Promoções reais (últimos 5 dias)
   - Promoções falsas (dias 10-15)
   - Variações realistas de preço

## Pré-requisitos

O BFF e todos os serviços devem estar rodando:

```bash
# Na raiz do projeto
docker-compose up -d
```

Aguarde alguns segundos para os serviços iniciarem completamente.

## Como executar

```bash
cd scripts
npm install
npm run populate
```

## O que esperar

```
🚀 Iniciando população do banco de dados...

✅ BFF está online

📦 Criando produtos...

✅ Criado: Notebook Dell Inspiron 15 (ID: 507f1f77bcf86cd799439011)
✅ Criado: Smart TV Samsung 50" (ID: 507f1f77bcf86cd799439012)
...

💰 Criando histórico de preços...

Criando 31 registros de preço para: Notebook Dell Inspiron 15
  ✅ Histórico criado para: Notebook Dell Inspiron 15
...

🎉 Banco de dados populado com sucesso!

📊 Resumo:
   - 8 produtos
   - ~248 registros de preços

🌐 Teste o frontend em: http://localhost:80

📝 IDs dos produtos criados:
   Notebook Dell Inspiron 15: 507f1f77bcf86cd799439011
   Smart TV Samsung 50": 507f1f77bcf86cd799439012
   ...
```

## Testar no Frontend

Após executar o script, copie um dos IDs mostrados e cole no frontend para ver:
- Informações do produto
- Histórico completo de preços
- Indicadores de promoção real vs falsa

## Limpar dados

Para limpar e repopular:

```bash
# Parar containers
docker-compose down

# Opcional: Remover volumes (apaga dados)
docker-compose down -v

# Subir novamente
docker-compose up -d

# Aguardar inicialização e repopular
cd scripts
npm run populate
```

## Troubleshooting

### Erro: "BFF não está rodando"
```bash
docker-compose up -d
docker-compose ps
```

### Erro: "Cannot find module 'axios'"
```bash
cd scripts
npm install
```

### Erro ao criar produtos
- Verifique se o MongoDB está acessível
- Confira as credenciais no `.env`

### Erro ao criar preços
- Verifique se o SQL Server está acessível
- Confira as credenciais no `.env`
