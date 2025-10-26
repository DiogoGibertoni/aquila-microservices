const express = require('express' );
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Service URLs
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const PRICE_SERVICE = process.env.PRICE_SERVICE_URL || 'http://localhost:3002';
const ANALYZER_FUNCTION = process.env.ANALYZER_FUNCTION_URL || 'http://localhost:3003';
const EVENT_PROCESSOR = process.env.EVENT_PROCESSOR_URL || 'http://localhost:3004';

// ============================================
// AGREGAÇÃO - Busca produto + preços
// Rota: GET /api/products/:id/complete
// ============================================
app.get('/api/products/:id/complete', async (req, res ) => {
  try {
    const productId = req.params.id;
    
    // Request paralelo para product service e price service
    const [productRes, pricesRes] = await Promise.all([
      axios.get(`${PRODUCT_SERVICE}/products/${productId}`),
      axios.get(`${PRICE_SERVICE}/prices/product/${productId}`)
    ]);
    
    // Agregação dos dados
    const aggregatedData = {
      product: productRes.data,
      prices: pricesRes.data,
      aggregated_at: new Date()
    };
    
    res.json(aggregatedData);
    
  } catch (error) {
    console.error('Erro na agregação:', error.message);
    res.status(500).json({ error: 'Erro ao agregar dados' });
  }
});

// ============================================
// PROXY CRUD - Products
// ============================================
app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const response = await axios.post(`${PRODUCT_SERVICE}/products`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const response = await axios.put(`${PRODUCT_SERVICE}/products/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await axios.delete(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROXY CRUD - Prices (GET)
// ============================================
app.get('/api/prices', async (req, res) => {
  try {
    const response = await axios.get(`${PRICE_SERVICE}/prices`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices/product/:productId', async (req, res) => {
  try {
    const response = await axios.get(`${PRICE_SERVICE}/prices/product/${req.params.productId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE via EVENTO - Envia para Function
// Rota: POST /api/prices
// ============================================
app.post('/api/prices', async (req, res) => {
  try {
    // Envia evento para function processar
    const response = await axios.post(`${EVENT_PROCESSOR}/process-price-event`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Análise de Preço - Chama Function
// Rota: POST /api/analyze-price
// ============================================
app.post('/api/analyze-price', async (req, res) => {
  try {
    const response = await axios.post(`${ANALYZER_FUNCTION}/analyze-price`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'bff',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFF rodando na porta ${PORT}`);
});
