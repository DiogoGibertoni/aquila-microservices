const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// HTTP Trigger Function
app.post('/analyze-price', async (req, res) => {
  try {
    const { product_id, current_price } = req.body;
    
    // Buscar histórico de preços
    // ATENÇÃO: O Price Service deve estar rodando em http://localhost:3002
    const priceHistory = await axios.get(
      `http://localhost:3002/prices/product/${product_id}`
     );
    
    const prices = priceHistory.data;
    
    if (prices.length === 0) {
      return res.json({
        is_fake_promotion: false,
        message: 'Sem histórico para análise'
      });
    }
    
    // Calcular média dos últimos 30 dias
    const average = prices.reduce((sum, p) => sum + parseFloat(p.price), 0) / prices.length;
    
    // Detectar promoção falsa (preço atual próximo ou acima da média)
    // Se o preço atual for maior ou igual a 95% da média histórica, é considerado falso.
    const is_fake = current_price >= average * 0.95;
    
    res.json({
      product_id,
      current_price,
      historical_average: average,
      is_fake_promotion: is_fake,
      analysis_date: new Date()
    });
    
  } catch (error) {
    // Em caso de erro (ex: Price Service não está rodando)
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', function: 'price-analyzer' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Price Analyzer Function rodando na porta ${PORT}`);
});
