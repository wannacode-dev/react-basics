import './style.css';

const { useState } = React;

const PRODUCTS = [
    { id: 1, name: 'Ноутбук ASUS', category: 'Электроника', price: 45000, image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Ноутбук' },
    { id: 2, name: 'iPhone 15', category: 'Электроника', price: 80000, image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=iPhone' },
    { id: 3, name: 'Футболка Nike', category: 'Одежда', price: 2500, image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Футболка' },
    { id: 4, name: 'Кроссовки Adidas', category: 'Одежда', price: 7000, image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Кроссовки' },
    { id: 5, name: 'Холодильник LG', category: 'Бытовая техника', price: 35000, image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Холодильник' },
    { id: 6, name: 'Стиральная машина Samsung', category: 'Бытовая техника', price: 25000, image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Стиралка' },
];

function ProductsFilter() {
    // Создайте состояния:
    // - category (начальное значение: 'all')
    // - minPrice (начальное значение: '')
    // - maxPrice (начальное значение: '')
    // - searchQuery (начальное значение: '')
    
    const filteredProducts = PRODUCTS; // TODO: Отфильтруйте товары
    
    // Фильтрация:
    // 1. По категории (если category !== 'all')
    // 2. По минимальной цене (если minPrice не пустой)
    // 3. По максимальной цене (если maxPrice не пустой)
    // 4. По поиску (если searchQuery не пустой)
    
    return (
        <div className="products-container">
            <h1>🛍️ Интернет-магазин</h1>
            
            {/* Панель фильтров */}
            <div className="filters-panel">
                <h3>Фильтры</h3>
                
                <div className="filters-row">
                    {/* Поле поиска */}
                    {/* Выбор категории */}
                    {/* Цена от */}
                    {/* Цена до */}
                </div>
            </div>
            
            {/* Сетка товаров */}
            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <div className="product-category">{product.category}</div>
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-price">{product.price.toLocaleString()} ₽</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <ProductsFilter />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
