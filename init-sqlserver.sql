-- Script de inicialização do SQL Server
-- Cria o banco de dados e a tabela de preços

-- Criar banco de dados se não existir
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'aquilaDB')
BEGIN
    CREATE DATABASE aquilaDB;
END
GO

USE aquilaDB;
GO

-- Criar tabela de preços
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'prices')
BEGIN
    CREATE TABLE prices (
        id INT PRIMARY KEY IDENTITY(1,1),
        product_id VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        is_promotion BIT DEFAULT 0,
        is_fake_promotion BIT DEFAULT 0,
        scraped_at DATETIME DEFAULT GETDATE()
    );

    -- Criar índice para buscar por product_id
    CREATE INDEX idx_product_id ON prices(product_id);
    CREATE INDEX idx_scraped_at ON prices(scraped_at DESC);

    PRINT 'Tabela prices criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela prices já existe.';
END
GO
