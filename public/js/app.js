// API Base URL
const API_BASE = 'http://localhost:8080/api';

// Global state
let pizzas = [];
let cart = [];
let allClients = [];
let allOrders = [];
let allCouriers = [];
let currentUser = null;

// ============ АВТОРИЗАЦИЯ ============
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Введите имя пользователя и пароль');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            initApp();
        } else {
            const error = await response.json();
            alert('Ошибка входа: ' + error.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Ошибка подключения к серверу');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function initApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Отображаем информацию о пользователе
    document.getElementById('userRoleBadge').textContent = currentUser.role === 'admin' ? '👑 Администратор' : '🛵 Курьер';
    document.getElementById('userName').textContent = currentUser.role === 'admin' ? 'Admin' : 
        `${currentUser.courier?.firstName || ''} ${currentUser.courier?.lastName || ''}`;
    
    // Показываем нужные вкладки в зависимости от роли
    if (currentUser.role === 'admin') {
        document.getElementById('adminTabs').style.display = 'flex';
        document.getElementById('courierTabs').style.display = 'none';
        document.getElementById('ordersTitle').textContent = '📋 Все заказы';
        document.getElementById('courierSelectGroup').style.display = 'block';
    } else {
        document.getElementById('adminTabs').style.display = 'none';
        document.getElementById('courierTabs').style.display = 'flex';
        document.getElementById('ordersTitle').textContent = '📋 Мои заказы';
        document.getElementById('courierSelectGroup').style.display = 'none';
    }
    
    // ============ ДОБАВЬТЕ ЭТОТ БЛОК ============
    // Назначаем обработчики для кнопок админских вкладок
    document.querySelectorAll('#adminTabs .tab-btn').forEach(btn => {
        btn.onclick = () => showTab(btn.getAttribute('data-tab'));
    });
    
    // Назначаем обработчики для кнопок курьерских вкладок
    document.querySelectorAll('#courierTabs .tab-btn').forEach(btn => {
        btn.onclick = () => showTab(btn.getAttribute('data-tab'));
    });
    // ===========================================
    
    // Активируем первую вкладку в зависимости от роли
    if (currentUser.role === 'admin') {
        showTab('menu');
    } else {
        showTab('orders');
    }
    
    // Загружаем данные
    loadPizzas();
    loadAllClients();
    loadAllOrders();
    loadAllCouriers();
    loadCartFromStorage();
    updateCartDisplay();
    if (currentUser.role === 'admin') {
        loadOrderFormData();
    }
}

// Проверяем сохранённую сессию при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        initApp();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
});

// ============ ВКЛАДКИ ============
function showTab(tabName) {
    // Скрываем все контенты
    const menuTab = document.getElementById('menuTab');
    const ordersTab = document.getElementById('ordersTab');
    const clientsTab = document.getElementById('clientsTab');
    
    if (menuTab) menuTab.style.display = 'none';
    if (ordersTab) ordersTab.style.display = 'none';
    if (clientsTab) clientsTab.style.display = 'none';
    
    // Убираем активный класс у всех кнопок в админских вкладках
    const adminBtns = document.querySelectorAll('#adminTabs .tab-btn');
    adminBtns.forEach(btn => btn.classList.remove('active'));
    
    // Убираем активный класс у всех кнопок в курьерских вкладках
    const courierBtns = document.querySelectorAll('#courierTabs .tab-btn');
    courierBtns.forEach(btn => btn.classList.remove('active'));
    
    // Показываем выбранный контент и активируем кнопку
    if (tabName === 'menu' && currentUser?.role === 'admin') {
        if (menuTab) menuTab.style.display = 'block';
        if (adminBtns[0]) adminBtns[0].classList.add('active');
    } else if (tabName === 'orders') {
        if (ordersTab) ordersTab.style.display = 'block';
        if (currentUser?.role === 'admin') {
            if (adminBtns[1]) adminBtns[1].classList.add('active');
        } else {
            if (courierBtns[0]) courierBtns[0].classList.add('active');
        }
        loadAllOrders();
    } else if (tabName === 'clients' && currentUser?.role === 'admin') {
        if (clientsTab) clientsTab.style.display = 'block';
        if (adminBtns[2]) adminBtns[2].classList.add('active');
        loadAllClients();
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
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) cartCountElem.textContent = cartCount;
    
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
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = '';
        }, 200);
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            updateCartDisplay();
            modal.style.display = 'flex';
        }
    }
}

