const axios = require('axios');
const sql = require('mssql');

const BFF_URL = 'http://localhost:3000';

const azureConfig = {
    user: 'diogocg',
    password: 'heavymetal666!',
    server: 'aquilasqlserver.database.windows.net',
    database: 'aquilaDB',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000
    }
};

async function cleanDatabase() {
    console.log('🧹 Limpando banco de dados...\n');

    try {
        // 1. Limpar produtos do MongoDB via BFF
        console.log('1️⃣ Buscando produtos no MongoDB...');
        const productsResponse = await axios.get(`${BFF_URL}/api/products`);
        const products = productsResponse.data;

        console.log(`   Encontrados ${products.length} produtos\n`);

        if (products.length > 0) {
            console.log('   Deletando produtos...');
            for (const product of products) {
                try {
                    await axios.delete(`${BFF_URL}/api/products/${product._id}`);
                    console.log(`   ✅ Deletado: ${product.name}`);
                } catch (error) {
                    console.log(`   ❌ Erro ao deletar ${product.name}: ${error.message}`);
                }
            }
        }

        console.log('\n2️⃣ Conectando ao Azure SQL Server...');
        const pool = await sql.connect(azureConfig);
        console.log('   ✅ Conectado\n');

        // 2. Limpar preços do SQL Server
        console.log('   Deletando preços...');
        const result = await pool.request().query('DELETE FROM prices');
        console.log(`   ✅ ${result.rowsAffected[0]} preços deletados\n`);

        await pool.close();

        console.log('🎉 Banco de dados limpo com sucesso!\n');
        console.log('📝 Próximo passo: Execute "npm run populate" para criar novos dados.\n');

    } catch (error) {
        console.error('\n❌ Erro ao limpar banco:', error.message);
        process.exit(1);
    }
}

cleanDatabase();
