# 📦 Links dos Artefatos - Aquila Microservices

## 👥 Alunos
- *Diogo Gibertoni*
- *Murilo Paes Jeronymo*
- *Pedro Lelis*
- *Vinicius Carvalho*
- *Cauê Felipe Knies Debus*


---

## 🔗 Repositório Principal

*GitHub:* https://github.com/DiogoGibertoni/aquila-microservices

---

## 📁 Artefatos Específicos no GitHub

### 🏗 Microserviços

#### Product Service
- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/microservices/product-service
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/product-service/Dockerfile
- *server.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/product-service/server.js
- *package.json:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/product-service/package.json

#### Price Service
- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/microservices/price-service
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/price-service/Dockerfile
- *server.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/price-service/server.js
- *package.json:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/microservices/price-service/package.json

---

### ⚡ Functions

#### Price Analyzer Function
- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/functions/price-analyzer
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/price-analyzer/Dockerfile
- *index.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/price-analyzer/index.js
- *package.json:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/price-analyzer/package.json

#### Event Processor Function (Notification Service)
- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/functions/notification-service
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/notification-service/Dockerfile
- *index.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/notification-service/index.js
- *package.json:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/functions/notification-service/package.json

---

### 🌐 BFF (Backend for Frontend)

- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/bff
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/bff/Dockerfile
- *server.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/bff/server.js
- *package.json:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/bff/package.json
- *.env:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/bff/.env

---

### 📱 MicroFrontEnd

- *Código:* https://github.com/DiogoGibertoni/aquila-microservices/tree/main/frontend
- *Dockerfile:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/frontend/Dockerfile
- *index.html:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/frontend/index.html
- *app.js:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/frontend/app.js
- *styles.css:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/frontend/styles.css

---

### 🐳 Docker Compose

- *docker-compose.yml:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/docker-compose.yml
- *.env (raiz):* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/.env

---

### 📚 Documentação

#### Swagger/OpenAPI
- *swagger.yaml:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/docs/swagger.yaml

#### Diagramas
- *Modelo de Dados:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/diagrams/data-model.md

- *ENTREGA.md:* https://github.com/DiogoGibertoni/aquila-microservices/blob/main/ENTREGA.md

---

## 🐳 Docker Hub

### Imagens Publicadas

| Serviço | Link Docker Hub |
|---------|-----------------|
| *BFF* | https://hub.docker.com/r/diogogibertoni/aquila-bff |
| *Product Service* | https://hub.docker.com/r/diogogibertoni/aquila-product-service |
| *Price Analyzer* | https://hub.docker.com/r/diogogibertoni/aquila-price-analyzer |
| *Event Processor* | https://hub.docker.com/r/diogogibertoni/aquila-event-processor |

---

## 📊 Estrutura do Repositório


aquila-microservices/
├── bff/                          → Backend for Frontend
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── microservices/
│   ├── product-service/          → Serviço de Produtos (MongoDB)
│   │   ├── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── price-service/            → Serviço de Preços (Azure SQL)
│       ├── server.js
│       ├── Dockerfile
│       └── package.json
│
├── functions/
│   ├── price-analyzer/           → Análise de Promoção Falsa
│   │   ├── index.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── notification-service/     → Event Processor
│       ├── index.js
│       ├── Dockerfile
│       └── package.json
│
├── frontend/                     → MicroFrontEnd
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── Dockerfile
│   └── README.md
│
├── scripts/                      → Scripts de População
│   ├── populate-database.js
│   ├── init-azure-db.js
│   ├── clean-database.js
│   └── README.md
│
├── docs/
│   └── swagger.yaml              → Documentação OpenAPI
│
├── diagrams/
│   └── data-model.md             → Modelo de Dados
│
├── docker-compose.yml            → Orquestração de Containers
├── .env                          → Variáveis de Ambiente
├── README.md                     → Documentação Principal
└── ENTREGA.md                    → Informações de Entrega


---

## 🌐 Endpoints Principais

### BFF (http://localhost:3000)
- GET /api/products/:id/complete - *Agregação* (produto + histórico)
- GET /api/products - Lista produtos
- POST /api/products - Cria produto
- POST /api/prices - Cria preço via evento
- POST /api/analyze-price - Analisa promoção falsa

### Product Service (http://localhost:3001)
- GET /products - Lista produtos
- POST /products - Cria produto
- PUT /products/:id - Atualiza produto
- DELETE /products/:id - Remove produto

### Price Service (http://localhost:3002)
- GET /prices - Lista preços
- GET /prices/product/:productId - Histórico de preços

### Price Analyzer (http://localhost:3003)
- POST /analyze-price - Análise de promoção falsa

### Event Processor (http://localhost:3004)
- POST /process-price-event - Processa evento de preço

---

## 📝 Tecnologias

- *Backend:* Node.js, Express.js
- *Frontend:* HTML5, CSS3, JavaScript Vanilla
- *Bancos:* MongoDB Atlas, Azure SQL Server
- *Container:* Docker, Docker Compose
- *Servidor Web:* Nginx Alpine

---
