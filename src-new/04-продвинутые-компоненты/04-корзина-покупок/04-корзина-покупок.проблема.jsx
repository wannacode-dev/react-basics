import './style.css';

const { useState } = React;

// Данные товаров
const PRODUCTS = [
    { id: 1, name: 'Ноутбук ASUS', description: 'Intel Core i7, 16GB RAM', price: 75000, image: 'https://via.placeholder.com/100/3b82f6/ffffff?text=Ноутбук' },
    { id: 2, name: 'Клавиатура механическая', description: 'RGB подсветка', price: 8500, image: 'https://via.placeholder.com/100/10b981/ffffff?text=Клавиатура' },
    { id: 3, name: 'Мышь беспроводная', description: 'Logitech MX Master 3', price: 7200, image: 'https://via.placeholder.com/100/f59e0b/ffffff?text=Мышь' },
    { id: 4, name: 'Монитор 27"', description: '2K, 144Hz, IPS', price: 32000, image: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=Монитор' },
];

function ShoppingCart() {
    // Создайте состояние cart (массив товаров в корзине)
    // Каждый элемент: { ...product, quantity: число }
    
    const addToCart = (product) => {
        // Проверьте, есть ли товар в корзине (find)
        // Если есть - увеличьте quantity (map)
        // Если нет - добавьте с quantity: 1
    };
    
    const incrementQuantity = (productId) => {
        // Увеличьте quantity для товара с данным id
        // Используйте map
    };
    
    const decrementQuantity = (productId) => {
        // Уменьшите quantity для товара с данным id
        // Минимум 1
    };
    
    const removeFromCart = (productId) => {
        // Удалите товар из корзины
        // Используйте filter
    };
    
    // Вычисления:
    // - totalItems = сумма всех quantity (reduce)
    // - subtotal = сумма (price * quantity) для всех товаров (reduce)
    // - shipping = 500 если корзина не пустая, иначе 0
    // - total = subtotal + shipping
    
    return (
        <div className="shop-container">
            <h1>🛒 Интернет-магазин</h1>
            
            <div className="shop-layout">
                {/* Список товаров */}
                <div className="products-section">
                    <h2>Каталог товаров</h2>
                    <div className="products-list">
                        {PRODUCTS.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} className="product-image" />
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-price">
                                        {product.price.toLocaleString()} ₽
                                    </div>
                                </div>
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="add-to-cart-button"
                                >
                                    В корзину
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Корзина */}
                <div className="cart-section">
                    <h2>Корзина</h2>
                    
                    {/* Если корзина пуста - покажите "Корзина пуста" */}
                    {/* Иначе - покажите товары и итоговую информацию */}
                    
                    <div className="cart-empty">
                        <div className="icon">🛒</div>
                        <p>Корзина пуста</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <ShoppingCart />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

