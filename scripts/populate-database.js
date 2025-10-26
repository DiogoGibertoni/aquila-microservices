const axios = require('axios');

const BFF_URL = 'http://localhost:3000';

// Produtos de teste
const products = [
    {
        name: 'Notebook Dell Inspiron 15',
        description: 'Notebook com Intel Core i5, 8GB RAM, 256GB SSD',
        category: 'Eletrônicos'
    },
    {
        name: 'Smart TV Samsung 50"',
        description: 'Smart TV 4K UHD, HDR, Tizen OS',
        category: 'Eletrônicos'
    },
    {
        name: 'iPhone 14 Pro 128GB',
        description: 'iPhone 14 Pro com câmera de 48MP e chip A16',
        category: 'Celulares'
    },
    {
        name: 'Geladeira Brastemp Frost Free',
        description: 'Geladeira duplex 400L com tecnologia frost free',
        category: 'Eletrodomésticos'
    },
    {
        name: 'Tênis Nike Air Max',
        description: 'Tênis esportivo com tecnologia Air Max',
        category: 'Esportes'
    },
    {
        name: 'Cafeteira Nespresso',
        description: 'Cafeteira automática com 19 bars de pressão',
        category: 'Eletrodomésticos'
    },
    {
        name: 'Fone JBL Tune 510BT',
        description: 'Fone Bluetooth com até 40h de bateria',
        category: 'Eletrônicos'
    },
    {
        name: 'Ar Condicionado LG 12000 BTUs',
        description: 'Ar condicionado split inverter com WiFi',
        category: 'Eletrodomésticos'
    }
];

// Função para gerar histórico de preços realista
function generatePriceHistory(basePrice, productId) {
    const history = [];
    const today = new Date();

    // Gerar 30 dias de histórico
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Variar preço de forma realista
        let currentPrice = basePrice;
        let originalPrice = basePrice * 1.3; // Preço original 30% maior
        let isPromotion = false;
        let isFakePromotion = false;

        // Criar alguns padrões de preço
        if (i > 20) {
            // Preço normal no início
            currentPrice = basePrice;
            originalPrice = basePrice;
        } else if (i > 15 && i <= 20) {
            // Aumentar preço (preparando promoção falsa)
            currentPrice = basePrice * 1.25;
            originalPrice = basePrice * 1.25;
        } else if (i > 10 && i <= 15) {
            // "Promoção" falsa - preço volta ao normal mas mostra como promoção
            currentPrice = basePrice;
            originalPrice = basePrice * 1.25;
            isPromotion = true;
            isFakePromotion = true;
        } else if (i > 5 && i <= 10) {
            // Preço normal novamente
            currentPrice = basePrice;
            originalPrice = basePrice;
        } else {
            // Promoção real nos últimos 5 dias
            currentPrice = basePrice * 0.75; // 25% de desconto real
            originalPrice = basePrice;
            isPromotion = true;
            isFakePromotion = false;
        }

        history.push({
            product_id: productId,
            price: parseFloat(currentPrice.toFixed(2)),
            original_price: parseFloat(originalPrice.toFixed(2)),
            is_promotion: isPromotion,
            is_fake_promotion: isFakePromotion,
            scraped_at: date.toISOString()
        });
    }

    return history;
}

async function populateDatabase() {
    console.log('🚀 Iniciando população do banco de dados...\n');

    try {
        // Verificar se o BFF está rodando
        try {
            await axios.get(`${BFF_URL}/health`);
            console.log('✅ BFF está online\n');
        } catch (error) {
            console.error('❌ BFF não está rodando na porta 3000!');
            console.error('Execute: docker-compose up -d\n');
            process.exit(1);
        }

        const createdProducts = [];

        // Criar produtos
        console.log('📦 Criando produtos...\n');
        for (const product of products) {
            try {
                const response = await axios.post(`${BFF_URL}/api/products`, product);
                createdProducts.push(response.data);
                console.log(`✅ Criado: ${product.name} (ID: ${response.data._id})`);
            } catch (error) {
                console.error(`❌ Erro ao criar ${product.name}:`, error.message);
            }
        }

        console.log(`\n✅ ${createdProducts.length} produtos criados!\n`);

        // Criar histórico de preços para cada produto
        console.log('💰 Criando histórico de preços...\n');

        // Preços base para cada produto
        const basePrices = [2500, 1800, 5500, 2200, 450, 800, 350, 1500];

        for (let i = 0; i < createdProducts.length; i++) {
            const product = createdProducts[i];
            const priceHistory = generatePriceHistory(basePrices[i], product._id);

            console.log(`Criando ${priceHistory.length} registros de preço para: ${product.name}`);

            for (const priceData of priceHistory) {
                try {
                    // Usar o endpoint de evento do BFF
                    await axios.post(`${BFF_URL}/api/prices`, priceData);
                } catch (error) {
                    console.error(`  ❌ Erro ao criar preço:`, error.message);
                }
            }

            console.log(`  ✅ Histórico criado para: ${product.name}\n`);
        }

        console.log('\n🎉 Banco de dados populado com sucesso!\n');
        console.log('📊 Resumo:');
        console.log(`   - ${createdProducts.length} produtos`);
        console.log(`   - ~${createdProducts.length * 31} registros de preços`);
        console.log('\n🌐 Teste o frontend em: http://localhost:80');
        console.log('\n📝 IDs dos produtos criados:');
        createdProducts.forEach(p => {
            console.log(`   ${p.name}: ${p._id}`);
        });

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
        process.exit(1);
    }
}

// Executar
populateDatabase();
