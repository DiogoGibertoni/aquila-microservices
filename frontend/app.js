// Configurações
const BFF_URL = 'http://localhost:3000';

// =======================================
// NAVEGAÇÃO ENTRE VIEWS
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeListView();
    initializeAddView();
    initializeSearchView();
});

function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const viewName = tab.dataset.view;
            switchView(viewName);
        });
    });
}

function switchView(viewName) {
    // Remover active de todas as tabs e views
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));

    // Ativar tab e view selecionadas
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    let viewElement;
    if (viewName === 'list') {
        viewElement = document.getElementById('listView');
        loadProductsList(); // Carregar lista ao mostrar
    } else if (viewName === 'add') {
        viewElement = document.getElementById('addView');
    } else if (viewName === 'search') {
        viewElement = document.getElementById('searchView');
    }

    if (viewElement) {
        viewElement.classList.add('active');
    }
}

// =======================================
// VIEW 1: LISTA DE PRODUTOS
// =======================================

function initializeListView() {
    const refreshBtn = document.getElementById('refreshListBtn');
    refreshBtn.addEventListener('click', loadProductsList);

    // Carregar lista inicial
    loadProductsList();
}

async function loadProductsList() {
    const loadingDiv = document.getElementById('loading-list');
    const productsListDiv = document.getElementById('productsList');

    loadingDiv.classList.remove('hidden');
    productsListDiv.innerHTML = '';

    try {
        const response = await fetch(`${BFF_URL}/api/products`);

        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }

        const products = await response.json();

        if (products.length === 0) {
            productsListDiv.innerHTML = `
                <div class="empty-state">
                    <h3>📦 Nenhum produto cadastrado</h3>
                    <p>Comece adicionando produtos na aba "Adicionar Produto"</p>
                </div>
            `;
        } else {
            displayProductsList(products);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsListDiv.innerHTML = `
            <div class="error">
                <h3>❌ Erro ao carregar produtos</h3>
                <p>${error.message}</p>
                <p>Certifique-se de que o BFF está rodando na porta 3000.</p>
            </div>
        `;
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

async function displayProductsList(products) {
    const productsListDiv = document.getElementById('productsList');
    const productsWithPrices = [];

    // Buscar último preço de cada produto
    for (const product of products) {
        try {
            const priceResponse = await fetch(`${BFF_URL}/api/prices/product/${product._id}`);
            let latestPrice = null;

            if (priceResponse.ok) {
                const priceHistory = await priceResponse.json();
                if (priceHistory && priceHistory.length > 0) {
                    latestPrice = priceHistory[0]; // Primeiro item é o mais recente
                }
            }

            productsWithPrices.push({ ...product, latestPrice });
        } catch (error) {
            console.error(`Erro ao buscar preço do produto ${product._id}:`, error);
            productsWithPrices.push({ ...product, latestPrice: null });
        }
    }

    // Renderizar cards
    productsListDiv.innerHTML = productsWithPrices.map(product => `
        <div class="product-card">
            <div class="product-card-header">
                <h3>${product.name}</h3>
                <span class="product-category">${product.category || 'Sem categoria'}</span>
            </div>
            <div class="product-card-body">
                <p class="product-description">${product.description || 'Sem descrição'}</p>
                ${renderPriceInfo(product.latestPrice)}
            </div>
            <div class="product-card-footer">
                <button class="btn-primary btn-small" onclick="viewProductDetails('${product._id}')">
                    Ver Histórico Completo
                </button>
                <span class="product-id">ID: ${product._id}</span>
            </div>
        </div>
    `).join('');
}

function renderPriceInfo(latestPrice) {
    if (!latestPrice) {
        return `
            <div class="price-info">
                <p class="no-price">Sem histórico de preços</p>
            </div>
        `;
    }

    const priceClass = latestPrice.is_fake_promotion ? 'fake-promotion' :
                       latestPrice.is_promotion ? 'promotion' : 'normal';

    return `
        <div class="price-info ${priceClass}">
            <div class="current-price">R$ ${formatPrice(latestPrice.price)}</div>
            ${latestPrice.original_price !== latestPrice.price ?
                `<div class="original-price">De: R$ ${formatPrice(latestPrice.original_price)}</div>` :
                ''
            }
            <div class="price-status">${getStatusBadge(latestPrice)}</div>
        </div>
    `;
}

function viewProductDetails(productId) {
    // Mudar para a view de busca
    switchView('search');

    // Preencher o input e buscar
    const productIdInput = document.getElementById('productIdInput');
    productIdInput.value = productId;
    fetchProductDetails();
}

// =======================================
// VIEW 2: ADICIONAR PRODUTO
// =======================================

function initializeAddView() {
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', handleAddProduct);
}

async function handleAddProduct(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = '';

    const productData = {
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        category: document.getElementById('productCategory').value,
        external_id: document.getElementById('productExternalId').value.trim() || undefined,
        site_id: document.getElementById('productSiteId').value.trim() || undefined
    };

    try {
        const response = await fetch(`${BFF_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error(`Erro ao cadastrar produto: ${response.status}`);
        }

        const createdProduct = await response.json();

        formMessage.innerHTML = `
            <div class="success-message">
                <h3>✅ Produto cadastrado com sucesso!</h3>
                <p><strong>ID:</strong> ${createdProduct._id}</p>
                <p><strong>Nome:</strong> ${createdProduct.name}</p>
                <button class="btn-primary" onclick="viewProductDetails('${createdProduct._id}')">
                    Ver Detalhes
                </button>
            </div>
        `;

        // Limpar formulário
        e.target.reset();

        // Recarregar lista de produtos
        loadProductsList();
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        formMessage.innerHTML = `
            <div class="error-message">
                <h3>❌ Erro ao cadastrar produto</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// =======================================
// VIEW 3: BUSCAR POR ID
// =======================================

function initializeSearchView() {
    const fetchButton = document.getElementById('fetchButton');
    const productIdInput = document.getElementById('productIdInput');

    fetchButton.addEventListener('click', fetchProductDetails);
    productIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchProductDetails();
        }
    });
}

async function fetchProductDetails() {
    const productIdInput = document.getElementById('productIdInput');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    const productId = productIdInput.value.trim();

    if (!productId) {
        showError('Por favor, digite um ID de produto válido.');
        return;
    }

    loadingDiv.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch(`${BFF_URL}/api/products/${productId}/complete`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Produto não encontrado. Verifique o ID e tente novamente.');
            }
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        showError(error.message || 'Erro ao buscar dados do produto. Verifique se o BFF está rodando na porta 3000.');
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const { product, prices, priceHistory } = data;
    const history = prices || priceHistory; // Aceitar ambos os formatos

    if (!product) {
        showError('Dados do produto não encontrados.');
        return;
    }

    let html = `
        <div class="product-info">
            <h2>Informações do Produto</h2>
            <div class="product-details">
                <p><strong>Nome:</strong> ${product.name || 'N/A'}</p>
                <p><strong>Descrição:</strong> ${product.description || 'N/A'}</p>
                <p><strong>Categoria:</strong> ${product.category || 'N/A'}</p>
                <p><strong>ID:</strong> ${product._id || product.id || 'N/A'}</p>
                <p><strong>Data de Cadastro:</strong> ${formatDate(product.created_at)}</p>
            </div>
        </div>
    `;

    if (history && history.length > 0) {
        html += `
            <div class="price-history">
                <h2>Histórico de Preços (${history.length} registros)</h2>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Preço Atual</th>
                                <th>Preço Original</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(price => `
                                <tr class="${getRowClass(price)}">
                                    <td>${formatDate(price.scraped_at)}</td>
                                    <td>R$ ${formatPrice(price.price)}</td>
                                    <td>R$ ${formatPrice(price.original_price)}</td>
                                    <td>${getStatusBadge(price)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="no-data">
                <p>Nenhum histórico de preços encontrado para este produto.</p>
            </div>
        `;
    }

    resultsDiv.innerHTML = html;
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="error">
            <h3>❌ Erro</h3>
            <p>${message}</p>
        </div>
    `;
}

// =======================================
// FUNÇÕES UTILITÁRIAS
// =======================================

function getRowClass(price) {
    if (price.is_fake_promotion) {
        return 'fake-promotion';
    }
    if (price.is_promotion) {
        return 'promotion';
    }
    return '';
}

function getStatusBadge(price) {
    if (price.is_fake_promotion) {
        return '<span class="badge badge-fake">⚠️ Promoção Falsa</span>';
    }
    if (price.is_promotion) {
        return '<span class="badge badge-promotion">✓ Promoção</span>';
    }
    return '<span class="badge badge-normal">Preço Normal</span>';
}

function formatPrice(price) {
    if (price === null || price === undefined) return '0,00';
    return parseFloat(price).toFixed(2).replace('.', ',');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
