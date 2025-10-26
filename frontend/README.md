# Aquila MicroFrontend

MicroFrontend completo para monitoramento de preços e detecção de promoções falsas do projeto Aquila.

## Funcionalidades

### 1. Lista de Produtos
- Visualização em cards de todos os produtos cadastrados
- Exibição do preço atual e status de cada produto
- Indicadores visuais de promoção (real/falsa)
- Botão de atualização da lista
- Cards clicáveis para ver histórico completo

### 2. Adicionar Produto
- Formulário completo para cadastro de novos produtos
- Campos: Nome, Descrição, Categoria, ID Externo, Site ID
- Validação de campos obrigatórios
- Feedback visual de sucesso/erro
- Navegação automática para detalhes após cadastro

### 3. Buscar por ID
- Busca de produto específico por ID do MongoDB
- Exibição de informações completas
- Histórico detalhado de preços
- Tabela com 30 dias de variações de preço
- Indicadores de promoção verdadeira vs falsa

## Estrutura de Arquivos

```
frontend/
├── index.html      # Interface HTML com 3 views
├── app.js          # Lógica completa (navegação, listagem, cadastro, busca)
├── styles.css      # Estilos modernos e responsivos
├── Dockerfile      # Container com Nginx
└── README.md       # Este arquivo
```

## Indicadores Visuais

- **Verde**: Promoções verdadeiras (✓ desconto real)
- **Vermelho**: Promoções falsas (⚠️ preço inflacionado antes)
- **Cinza**: Preço normal (sem promoção)

## Como Executar

### Pré-requisitos

Certifique-se de que o BFF e todos os serviços estão rodando:

```bash
# Na raiz do projeto
docker-compose up -d

# Aguarde alguns segundos para inicialização completa
docker-compose ps
```

### Opção 1: Localmente (sem Docker)

```bash
cd frontend

# Opção A: Abrir diretamente no navegador
# Simplesmente abra o index.html

# Opção B: Python HTTP Server
python -m http.server 8080

# Opção C: Node.js http-server
npx http-server -p 8080
```

Acesse: `http://localhost:8080`

### Opção 2: Com Docker

```bash
cd frontend

# Build da imagem
docker build -t aquila-frontend .

# Executar container
docker run -d -p 80:80 --name aquila-frontend aquila-frontend

# Ver logs
docker logs aquila-frontend
```

Acesse: `http://localhost`

### Opção 3: Com Docker Compose (recomendado)

Adicione ao `docker-compose.yml` na raiz:

```yaml
services:
  # ... outros serviços ...

  frontend:
    build: ./frontend
    container_name: aquila-frontend
    ports:
      - "80:80"
    networks:
      - aquila-network
    depends_on:
      - bff
```

Execute:

```bash
docker-compose up -d frontend
```

## Populando o Banco com Dados de Teste

Para testar o frontend com dados reais:

```bash
# Na raiz do projeto
cd scripts
npm install
npm run populate
```

Isso criará:
- 8 produtos de teste
- 30 dias de histórico de preços para cada produto
- Exemplos de promoções reais e falsas

## Fluxo de Uso

### 1. Primeiro Acesso

Ao abrir o frontend, você verá a **Lista de Produtos**:
- Se vazio: use o script de população ou cadastre produtos manualmente
- Se com dados: navegue pelos cards

### 2. Cadastrar Novo Produto

1. Clique na aba **"➕ Adicionar Produto"**
2. Preencha o formulário:
   - **Nome** (obrigatório): Ex: "Notebook Dell Inspiron 15"
   - **Descrição** (opcional): Detalhes do produto
   - **Categoria** (obrigatório): Selecione da lista
   - **ID Externo** (opcional): ID do site de origem
   - **Site ID** (opcional): Identificador do site
3. Clique em **"Cadastrar Produto"**
4. Após sucesso, clique em **"Ver Detalhes"** ou volte para a lista

### 3. Ver Detalhes de um Produto

**Opção A**: Na lista, clique em **"Ver Histórico Completo"**
**Opção B**: Na aba **"🔍 Buscar por ID"**, cole o ID e clique em **"Buscar Detalhes"**

Você verá:
- Informações completas do produto
- Tabela com histórico de preços
- Indicadores de promoção real/falsa