// ============ УПРАВЛЕНИЕ СТАТУСОМ КУРЬЕРА ============

async function updateCourierStatus(courierId) {
    if (!courierId) return;
    
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const allOrdersData = await response.json();
        
        const activeOrders = allOrdersData.filter(order => 
            (order.courier_id === courierId || order.courierId === courierId) && 
            order.status !== 'delivered' && 
            order.status !== 'cancelled'
        );
        
        const newStatus = activeOrders.length > 0 ? 'busy' : 'free';
        
        await fetch(`${API_BASE}/couriers/${courierId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        console.log(`Курьер ${courierId} теперь ${newStatus}`);
    } catch (error) {
        console.error('Error updating courier status:', error);
    }
}

// ============ ОФОРМЛЕНИЕ ЗАКАЗА (только для админа) ============
async function loadOrderFormData() {
    if (currentUser?.role !== 'admin') return;
    await loadAllClientsForSelect();
    await loadFreeCouriers();
}

async function loadAllClientsForSelect() {
    try {
        const response = await fetch(`${API_BASE}/clients`);
        allClients = await response.json();
        const select = document.getElementById('orderClientSelect');
        if (select) {
            select.innerHTML = '<option value="">-- Выберите клиента --</option>' + 
                allClients.map(c => `<option value="${c.id}">${c.firstName} ${c.lastName} (${c.phone})</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

async function onOrderClientChange() {
    const clientId = document.getElementById('orderClientSelect')?.value;
    const addressSelect = document.getElementById('orderAddressSelect');
    
    if (!clientId || !addressSelect) {
        if (addressSelect) addressSelect.innerHTML = '<option value="">-- Сначала выберите клиента --</option>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/addresses/client/${clientId}`);
        const addresses = await response.json();
        addressSelect.innerHTML = '<option value="">-- Выберите адрес --</option>' + 
            addresses.map(a => `<option value="${a.id}">${a.street}, ${a.house}${a.apartment ? `, кв.${a.apartment}` : ''} ${a.isMain ? '🏠' : ''}</option>`).join('');
    } catch (error) {
        console.error('Error loading addresses:', error);
    }
}

async function loadFreeCouriers() {
    try {
        const response = await fetch(`${API_BASE}/couriers/free`);
        const freeCouriers = await response.json();
        const select = document.getElementById('orderCourierSelect');
        if (select) {
            if (freeCouriers.length === 0) {
                select.innerHTML = '<option value="">-- Нет свободных курьеров --</option>';
            } else {
                select.innerHTML = '<option value="">-- Выберите курьера --</option>' + 
                    freeCouriers.map(c => `<option value="${c.id}">${c.first_name || c.firstName} ${c.last_name || c.lastName} (⭐ ${c.rating}) 🟢 свободен</option>`).join('');
            }
        }
    } catch (error) {
        console.error('Error loading free couriers:', error);
    }
}

async function checkout() {
    if (currentUser?.role !== 'admin') {
        alert('Только администратор может оформлять заказы');
        return;
    }
    
    const clientId = document.getElementById('orderClientSelect')?.value;
    const addressId = document.getElementById('orderAddressSelect')?.value;
    const courierId = document.getElementById('orderCourierSelect')?.value;
    
    if (!clientId) {
        alert('Пожалуйста, выберите клиента');
        return;
    }
    
    if (!addressId) {
        alert('Пожалуйста, выберите адрес доставки');
        return;
    }
    
    if (!courierId) {
        alert('Пожалуйста, выберите курьера (доступны только свободные)');
        return;
    }
    
    if (cart.length === 0) {
        alert('Корзина пуста');
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
        clientId: parseInt(clientId),
        addressId: parseInt(addressId),
        courierId: parseInt(courierId),
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
            await updateCourierStatus(parseInt(courierId));
            
            alert('✅ Заказ успешно оформлен!');
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            toggleCart();
            await loadAllOrders();
            await loadFreeCouriers();
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

// ============ ВСЕ ЗАКАЗЫ ============
async function loadAllOrders() {
    try {
        let url = `${API_BASE}/orders`;
        
        const response = await fetch(url);
        let orders = await response.json();
        
        // Если курьер - фильтруем только его заказы
        if (currentUser?.role === 'courier' && currentUser.courierId) {
            orders = orders.filter(o => (o.courier_id || o.courierId) === currentUser.courierId);
        }
        
        allOrders = orders;
        
        const uniqueCourierIds = [...new Set(allOrders.map(o => o.courier_id || o.courierId).filter(id => id))];
        for (const courierId of uniqueCourierIds) {
            await updateCourierStatus(courierId);
        }
        
        displayAllOrders(allOrders);
        await loadAllCouriers();
        if (currentUser?.role === 'admin') {
            await loadFreeCouriers();
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        const ordersList = document.getElementById('ordersList');
        if (ordersList) ordersList.innerHTML = '<div class="loading">❌ Ошибка загрузки заказов</div>';
    }
}

function displayAllOrders(orders) {
    const container = document.getElementById('ordersList');
    
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="loading">📋 Заказов пока нет</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const courier = allCouriers.find(c => c.id === (order.courier_id || order.courierId));
        const courierName = courier ? `${courier.first_name || courier.firstName} ${courier.last_name || courier.lastName}` : 'не назначен';
        const courierStatus = courier?.status || 'unknown';
        const courierStatusText = courierStatus === 'free' ? '🟢 свободен' : (courierStatus === 'busy' ? '🔴 занят' : '⚪ неизвестен');
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-number">${escapeHtml(order.order_number || order.orderNumber)}</span>
                    <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                    <button class="btn-small" onclick="openEditOrderModal(${order.id})">✏️ Редактировать</button>
                </div>
                <div class="order-details">
                    📅 ${new Date(order.order_date || order.orderDate).toLocaleString()}<br>
                    👤 Клиент: ID ${order.client_id || order.clientId}<br>
                    🛵 Курьер: ${courierName} (${courierStatusText})
                </div>
                <div class="order-total">💰 ${order.total_amount || order.totalAmount} ₽</div>
            </div>
        `;
    }).join('');
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

async function openEditOrderModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('editOrderId').value = orderId;
    document.getElementById('editOrderStatus').value = order.status;
    
    if (currentUser?.role === 'admin') {
        await loadAllCouriersForSelect(order.courier_id || order.courierId);
        const courierSelectGroup = document.getElementById('courierSelectGroup');
        if (courierSelectGroup) courierSelectGroup.style.display = 'block';
    } else {
        const courierSelectGroup = document.getElementById('courierSelectGroup');
        if (courierSelectGroup) courierSelectGroup.style.display = 'none';
    }
    
    const modal = document.getElementById('editOrderModal');
    if (modal) modal.style.display = 'flex';
}

async function loadAllCouriersForSelect(selectedCourierId) {
    try {
        const response = await fetch(`${API_BASE}/couriers`);
        const couriers = await response.json();
        const select = document.getElementById('editOrderCourier');
        if (select) {
            select.innerHTML = '<option value="">-- Без курьера --</option>' + 
                couriers.map(c => {
                    const statusText = c.status === 'free' ? '🟢 свободен' : (c.status === 'busy' ? '🔴 занят' : '⚪ offline');
                    const courierName = `${c.first_name || c.firstName} ${c.last_name || c.lastName}`;
                    return `<option value="${c.id}" ${c.id === selectedCourierId ? 'selected' : ''}>${courierName} (${statusText})</option>`;
                }).join('');
        }
    } catch (error) {
        console.error('Error loading couriers:', error);
    }
}

async function saveOrder() {
    const orderId = document.getElementById('editOrderId')?.value;
    const newStatus = document.getElementById('editOrderStatus')?.value;
    const newCourierId = currentUser?.role === 'admin' ? document.getElementById('editOrderCourier')?.value : null;
    
    const oldOrder = allOrders.find(o => o.id === parseInt(orderId));
    const oldCourierId = oldOrder?.courier_id || oldOrder?.courierId;
    
    try {
        await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (currentUser?.role === 'admin' && newCourierId !== (oldCourierId || '')) {
            await fetch(`${API_BASE}/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courierId: newCourierId ? parseInt(newCourierId) : null })
            });
        }
        
        if (oldCourierId) {
            await updateCourierStatus(oldCourierId);
        }
        
        if (currentUser?.role === 'admin' && newCourierId) {
            await updateCourierStatus(parseInt(newCourierId));
        }
        
        if (newStatus === 'delivered' || newStatus === 'cancelled') {
            if (currentUser?.role === 'admin' && newCourierId) {
                await updateCourierStatus(parseInt(newCourierId));
            } else if (oldCourierId) {
                await updateCourierStatus(oldCourierId);
            }
        }
        
        alert('✅ Заказ обновлён');
        closeEditOrderModal();
        await loadAllOrders();
        if (currentUser?.role === 'admin') {
            await loadFreeCouriers();
            await loadAllCouriersForSelect(newCourierId);
        }
        
    } catch (error) {
        console.error('Error saving order:', error);
        alert('❌ Ошибка при сохранении');
    }
}

