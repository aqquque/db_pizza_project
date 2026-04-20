require('dotenv').config();
const db = require('./app/models');

async function seed() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('🗑️  Database synced (tables recreated)');

    // === 1. ПИЦЦЫ ===
    const pizzas = await db.Pizza.bulkCreate([
      { name: 'Маргарита', description: 'Томатный соус, моцарелла, базилик', price: 450, isVegetarian: true },
      { name: 'Пепперони', description: 'Томатный соус, моцарелла, пепперони', price: 550, isVegetarian: false },
      { name: 'Гавайская', description: 'Томатный соус, моцарелла, курица, ананас', price: 600, isVegetarian: false },
      { name: 'Четыре сыра', description: 'Сливочный соус, моцарелла, пармезан, горгонзола, фета', price: 650, isVegetarian: true },
      { name: 'Мясная', description: 'Томатный соус, моцарелла, бекон, ветчина, пепперони', price: 700, isVegetarian: false }
    ]);
    console.log('✅ Pizzas added');

    // === 2. ИНГРЕДИЕНТЫ ===
    const ingredients = await db.Ingredient.bulkCreate([
      { name: 'Моцарелла', extraPrice: 100, inStock: true, calories: 280 },
      { name: 'Пепперони', extraPrice: 150, inStock: true, calories: 350 },
      { name: 'Бекон', extraPrice: 180, inStock: true, calories: 400 },
      { name: 'Ананас', extraPrice: 80, inStock: true, calories: 60 },
      { name: 'Грибы', extraPrice: 90, inStock: true, calories: 40 },
      { name: 'Оливки', extraPrice: 70, inStock: true, calories: 115 }
    ]);
    console.log('✅ Ingredients added');

    // === 3. СОЗДАЁМ MAP ДЛЯ БЫСТРОГО ПОЛУЧЕНИЯ ID ===
    const pizzaMap = {};
    pizzas.forEach(p => { pizzaMap[p.name] = p.id; });
    console.log('Pizza map:', pizzaMap);

    const ingredientMap = {};
    ingredients.forEach(i => { ingredientMap[i.name] = i.id; });
    console.log('Ingredient map:', ingredientMap);

    // === 4. СВЯЗИ ПИЦЦА-ИНГРЕДИЕНТ (ТЕПЕРЬ С ПРАВИЛЬНЫМИ ID) ===
    const pizzaIngredientsData = [
      { pizzaName: 'Маргарита', ingredientName: 'Моцарелла', quantity: 2, isRequired: true },
      { pizzaName: 'Пепперони', ingredientName: 'Моцарелла', quantity: 2, isRequired: true },
      { pizzaName: 'Пепперони', ingredientName: 'Пепперони', quantity: 3, isRequired: true },
      { pizzaName: 'Гавайская', ingredientName: 'Моцарелла', quantity: 2, isRequired: true },
      { pizzaName: 'Гавайская', ingredientName: 'Ананас', quantity: 2, isRequired: true },
      { pizzaName: 'Четыре сыра', ingredientName: 'Моцарелла', quantity: 2, isRequired: true },
      { pizzaName: 'Мясная', ingredientName: 'Моцарелла', quantity: 2, isRequired: true },
      { pizzaName: 'Мясная', ingredientName: 'Пепперони', quantity: 1, isRequired: true },
      { pizzaName: 'Мясная', ingredientName: 'Бекон', quantity: 1, isRequired: true }
    ];

    const pizzaIngredientsToCreate = pizzaIngredientsData.map(item => ({
      pizzaId: pizzaMap[item.pizzaName],
      ingredientId: ingredientMap[item.ingredientName],
      quantity: item.quantity,
      isRequired: item.isRequired
    }));

    console.log('PizzaIngredients to create:', pizzaIngredientsToCreate);

    await db.PizzaIngredient.bulkCreate(pizzaIngredientsToCreate);
    console.log('✅ Pizza-Ingredient relations added');

    // === 5. КЛИЕНТЫ ===
    const clients = await db.Client.bulkCreate([
      { firstName: 'Иван', lastName: 'Петров', phone: '+79161234567', email: 'ivan@example.com', loyaltyPoints: 150 },
      { firstName: 'Мария', lastName: 'Иванова', phone: '+79162345678', email: 'maria@example.com', loyaltyPoints: 320 },
      { firstName: 'Алексей', lastName: 'Сидоров', phone: '+79163456789', email: 'alex@example.com', loyaltyPoints: 50 }
    ]);
    console.log('✅ Clients added');

    // MAP для клиентов
    const clientMap = {};
    clients.forEach(c => { clientMap[`${c.firstName} ${c.lastName}`] = c.id; });
    console.log('Client map:', clientMap);

    // === 6. АДРЕСА ===
    const addresses = await db.Address.bulkCreate([
      { clientId: clientMap['Иван Петров'], street: 'Ленина', house: '10', apartment: '15', entrance: '2', floor: 3, isMain: true },
      { clientId: clientMap['Иван Петров'], street: 'Советская', house: '25', apartment: '7', entrance: '1', floor: 2, isMain: false },
      { clientId: clientMap['Мария Иванова'], street: 'Гагарина', house: '5', apartment: '42', entrance: '3', floor: 5, isMain: true },
      { clientId: clientMap['Алексей Сидоров'], street: 'Мира', house: '12', apartment: '8', entrance: '1', floor: 1, isMain: true }
    ]);
    console.log('✅ Addresses added');

    // MAP для адресов
    const addressMap = {};
    addresses.forEach(a => { addressMap[`${a.street} ${a.house}`] = a.id; });
    console.log('Address map:', addressMap);

    // === 7. КУРЬЕРЫ ===
    const couriers = await db.Courier.bulkCreate([
      { firstName: 'Дмитрий', lastName: 'Кузнецов', phone: '+79164567890', status: 'free', rating: 4.8, vehicle: 'auto' },
      { firstName: 'Елена', lastName: 'Соколова', phone: '+79165678901', status: 'busy', rating: 4.9, vehicle: 'bicycle' },
      { firstName: 'Сергей', lastName: 'Михайлов', phone: '+79166789012', status: 'free', rating: 4.7, vehicle: 'auto' }
    ]);
    console.log('✅ Couriers added');

    // MAP для курьеров
    const courierMap = {};
    couriers.forEach(c => { courierMap[`${c.firstName} ${c.lastName}`] = c.id; });
    console.log('Courier map:', courierMap);

    // === 8. ЗАКАЗЫ ===
    const orders = await db.Order.bulkCreate([
      { orderNumber: 'ORD-001', clientId: clientMap['Иван Петров'], addressId: addressMap['Ленина 10'], courierId: courierMap['Дмитрий Кузнецов'], totalAmount: 550, status: 'delivered', orderDate: new Date('2025-04-15 18:30:00'), deliveryTime: new Date('2025-04-15 19:00:00'), paymentMethod: 'card' },
      { orderNumber: 'ORD-002', clientId: clientMap['Мария Иванова'], addressId: addressMap['Гагарина 5'], courierId: courierMap['Елена Соколова'], totalAmount: 650, status: 'cooking', orderDate: new Date('2025-04-20 19:00:00'), paymentMethod: 'cash' },
      { orderNumber: 'ORD-003', clientId: clientMap['Алексей Сидоров'], addressId: addressMap['Мира 12'], courierId: null, totalAmount: 450, status: 'new', orderDate: new Date('2025-04-20 20:15:00'), paymentMethod: 'online' },
      { orderNumber: 'ORD-004', clientId: clientMap['Иван Петров'], addressId: addressMap['Советская 25'], courierId: courierMap['Сергей Михайлов'], totalAmount: 700, status: 'delivering', orderDate: new Date('2025-04-20 18:00:00'), paymentMethod: 'card' }
    ]);
    console.log('✅ Orders added');

    // MAP для заказов
    const orderMap = {};
    orders.forEach(o => { orderMap[o.orderNumber] = o.id; });
    console.log('Order map:', orderMap);

    // === 9. ТОВАРЫ В ЗАКАЗЕ ===
    await db.OrderItem.bulkCreate([
      { orderId: orderMap['ORD-001'], pizzaId: pizzaMap['Пепперони'], quantity: 1, priceAtOrder: 550 },
      { orderId: orderMap['ORD-002'], pizzaId: pizzaMap['Четыре сыра'], quantity: 1, priceAtOrder: 650 },
      { orderId: orderMap['ORD-003'], pizzaId: pizzaMap['Маргарита'], quantity: 1, priceAtOrder: 450 },
      { orderId: orderMap['ORD-004'], pizzaId: pizzaMap['Мясная'], quantity: 1, priceAtOrder: 700 }
    ]);
    console.log('✅ Order items added');

    console.log('\n🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Available API endpoints:');
    console.log('   GET  http://localhost:8080/api/pizzas');
    console.log('   GET  http://localhost:8080/api/pizzas/:id/ingredients');
    console.log('   GET  http://localhost:8080/api/clients');
    console.log('   GET  http://localhost:8080/api/clients/:id/orders');
    console.log('   GET  http://localhost:8080/api/orders');
    console.log('   GET  http://localhost:8080/api/orders/:id/details');
    console.log('   GET  http://localhost:8080/api/couriers/free');
    console.log('   POST http://localhost:8080/api/orders (create new order)');
    console.log('   PUT  http://localhost:8080/api/orders/:id/status (update status)');

    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();