### 4. Adicionar Preços a um Produto

Use a API do BFF para adicionar preços:

```bash
curl -X POST http://localhost:3000/api/prices \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "SEU_PRODUCT_ID_AQUI",
    "price": 2299.90,
    "original_price": 2999.90,
    "is_promotion": true,
    "is_fake_promotion": false
  }'
```

## Endpoints Utilizados

O frontend consome os seguintes endpoints do BFF:

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/products` | Listar todos os produtos |
| GET | `/api/products/:id/complete` | Buscar produto + histórico |
| POST | `/api/products` | Cadastrar novo produto |
| GET | `/api/prices/product/:productId` | Buscar preços de um produto |
| POST | `/api/prices` | Adicionar novo preço (via evento) |

## Tecnologias

- **HTML5**: Estrutura semântica com múltiplas views
- **CSS3**: Grid layout, flexbox, animações, gradientes
- **JavaScript Vanilla**: SPA sem frameworks
- **Nginx Alpine**: Servidor web leve
- **Docker**: Containerização

## Personalização

### Alterar URL do BFF

Edite `app.js`:

```javascript
const BFF_URL = 'http://localhost:3000'; // Altere aqui
```

### Adicionar Novas Categorias

Edite `index.html` no select de categorias:

```html
<select id="productCategory" required>
    <option value="Sua Categoria">Sua Categoria</option>
</select>
```

### Modificar Cores

Edite `styles.css`:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cores dos indicadores */
.badge-promotion { background-color: #4caf50; } /* Verde */
.badge-fake { background-color: #f44336; } /* Vermelho */
.badge-normal { background-color: #9e9e9e; } /* Cinza */
```

## Arquitetura do Frontend

```
┌─────────────────────────────────────────┐
│         Aquila MicroFrontend            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  VIEW 1: Lista de Produtos      │   │
│  │  - Cards com preços atuais      │   │
│  │  - Status de promoção           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  VIEW 2: Adicionar Produto      │   │
│  │  - Formulário de cadastro       │   │
│  │  - Validação de campos          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  VIEW 3: Buscar por ID          │   │
│  │  - Detalhes completos           │   │
│  │  - Histórico de 30 dias         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
              ▼ HTTP/REST
┌─────────────────────────────────────────┐
│         BFF (Port 3000)                 │
│  - Agregação de dados                   │
│  - Proxy para microserviços             │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Erro: "Failed to fetch"

**Causa**: BFF não está rodando ou CORS não está configurado

**Solução**:
```bash
docker-compose ps
# Verifique se o BFF está "Up"

# Se não estiver, inicie:
docker-compose up -d bff
```

### Lista de produtos vazia

**Causa**: Banco de dados sem dados

**Solução**:
```bash
cd scripts
npm run populate
```

### Produtos aparecem sem preço

**Causa**: Preços não foram cadastrados para o produto

**Solução**: Use o script de população ou adicione preços via API

### Página em branco

**Causa**: Erro de JavaScript

**Solução**:
1. Abra o console do navegador (F12)
2. Veja os erros na aba Console
3. Verifique se o BFF está acessível

### Botões não funcionam

**Causa**: JavaScript não carregou

**Solução**:
1. Verifique se `app.js` está no mesmo diretório
2. Abra o console e veja erros
3. Certifique-se de servir via HTTP (não file://)

## Recursos Adicionais

### Popular banco via API

```bash
# Criar produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição",
    "category": "Eletrônicos"
  }'

# Adicionar preço
curl -X POST http://localhost:3000/api/prices \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "ID_AQUI",
    "price": 100.00,
    "original_price": 150.00,
    "is_promotion": true
  }'
```

### Testar localmente com live reload

```bash
npm install -g live-server
cd frontend
live-server --port=8080
```

## Padrões Seguidos

- ✅ SPA (Single Page Application) com múltiplas views
- ✅ JavaScript Vanilla (sem dependências)
- ✅ Responsive Design (mobile-first)
- ✅ Acessibilidade (labels, semântica HTML)
- ✅ Feedback visual (loading, sucesso, erro)
- ✅ Dockerizado para produção
- ✅ Código limpo e comentado

## Licença

Parte do projeto Aquila Microservices - Trabalho Acadêmico