function closeEditOrderModal() {
    const modal = document.getElementById('editOrderModal');
    if (modal) modal.style.display = 'none';
}

// ============ КЛИЕНТЫ (только для админа) ============
async function loadAllClients() {
    if (currentUser?.role !== 'admin') return;
    
    try {
        const response = await fetch(`${API_BASE}/clients`);
        allClients = await response.json();
        displayAllClients(allClients);
    } catch (error) {
        console.error('Error loading clients:', error);
        const clientsList = document.getElementById('clientsList');
        if (clientsList) clientsList.innerHTML = '<div class="loading">❌ Ошибка загрузки клиентов</div>';
    }
}

function displayAllClients(clients) {
    const container = document.getElementById('clientsList');
    
    if (!container) return;
    
    if (clients.length === 0) {
        container.innerHTML = '<div class="loading">👥 Клиентов пока нет</div>';
        return;
    }
    
    container.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-header">
                <strong>${escapeHtml(client.firstName)} ${escapeHtml(client.lastName)}</strong>
                <div class="client-actions">
                    <button class="btn-small" onclick="openEditClientModal(${client.id})">✏️</button>
                    <button class="btn-small" onclick="openAddressesModal(${client.id})">📍</button>
                </div>
            </div>
            <div class="client-details">
                📞 ${escapeHtml(client.phone)}<br>
                📧 ${escapeHtml(client.email || 'Не указан')}<br>
                🎁 Бонусы: ${client.loyaltyPoints}
            </div>
        </div>
    `).join('');
}

function openEditClientModal(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('editClientId').value = client.id;
    document.getElementById('editFirstName').value = client.firstName;
    document.getElementById('editLastName').value = client.lastName;
    document.getElementById('editPhone').value = client.phone;
    document.getElementById('editEmail').value = client.email || '';
    
    const modal = document.getElementById('editClientModal');
    if (modal) modal.style.display = 'flex';
}

async function saveClient() {
    const clientId = document.getElementById('editClientId')?.value;
    const data = {
        firstName: document.getElementById('editFirstName')?.value,
        lastName: document.getElementById('editLastName')?.value,
        phone: document.getElementById('editPhone')?.value,
        email: document.getElementById('editEmail')?.value || null
    };
    
    try {
        await fetch(`${API_BASE}/clients/${clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alert('✅ Клиент обновлён');
        closeEditClientModal();
        loadAllClients();
        if (currentUser?.role === 'admin') {
            loadAllClientsForSelect();
        }
    } catch (error) {
        console.error('Error saving client:', error);
        alert('❌ Ошибка при сохранении');
    }
}

