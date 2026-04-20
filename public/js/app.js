// API Base URL
const API_BASE = 'http://localhost:8080/api';

// Global state
let pizzas = [];
let cart = [];
let currentClientId = null;

// ============ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', () => {
    loadPizzas();
    loadClients();
    loadOrders();
    loadCartFromStorage();
    updateCartDisplay();
});

// ============ ВКЛАДКИ ============
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'menu') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('menuTab').classList.add('active');
    } else if (tabName === 'orders') {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('ordersTab').classList.add('active');
        loadOrders();
    } else if (tabName === 'profile') {
        document.querySelector('.tab-btn:nth-child(3)').classList.add('active');
        document.getElementById('profileTab').classList.add('active');
    }
}

// ============ ПИЦЦЫ ============
async function loadPizzas() {
    try {
        const response = await fetch(`${API_BASE}/pizzas`);
        pizzas = await response.json();
        displayPizzas(pizzas);
    } catch (error) {
        console.error('Error loading pizzas:', error);
        document.getElementById('pizzasGrid').innerHTML = '<div class="loading">❌ Ошибка загрузки пицц</div>';
    }
}

function displayPizzas(pizzasToShow) {
    const grid = document.getElementById('pizzasGrid');
    
    if (pizzasToShow.length === 0) {
        grid.innerHTML = '<div class="loading">🍕 Пиццы не найдены</div>';
        return;
    }
    
    grid.innerHTML = pizzasToShow.map(pizza => `
        <div class="pizza-card">
            <div class="pizza-info">
                <div class="pizza-name">${escapeHtml(pizza.name)}</div>
                <div class="pizza-description">${escapeHtml(pizza.description || 'Классическая пицца')}</div>
                ${pizza.isVegetarian ? '<div class="pizza-vegetarian">🥬 Вегетарианская</div>' : ''}
                <div class="pizza-price">${pizza.price} ₽</div>
                <div class="pizza-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(${pizza.id}, -1)">-</button>
                        <span class="quantity" id="qty-${pizza.id}">${getCartQuantity(pizza.id)}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${pizza.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${pizza.id})">В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterPizzas() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const vegetarianOnly = document.getElementById('vegetarianFilter').checked;
    
    let filtered = pizzas;
    
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    if (vegetarianOnly) {
        filtered = filtered.filter(p => p.isVegetarian);
    }
    
    displayPizzas(filtered);
}

// ============ КОРЗИНА ============
function getCartQuantity(pizzaId) {
    const item = cart.find(i => i.id === pizzaId);
    return item ? item.quantity : 0;
}

function changeQuantity(pizzaId, delta) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;
    
    const existingItem = cart.find(i => i.id === pizzaId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        if (newQuantity <= 0) {
            cart = cart.filter(i => i.id !== pizzaId);
        } else {
            existingItem.quantity = newQuantity;
        }
    } else if (delta > 0) {
        cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    displayPizzas(pizzas);
}

function addToCart(pizzaId) {
    changeQuantity(pizzaId, 1);
    showCartNotification();
}

function updateCartDisplay() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div style="text-align:center; padding:20px;">Корзина пуста</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <span>${escapeHtml(item.name)} x ${item.quantity}</span>
                    <span>${item.price * item.quantity} ₽</span>
                </div>
            `).join('');
        }
    }
    
    if (cartTotalSpan) {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalSpan.textContent = `${total} ₽`;
    }
}

function showCartNotification() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = '';
    }, 200);
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        updateCartDisplay();
        modal.style.display = 'flex';
    }
}

