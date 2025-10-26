# Aquila Microservices - Entrega do Projeto

## 👥 Alunos

- **Diogo Gibertoni**

---

## 📦 Repositórios

### GitHub (Código Fonte)
🔗 **Repositório Público:** https://github.com/DiogoGibertoni/aquila-microservices

### Docker Hub (Imagens)

#### Microserviços
- **BFF:** https://hub.docker.com/r/diogogibertoni/aquila-bff
- **Product Service:** https://hub.docker.com/r/diogogibertoni/aquila-product-service
- **Price Service:** https://hub.docker.com/r/diogogibertoni/aquila-price-service

#### Functions
- **Price Analyzer:** https://hub.docker.com/r/diogogibertoni/aquila-price-analyzer
- **Event Processor:** https://hub.docker.com/r/diogogibertoni/aquila-event-processor

#### Frontend
- **Frontend:** https://hub.docker.com/r/diogogibertoni/aquila-frontend

---

## 🏗️ Arquitetura do Projeto

### Microserviços
1. **Product Service** (Porta 3001)
   - Tecnologia: Node.js + Express
   - Banco de Dados: MongoDB Atlas
   - Responsabilidade: Gerenciamento do catálogo de produtos

2. **Price Service** (Porta 3002)
   - Tecnologia: Node.js + Express
   - Banco de Dados: Azure SQL Server
   - Responsabilidade: Histórico de preços dos produtos

### Functions (Serverless)
1. **Price Analyzer** (Porta 3003)
   - Tecnologia: Node.js + Express
   - Responsabilidade: Análise de promoções falsas

2. **Event Processor** (Porta 3004)
   - Tecnologia: Node.js + Express
   - Banco de Dados: Azure SQL Server
   - Responsabilidade: Processamento de eventos e persistência de preços

### BFF - Backend for Frontend (Porta 3000)
- Tecnologia: Node.js + Express
- Responsabilidades:
  - ✅ Agregação de dados de múltiplos serviços
  - ✅ Proxy para CRUD dos microserviços
  - ✅ Orquestração de eventos
  - ✅ Endpoint de agregação: `/api/products/:id/complete`

### MicroFrontEnd (Porta 8080)
- Tecnologia: HTML5 + CSS3 + JavaScript Vanilla
- Servidor: Nginx (Alpine)
- Funcionalidades:
  - Lista de produtos com preços
  - Cadastro de novos produtos
  - Busca por ID com histórico completo
  - Indicadores visuais de promoções (real vs falsa)

---

## 🗄️ Bancos de Dados

### MongoDB Atlas (Free Tier)
- **Microserviço:** Product Service
- **Uso:** Armazenamento de catálogo de produtos
- **Tabela:** products

### Azure SQL Server (Free 1 DTU)
- **Microserviços:** Price Service, Event Processor
- **Uso:** Histórico de preços e análise
- **Tabela:** prices

---

## 🔄 Fluxos Principais

### 1. Agregação de Dados (GET)
```
Cliente → BFF (/api/products/:id/complete)
        ↓
        → Product Service (busca produto)
        → Price Service (busca histórico de preços)
        ↓
        ← Agregação dos dados
        ← Response ao cliente
```

### 2. Criação de Preço via Evento (POST)
```
Cliente → BFF (/api/prices)
        ↓
        → Event Processor (/process-price-event)
        ↓
        → Azure SQL Server (persiste preço)
        ↓
        ← Response ao cliente
```

### 3. Análise de Promoção Falsa
```
Cliente → BFF (/api/analyze-price)
        ↓
        → Price Analyzer
        → Price Service (busca histórico)
        ↓
        ← Calcula média histórica
        ← Detecta se é promoção falsa
        ↓
        ← Response ao cliente
```

---

## 📋 Requisitos Atendidos

✅ **2 Microserviços criados**
- Product Service (Node.js + MongoDB Atlas)
- Price Service (Node.js + Azure SQL Server)

✅ **2 Functions criadas**
- Price Analyzer (análise de promoções)
- Event Processor (processamento de eventos)

✅ **BFF implementado**
- Agregação de dados
- Proxy para CRUD
- Request HTTP para functions e microserviços
- CREATE via evento

✅ **MicroFrontEnd criado**
- HTML + CSS + JavaScript puro
- Dockerizado com Nginx

✅ **Bancos de Dados**
- MongoDB Atlas Free
- Azure SQL Server Free (1 DTU)

✅ **Publicação**
- GitHub público
- Docker Hub público

---

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js (para scripts de população)

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/DiogoGibertoni/aquila-microservices.git
cd aquila-microservices
```

### Passo 2: Configurar variáveis de ambiente
Edite o arquivo `.env` na raiz do projeto com suas credenciais do MongoDB Atlas e Azure SQL Server.

### Passo 3: Subir os serviços
```bash
docker-compose up -d
```

### Passo 4: Inicializar banco de dados
```bash
cd scripts
npm install
npm run init-azure
```

### Passo 5: Popular com dados de teste
```bash
npm run populate
```

### Passo 6: Acessar o frontend
Abra o navegador em: http://localhost:8080

---

## 🌐 Endpoints Principais

### BFF (http://localhost:3000)
- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Busca produto por ID
- `GET /api/products/:id/complete` - **Agregação** (produto + histórico)
- `POST /api/products` - Cria novo produto
- `PUT /api/products/:id` - Atualiza produto
- `DELETE /api/products/:id` - Remove produto
- `POST /api/prices` - Cria preço via evento
- `GET /api/prices/product/:productId` - Histórico de preços
- `POST /api/analyze-price` - Analisa promoção falsa

### Product Service (http://localhost:3001)
- CRUD completo de produtos

### Price Service (http://localhost:3002)
- Consulta de histórico de preços

### Price Analyzer (http://localhost:3003)
- `POST /analyze-price` - Análise de promoção falsa

### Event Processor (http://localhost:3004)
- `POST /process-price-event` - Processa evento de preço

---

## 📊 Documentação Adicional

- **Swagger/OpenAPI:** `/docs/swagger.yaml`
- **Modelo de Dados:** `/diagrams/data-model.md`
- **Scripts de População:** `/scripts/`

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Bancos de Dados:** MongoDB Atlas, Azure SQL Server
- **Containerização:** Docker, Docker Compose
- **Servidor Web:** Nginx (Alpine)
- **Outras:** Axios, CORS, dotenv, Mongoose, mssql

---

## 📝 Observações

- Frontend acessível via porta 8080 (porta 80 conflitava com XAMPP)
- Todos os serviços possuem health checks
- Detecção de promoções falsas baseada em média histórica
- Interface responsiva com indicadores visuais de promoção
- Dados de teste incluem 8 produtos com 30 dias de histórico cada

---

**Data de Entrega:** 26/10/2025
**Disciplina:** Arquitetura de Software / Microserviços