function closeEditClientModal() {
    const modal = document.getElementById('editClientModal');
    if (modal) modal.style.display = 'none';
}

function showAddClientModal() {
    document.getElementById('addFirstName').value = '';
    document.getElementById('addLastName').value = '';
    document.getElementById('addPhone').value = '';
    document.getElementById('addEmail').value = '';
    const modal = document.getElementById('addClientModal');
    if (modal) modal.style.display = 'flex';
}

function closeAddClientModal() {
    const modal = document.getElementById('addClientModal');
    if (modal) modal.style.display = 'none';
}

async function addClient() {
    const data = {
        firstName: document.getElementById('addFirstName')?.value,
        lastName: document.getElementById('addLastName')?.value,
        phone: document.getElementById('addPhone')?.value,
        email: document.getElementById('addEmail')?.value || null
    };
    
    if (!data.firstName || !data.lastName || !data.phone) {
        alert('Заполните все обязательные поля');
        return;
    }
    
    try {
        await fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alert('✅ Клиент добавлен');
        closeAddClientModal();
        loadAllClients();
        if (currentUser?.role === 'admin') {
            loadAllClientsForSelect();
        }
    } catch (error) {
        console.error('Error adding client:', error);
        alert('❌ Ошибка при добавлении');
    }
}

// ============ АДРЕСА ============
async function openAddressesModal(clientId) {
    document.getElementById('newAddressClientId').value = clientId;
    await loadAddresses(clientId);
    const modal = document.getElementById('addressesModal');
    if (modal) modal.style.display = 'flex';
}

