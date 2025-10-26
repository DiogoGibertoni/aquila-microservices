const sql = require('mssql');

const config = {
    user: 'diogocg',
    password: 'heavymetal666!',
    server: 'aquilasqlserver.database.windows.net',
    database: 'aquilaDB',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000
    }
};

async function initializeAzureDatabase() {
    console.log('🔧 Inicializando banco de dados Azure SQL Server...\n');

    try {
        console.log('Conectando ao Azure SQL Server...');
        const pool = await sql.connect(config);
        console.log('✅ Conectado ao Azure SQL Server\n');

        // Criar tabela prices
        console.log('Criando tabela prices...');
        await pool.request().query(`
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

                CREATE INDEX idx_product_id ON prices(product_id);
                CREATE INDEX idx_scraped_at ON prices(scraped_at DESC);

                PRINT 'Tabela prices criada!';
            END
            ELSE
            BEGIN
                PRINT 'Tabela prices já existe.';
            END
        `);
        console.log('✅ Tabela prices verificada\n');

        // Verificar tabela
        const result = await pool.request().query(`
            SELECT
                COLUMN_NAME,
                DATA_TYPE,
                IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'prices'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('📊 Estrutura da tabela prices no Azure:');
        console.table(result.recordset);

        await pool.close();

        console.log('\n🎉 Banco de dados Azure inicializado com sucesso!');
        console.log('\n📝 Próximo passo: Execute "npm run populate" para criar produtos e preços.\n');

    } catch (error) {
        console.error('\n❌ Erro ao inicializar banco Azure:', error.message);
        console.error('\n💡 Verifique:');
        console.error('   1. Acesso público habilitado no Azure Portal');
        console.error('   2. Seu IP adicionado nas regras de firewall');
        console.error('   3. Credenciais corretas no arquivo .env\n');
        process.exit(1);
    }
}

initializeAzureDatabase();
