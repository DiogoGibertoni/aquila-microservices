const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'StrongPassword123!',
    server: 'localhost',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000
    }
};

async function initializeDatabase() {
    console.log('🔧 Inicializando banco de dados SQL Server...\n');

    try {
        // Conectar ao SQL Server
        console.log('Conectando ao SQL Server...');
        const pool = await sql.connect(config);
        console.log('✅ Conectado ao SQL Server\n');

        // Criar banco de dados
        console.log('Criando banco de dados aquilaDB...');
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'aquilaDB')
            BEGIN
                CREATE DATABASE aquilaDB;
                PRINT 'Banco aquilaDB criado!';
            END
            ELSE
            BEGIN
                PRINT 'Banco aquilaDB já existe.';
            END
        `);
        console.log('✅ Banco de dados verificado\n');

        // Fechar conexão atual e reconectar ao banco aquilaDB
        await pool.close();

        const aquilaConfig = {
            ...config,
            database: 'aquilaDB'
        };

        console.log('Conectando ao banco aquilaDB...');
        const aquilaPool = await sql.connect(aquilaConfig);
        console.log('✅ Conectado ao aquilaDB\n');

        // Criar tabela prices
        console.log('Criando tabela prices...');
        await aquilaPool.request().query(`
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
        const result = await aquilaPool.request().query(`
            SELECT
                COLUMN_NAME,
                DATA_TYPE,
                IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'prices'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('📊 Estrutura da tabela prices:');
        console.table(result.recordset);

        await aquilaPool.close();

        console.log('\n🎉 Banco de dados inicializado com sucesso!');
        console.log('\n📝 Próximo passo: Execute "npm run populate" para criar produtos e preços de teste.\n');

    } catch (error) {
        console.error('\n❌ Erro ao inicializar banco:', error.message);
        console.error('\n💡 Dicas:');
        console.error('   1. Certifique-se que o SQL Server está rodando: docker ps');
        console.error('   2. Aguarde 30 segundos após o docker-compose up');
        console.error('   3. Verifique os logs: docker logs aquila-sqlserver-local\n');
        process.exit(1);
    }
}

initializeDatabase();