async function loadAddresses(clientId) {
    try {
        const response = await fetch(`${API_BASE}/addresses/client/${clientId}`);
        const addresses = await response.json();
        
        const container = document.getElementById('addressesList');
        if (container) {
            if (addresses.length === 0) {
                container.innerHTML = '<p>Нет адресов</p>';
            } else {
                container.innerHTML = addresses.map(addr => `
                    <div class="address-item">
                        <strong>${addr.isMain ? '🏠 Основной' : '📍 Дополнительный'}</strong>
                        <button class="btn-small" onclick="deleteAddress(${addr.id})">🗑️</button>
                        <br>${addr.street}, ${addr.house}${addr.apartment ? `, кв.${addr.apartment}` : ''}
                        ${addr.entrance ? `<br>🚪 Подъезд: ${addr.entrance}` : ''}
                        ${addr.floor ? `<br>🏢 Этаж: ${addr.floor}` : ''}
                        ${addr.comment ? `<br>📝 ${addr.comment}` : ''}
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading addresses:', error);
    }
}

async function addAddress() {
    const clientId = document.getElementById('newAddressClientId')?.value;
    const data = {
        clientId: parseInt(clientId),
        street: document.getElementById('newStreet')?.value,
        house: document.getElementById('newHouse')?.value,
        apartment: document.getElementById('newApartment')?.value || null,
        entrance: document.getElementById('newEntrance')?.value || null,
        floor: document.getElementById('newFloor')?.value || null,
        comment: document.getElementById('newComment')?.value || null,
        isMain: document.getElementById('newIsMain')?.checked || false
    };
    
    if (!data.street || !data.house) {
        alert('Заполните улицу и дом');
        return;
    }
    
    try {
        await fetch(`${API_BASE}/addresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alert('✅ Адрес добавлен');
        // Очищаем форму
        if (document.getElementById('newStreet')) document.getElementById('newStreet').value = '';
        if (document.getElementById('newHouse')) document.getElementById('newHouse').value = '';
        if (document.getElementById('newApartment')) document.getElementById('newApartment').value = '';
        if (document.getElementById('newEntrance')) document.getElementById('newEntrance').value = '';
        if (document.getElementById('newFloor')) document.getElementById('newFloor').value = '';
        if (document.getElementById('newComment')) document.getElementById('newComment').value = '';
        if (document.getElementById('newIsMain')) document.getElementById('newIsMain').checked = false;
        
        await loadAddresses(clientId);
    } catch (error) {
        console.error('Error adding address:', error);
        alert('❌ Ошибка при добавлении адреса');
    }
}

async function deleteAddress(addressId) {
    if (!confirm('Удалить адрес?')) return;
    
    try {
        await fetch(`${API_BASE}/addresses/${addressId}`, {
            method: 'DELETE'
        });
        
        alert('✅ Адрес удалён');
        const clientId = document.getElementById('newAddressClientId')?.value;
        if (clientId) await loadAddresses(clientId);
    } catch (error) {
        console.error('Error deleting address:', error);
        alert('❌ Ошибка при удалении');
    }
}

function closeAddressesModal() {
    const modal = document.getElementById('addressesModal');
    if (modal) modal.style.display = 'none';
}

// ============ ДОБАВЛЕНИЕ АДРЕСА ПРИ ЗАКАЗЕ ============
function showAddAddressModal() {
    if (document.getElementById('orderNewStreet')) document.getElementById('orderNewStreet').value = '';
    if (document.getElementById('orderNewHouse')) document.getElementById('orderNewHouse').value = '';
    if (document.getElementById('orderNewApartment')) document.getElementById('orderNewApartment').value = '';
    if (document.getElementById('orderNewEntrance')) document.getElementById('orderNewEntrance').value = '';
    if (document.getElementById('orderNewFloor')) document.getElementById('orderNewFloor').value = '';
    if (document.getElementById('orderNewComment')) document.getElementById('orderNewComment').value = '';
    if (document.getElementById('orderNewIsMain')) document.getElementById('orderNewIsMain').checked = false;
    const modal = document.getElementById('addAddressDuringOrderModal');
    if (modal) modal.style.display = 'flex';
}

function closeAddAddressDuringOrderModal() {
    const modal = document.getElementById('addAddressDuringOrderModal');
    if (modal) modal.style.display = 'none';
}

async function addAddressDuringOrder() {
    const clientId = document.getElementById('orderClientSelect')?.value;
    
    if (!clientId) {
        alert('Сначала выберите клиента');
        closeAddAddressDuringOrderModal();
        return;
    }
    
    const data = {
        clientId: parseInt(clientId),
        street: document.getElementById('orderNewStreet')?.value,
        house: document.getElementById('orderNewHouse')?.value,
        apartment: document.getElementById('orderNewApartment')?.value || null,
        entrance: document.getElementById('orderNewEntrance')?.value || null,
        floor: document.getElementById('orderNewFloor')?.value || null,
        comment: document.getElementById('orderNewComment')?.value || null,
        isMain: document.getElementById('orderNewIsMain')?.checked || false
    };
    
    if (!data.street || !data.house) {
        alert('Заполните улицу и дом');
        return;
    }
    
    try {
        await fetch(`${API_BASE}/addresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alert('✅ Адрес добавлен');
        closeAddAddressDuringOrderModal();
        await onOrderClientChange();
    } catch (error) {
        console.error('Error adding address:', error);
        alert('❌ Ошибка при добавлении адреса');
    }
}

// ============ КУРЬЕРЫ ============
async function loadAllCouriers() {
    try {
        const response = await fetch(`${API_BASE}/couriers`);
        const couriers = await response.json();
        allCouriers = couriers.map(c => ({
            id: c.id,
            first_name: c.first_name || c.firstName,
            last_name: c.last_name || c.lastName,
            phone: c.phone,
            status: c.status,
            rating: c.rating,
            vehicle: c.vehicle,
            hire_date: c.hire_date || c.hireDate
        }));
        console.log('Загружены курьеры:', allCouriers);
    } catch (error) {
        console.error('Error loading couriers:', error);
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