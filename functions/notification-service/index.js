const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(express.json());

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

// HTTP Trigger - Recebe evento e persiste
app.post('/process-price-event', async (req, res) => {
  try {
    const { product_id, price, original_price, is_promotion } = req.body;
    
    console.log('Evento recebido:', req.body);
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('product_id', sql.VarChar, product_id)
      .input('price', sql.Decimal(10, 2), price)
      .input('original_price', sql.Decimal(10, 2), original_price || price)
      .input('is_promotion', sql.Bit, is_promotion || false)
      .query(`
        INSERT INTO prices (product_id, price, original_price, is_promotion)
        OUTPUT INSERTED.*
        VALUES (@product_id, @price, @original_price, @is_promotion)
      `);
    
    res.status(201).json({
      message: 'Preço persistido via evento',
      data: result.recordset[0]
    });
    
  } catch (error) {
    console.error('Erro ao processar evento:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', function: 'event-processor' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Event Processor Function rodando na porta ${PORT}`);
});
