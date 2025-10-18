import './style.css';

const { useState } = React;

const PRODUCTS = [
    { id: 1, name: 'Ноутбук ASUS', category: 'Электроника', price: 45000, image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Ноутбук' },
    { id: 2, name: 'iPhone 15', category: 'Электроника', price: 80000, image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=iPhone' },
    { id: 3, name: 'Футболка Nike', category: 'Одежда', price: 2500, image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Футболка' },
    { id: 4, name: 'Кроссовки Adidas', category: 'Одежда', price: 7000, image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Кроссовки' },
    { id: 5, name: 'Холодильник LG', category: 'Бытовая техника', price: 35000, image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Холодильник' },
    { id: 6, name: 'Стиральная машина Samsung', category: 'Бытовая техника', price: 25000, image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Стиралка' },
    { id: 7, name: 'Наушники Sony', category: 'Электроника', price: 8000, image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Наушники' },
    { id: 8, name: 'Джинсы Levi\'s', category: 'Одежда', price: 5500, image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Джинсы' },
    { id: 9, name: 'Микроволновка', category: 'Бытовая техника', price: 6000, image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Микроволновка' },
];

function ProductsFilter() {
    const [category, setCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
        const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSearch;
    });
    
    const resetFilters = () => {
        setCategory('all');
        setMinPrice('');
        setMaxPrice('');
        setSearchQuery('');
    };
    
    return (
        <div className="products-container">
            <h1>🛍️ Интернет-магазин</h1>
            
            {/* Панель фильтров */}
            <div className="filters-panel">
                <h3>Фильтры</h3>
                
                <div className="filters-row">
                    <div className="filter-group">
                        <label>Поиск по названию:</label>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Введите название..."
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Категория:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">Все категории</option>
                            <option value="Электроника">Электроника</option>
                            <option value="Одежда">Одежда</option>
                            <option value="Бытовая техника">Бытовая техника</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Цена от:</label>
                        <input 
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Цена до:</label>
                        <input 
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="100000"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>&nbsp;</label>
                        <button onClick={resetFilters} className="reset-button">
                            Сбросить фильтры
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Информация о результатах */}
            <div className="products-info">
                <div>Найдено товаров: <strong>{filteredProducts.length}</strong></div>
                <div>Всего товаров: <strong>{PRODUCTS.length}</strong></div>
            </div>
            
            {/* Сетка товаров */}
            <div className="products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="empty-results">
                        <p>🔍</p>
                        <p>Товары не найдены</p>
                        <p>Попробуйте изменить фильтры</p>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <div className="product-info">
                                <div className="product-category">{product.category}</div>
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">{product.price.toLocaleString()} ₽</div>
                            </div>
                        </div>
                    ))
                )}
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
