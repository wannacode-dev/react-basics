import './style.css';

const { useState, useEffect } = React;

// Данные изображений
const IMAGES = [
    { id: 1, url: 'https://picsum.photos/400/400?random=1', title: 'Закат в горах', author: 'Анна Иванова' },
    { id: 2, url: 'https://picsum.photos/400/400?random=2', title: 'Городской пейзаж', author: 'Иван Петров' },
    { id: 3, url: 'https://picsum.photos/400/400?random=3', title: 'Лесная тропа', author: 'Мария Сидорова' },
    { id: 4, url: 'https://picsum.photos/400/400?random=4', title: 'Морской берег', author: 'Пётр Смирнов' },
    { id: 5, url: 'https://picsum.photos/400/400?random=5', title: 'Горное озеро', author: 'Елена Козлова' },
    { id: 6, url: 'https://picsum.photos/400/400?random=6', title: 'Осенний парк', author: 'Дмитрий Волков' },
    { id: 7, url: 'https://picsum.photos/400/400?random=7', title: 'Ночной город', author: 'Ольга Морозова' },
    { id: 8, url: 'https://picsum.photos/400/400?random=8', title: 'Весенние цветы', author: 'Николай Новиков' },
    { id: 9, url: 'https://picsum.photos/400/400?random=9', title: 'Зимний лес', author: 'Татьяна Белова' },
];

function ImageGallery() {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    
    const openModal = (index) => {
        setSelectedImageIndex(index);
    };
    
    const closeModal = () => {
        setSelectedImageIndex(null);
    };
    
    const goToNext = () => {
        if (selectedImageIndex < IMAGES.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };
    
    const goToPrev = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };
    
    // Обработка клавиш клавиатуры
    useEffect(() => {
        if (selectedImageIndex === null) return;
        
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrev();
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        
        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedImageIndex]);
    
    const selectedImage = selectedImageIndex !== null ? IMAGES[selectedImageIndex] : null;
    
    return (
        <div className="gallery-container">
            <h1>📷 Фотогалерея</h1>
            
            {/* Сетка изображений */}
            <div className="gallery-grid">
                {IMAGES.map((image, index) => (
                    <div 
                        key={image.id}
                        className="gallery-item"
                        onClick={() => openModal(index)}
                    >
                        <img src={image.url} alt={image.title} />
                        <div className="gallery-item-overlay">
                            <div className="image-title">{image.title}</div>
                            <div className="image-author">📸 {image.author}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Модальное окно */}
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ✕
                        </button>
                        
                        {/* Навигация */}
                        <button 
                            className="modal-nav prev"
                            onClick={goToPrev}
                            disabled={selectedImageIndex === 0}
                        >
                            ‹
                        </button>
                        
                        <button 
                            className="modal-nav next"
                            onClick={goToNext}
                            disabled={selectedImageIndex === IMAGES.length - 1}
                        >
                            ›
                        </button>
                        
                        {/* Изображение */}
                        <img 
                            src={selectedImage.url} 
                            alt={selectedImage.title}
                            className="modal-image"
                        />
                        
                        {/* Информация */}
                        <div className="modal-info">
                            <h2>{selectedImage.title}</h2>
                            <p>📸 Автор: {selectedImage.author}</p>
                        </div>
                        
                        {/* Счетчик */}
                        <div className="image-counter">
                            {selectedImageIndex + 1} / {IMAGES.length}
                        </div>
                        
                        {/* Миниатюры */}
                        <div className="modal-thumbnails">
                            {IMAGES.map((image, index) => (
                                <img 
                                    key={image.id}
                                    src={image.url}
                                    alt={image.title}
                                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <ImageGallery />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

