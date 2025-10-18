import './style.css';

const { useState, useEffect } = React;

// Данные стран
const COUNTRIES = [
    { id: 1, name: 'Россия', capital: 'Москва', population: '146 млн', continent: 'Европа', flag: '🇷🇺' },
    { id: 2, name: 'США', capital: 'Вашингтон', population: '331 млн', continent: 'Северная Америка', flag: '🇺🇸' },
    { id: 3, name: 'Китай', capital: 'Пекин', population: '1.4 млрд', continent: 'Азия', flag: '🇨🇳' },
    { id: 4, name: 'Япония', capital: 'Токио', population: '126 млн', continent: 'Азия', flag: '🇯🇵' },
    { id: 5, name: 'Германия', capital: 'Берлин', population: '83 млн', continent: 'Европа', flag: '🇩🇪' },
    { id: 6, name: 'Франция', capital: 'Париж', population: '67 млн', continent: 'Европа', flag: '🇫🇷' },
    { id: 7, name: 'Великобритания', capital: 'Лондон', population: '67 млн', continent: 'Европа', flag: '🇬🇧' },
    { id: 8, name: 'Италия', capital: 'Рим', population: '60 млн', continent: 'Европа', flag: '🇮🇹' },
    { id: 9, name: 'Бразилия', capital: 'Бразилиа', population: '213 млн', continent: 'Южная Америка', flag: '🇧🇷' },
    { id: 10, name: 'Австралия', capital: 'Канберра', population: '26 млн', continent: 'Австралия', flag: '🇦🇺' },
];

function SearchWithAutocomplete() {
    // Создайте состояния:
    // - searchQuery (строка для поискового запроса)
    // - suggestions (массив подсказок для автокомплита)
    // - showSuggestions (показывать ли выпадающий список)
    // - filteredCountries (отфильтрованный список стран)
    // - isSearching (индикатор поиска)
    
    // Используйте useEffect с debounce:
    useEffect(() => {
        // Если searchQuery пустой - очистите все
        
        // Установите isSearching в true
        
        // Создайте таймер с задержкой 300мс:
        const timer = setTimeout(() => {
            // Отфильтруйте COUNTRIES по searchQuery
            // Ищите совпадения в name или capital (toLowerCase)
            
            // Установите suggestions (первые 5 результатов)
            // Установите filteredCountries (все результаты)
            // Установите isSearching в false
        }, 300);
        
        // Cleanup: очистите таймер
        return () => clearTimeout(timer);
    }, [searchQuery]);
    
    const handleInputChange = (e) => {
        // Обновите searchQuery
        // Покажите suggestions
    };
    
    const handleSuggestionClick = (countryName) => {
        // Установите searchQuery в выбранное название
        // Скройте suggestions
    };
    
    return (
        <div className="search-container">
            <h1>🌍 Поиск стран</h1>
            
            <p className="search-hint">
                Введите название страны или столицы
            </p>
            
            {/* Поисковая строка */}
            <div className="search-box">
                <input 
                    type="text"
                    value={''} // searchQuery
                    onChange={handleInputChange}
                    placeholder="Начните вводить название..."
                    className="search-input"
                />
                
                <div className="search-icon">🔍</div>
                
                {/* TODO: Добавьте выпадающий список автокомплита */}
                {/* Используйте класс "autocomplete-dropdown" */}
                {/* Отобразите suggestions, если showSuggestions === true */}
            </div>
            
            {/* Результаты */}
            <div className="search-results">
                {/* Если searchQuery пустой - покажите "Начните поиск" */}
                {/* Если ничего не найдено - покажите "Ничего не найдено" */}
                {/* Иначе - покажите filteredCountries */}
                
                <div className="empty-state">
                    <div className="icon">🌐</div>
                    <h3>Начните поиск</h3>
                    <p>Введите название страны или столицы в поле выше</p>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <SearchWithAutocomplete />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

