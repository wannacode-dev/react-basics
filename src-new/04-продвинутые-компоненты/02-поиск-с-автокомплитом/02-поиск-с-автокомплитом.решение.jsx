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
    { id: 11, name: 'Индия', capital: 'Нью-Дели', population: '1.4 млрд', continent: 'Азия', flag: '🇮🇳' },
    { id: 12, name: 'Канада', capital: 'Оттава', population: '38 млн', continent: 'Северная Америка', flag: '🇨🇦' },
    { id: 13, name: 'Мексика', capital: 'Мехико', population: '129 млн', continent: 'Северная Америка', flag: '🇲🇽' },
    { id: 14, name: 'Испания', capital: 'Мадрид', population: '47 млн', continent: 'Европа', flag: '🇪🇸' },
    { id: 15, name: 'Южная Корея', capital: 'Сеул', population: '52 млн', continent: 'Азия', flag: '🇰🇷' },
];

function SearchWithAutocomplete() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    // Debounce для поиска - задержка 300мс
    useEffect(() => {
        if (searchQuery.length === 0) {
            setSuggestions([]);
            setFilteredCountries([]);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        
        // Имитация задержки поиска (debounce)
        const timer = setTimeout(() => {
            const query = searchQuery.toLowerCase();
            
            // Поиск по названию или столице
            const filtered = COUNTRIES.filter(country => 
                country.name.toLowerCase().includes(query) ||
                country.capital.toLowerCase().includes(query)
            );
            
            setSuggestions(filtered.slice(0, 5)); // Максимум 5 подсказок
            setFilteredCountries(filtered);
            setIsSearching(false);
        }, 300);
        
        // Cleanup - очищаем таймер при новом вводе
        return () => clearTimeout(timer);
    }, [searchQuery]);
    
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(true);
    };
    
    const handleSuggestionClick = (countryName) => {
        setSearchQuery(countryName);
        setShowSuggestions(false);
    };
    
    const highlightMatch = (text, query) => {
        if (!query) return text;
        
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;
        
        return (
            <>
                {text.substring(0, index)}
                <span className="highlight">
                    {text.substring(index, index + query.length)}
                </span>
                {text.substring(index + query.length)}
            </>
        );
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
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Начните вводить название..."
                    className="search-input"
                />
                
                {isSearching ? (
                    <div className="loading-indicator">⏳</div>
                ) : (
                    <div className="search-icon">🔍</div>
                )}
                
                {/* Автокомплит */}
                {showSuggestions && suggestions.length > 0 && searchQuery.length > 0 && (
                    <div className="autocomplete-dropdown">
                        {suggestions.map(country => (
                            <div 
                                key={country.id}
                                className="autocomplete-item"
                                onClick={() => handleSuggestionClick(country.name)}
                            >
                                <span>{country.flag}</span>
                                <span>
                                    {highlightMatch(country.name, searchQuery)}
                                    {' • '}
                                    {highlightMatch(country.capital, searchQuery)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Результаты */}
            <div className="search-results">
                {searchQuery.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🌐</div>
                        <h3>Начните поиск</h3>
                        <p>Введите название страны или столицы в поле выше</p>
                    </div>
                ) : filteredCountries.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">😔</div>
                        <h3>Ничего не найдено</h3>
                        <p>Попробуйте изменить запрос</p>
                    </div>
                ) : (
                    <>
                        <div className="results-header">
                            Найдено: <strong>{filteredCountries.length}</strong> {
                                filteredCountries.length === 1 ? 'страна' :
                                filteredCountries.length < 5 ? 'страны' : 'стран'
                            }
                        </div>
                        
                        <div className="countries-list">
                            {filteredCountries.map(country => (
                                <div key={country.id} className="country-item">
                                    <div className="country-header">
                                        <div className="country-flag">{country.flag}</div>
                                        <h2 className="country-name">{country.name}</h2>
                                    </div>
                                    <div className="country-info">
                                        <div className="info-item">
                                            <span className="info-label">Столица:</span>
                                            <span>{country.capital}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Население:</span>
                                            <span>{country.population}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Континент:</span>
                                            <span>{country.continent}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
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

