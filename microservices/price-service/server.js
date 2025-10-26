const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// SQL Server Configuration
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true, // Necessário para Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

// Initialize Database
async function initDatabase() {
  try {
    await sql.connect(config);
    console.log('SQL Server conectado');
    
    // Criar tabela se não existir
    const request = new sql.Request();
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='prices' AND xtype='U')
      CREATE TABLE prices (
        id INT PRIMARY KEY IDENTITY,
        product_id VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        is_promotion BIT DEFAULT 0,
        is_fake_promotion BIT DEFAULT 0,
        scraped_at DATETIME DEFAULT GETDATE()
      )
    `);
  } catch (err) {
    console.error('Erro ao conectar SQL Server:', err);
  }
}

initDatabase();

// Routes
// GET /prices
app.get('/prices', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT * FROM prices ORDER BY scraped_at DESC');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /prices/product/:productId
app.get('/prices/product/:productId', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('productId', sql.VarChar, req.params.productId)
      .query('SELECT * FROM prices WHERE product_id = @productId ORDER BY scraped_at DESC');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /prices
app.post('/prices', async (req, res) => {
  try {
    const { product_id, price, original_price, is_promotion, is_fake_promotion } = req.body;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('product_id', sql.VarChar, product_id)
      .input('price', sql.Decimal(10, 2), price)
      .input('original_price', sql.Decimal(10, 2), original_price)
      .input('is_promotion', sql.Bit, is_promotion || false)
      .input('is_fake_promotion', sql.Bit, is_fake_promotion || false)
      .query(`
        INSERT INTO prices (product_id, price, original_price, is_promotion, is_fake_promotion)
        OUTPUT INSERTED.*
        VALUES (@product_id, @price, @original_price, @is_promotion, @is_fake_promotion)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'price-service' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Price Service rodando na porta ${PORT}`);
});