async function checkout() {
    if (!currentClientId) {
        alert('Пожалуйста, выберите клиента в профиле перед оформлением заказа');
        showTab('profile');
        return;
    }
    
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    // Получаем основной адрес клиента
    const addressesResponse = await fetch(`${API_BASE}/addresses/client/${currentClientId}`);
    const addresses = await addressesResponse.json();
    const mainAddress = addresses.find(a => a.isMain) || addresses[0];
    
    if (!mainAddress) {
        alert('У клиента нет адреса доставки');
        return;
    }
    
    const orderNumber = `ORD-${Date.now()}`;
    const items = cart.map(item => ({
        pizzaId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.price
    }));
    
    const orderData = {
        orderNumber: orderNumber,
        clientId: currentClientId,
        addressId: mainAddress.id,
        paymentMethod: 'card',
        comment: 'Заказ с сайта',
        items: items
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            alert('✅ Заказ успешно оформлен!');
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            toggleCart();
            loadOrders();
            showTab('orders');
        } else {
            const error = await response.json();
            alert('❌ Ошибка: ' + error.message);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('❌ Ошибка при оформлении заказа');
    }
}

// ============ ЗАКАЗЫ ============
async function loadOrders() {
    if (!currentClientId) {
        document.getElementById('ordersList').innerHTML = '<div class="loading">👤 Выберите клиента в профиле</div>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/clients/${currentClientId}/orders`);
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML = '<div class="loading">❌ Ошибка загрузки заказов</div>';
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="loading">📋 У вас пока нет заказов</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">${escapeHtml(order.orderNumber)}</span>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                📅 ${new Date(order.orderDate).toLocaleString()}<br>
                📍 ${escapeHtml(order.street || '')} ${escapeHtml(order.house || '')}${order.apartment ? `, кв. ${order.apartment}` : ''}
            </div>
            <div class="order-total">💰 ${order.total_amount} ₽</div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'new': '🆕 Новый',
        'cooking': '🍳 Готовится',
        'delivering': '🚚 В доставке',
        'delivered': '✅ Доставлен',
        'cancelled': '❌ Отменён'
    };
    return statusMap[status] || status;
}

// ============ КЛИЕНТЫ ============
async function loadClients() {
    try {
        const response = await fetch(`${API_BASE}/clients`);
        const clients = await response.json();
        
        const select = document.getElementById('clientSelect');
        select.innerHTML = '<option value="">-- Выберите клиента --</option>' + 
            clients.map(c => `<option value="${c.id}">${c.firstName} ${c.lastName} (${c.phone})</option>`).join('');
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

async function loadClientData() {
    const select = document.getElementById('clientSelect');
    currentClientId = select.value;
    
    if (!currentClientId) return;
    
    try {
        const response = await fetch(`${API_BASE}/clients/${currentClientId}`);
        const client = await response.json();
        
        document.getElementById('clientInfo').innerHTML = `
            <p><strong>Имя:</strong> ${client.firstName} ${client.lastName}</p>
            <p><strong>Телефон:</strong> ${client.phone}</p>
            <p><strong>Email:</strong> ${client.email || 'Не указан'}</p>
        `;
        
        document.getElementById('loyaltyPoints').textContent = client.loyaltyPoints;
        
        const addressesResponse = await fetch(`${API_BASE}/addresses/client/${currentClientId}`);
        const addresses = await addressesResponse.json();
        
        const addressesHtml = addresses.map(addr => `
            <div class="address-item">
                <strong>${addr.isMain ? '🏠 Основной' : '📍 Дополнительный'}</strong><br>
                ${addr.street}, ${addr.house}${addr.apartment ? `, кв. ${addr.apartment}` : ''}
                ${addr.entrance ? `<br>🚪 Подъезд: ${addr.entrance}` : ''}
                ${addr.floor ? `<br>🏢 Этаж: ${addr.floor}` : ''}
                ${addr.comment ? `<br>📝 ${addr.comment}` : ''}
            </div>
        `).join('');
        
        document.getElementById('clientAddresses').innerHTML = addressesHtml ? 
            `<h3>Адреса доставки:</h3>${addressesHtml}` : '<p>Адреса не добавлены</p>';
        
        loadOrders();
    } catch (error) {
        console.error('Error loading client data:', error);
    }
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function saveCartToStorage() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('pizzaCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}