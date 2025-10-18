import './style.css';

const { useState } = React;

function ProfileCard({ avatar, name, bio, followers, following }) {
    return (
        <div className="profile-card">
            <img 
                src={avatar}
                alt={`${name} avatar`}
                className="profile-avatar"
            />
            
            <div className="profile-info">
                <h2 className="profile-name">
                    {name}
                </h2>
                
                <p className="profile-bio">
                    {bio}
                </p>
                
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">
                            {followers.toLocaleString()}
                        </div>
                        <div className="stat-label">
                            Подписчики
                        </div>
                    </div>
                    
                    <div className="stat-item">
                        <div className="stat-value">
                            {following.toLocaleString()}
                        </div>
                        <div className="stat-label">
                            Подписки
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-container">
            <h1 className="page-title">
                👥 Наша команда
            </h1>
            
            <div className="cards-container">
                <ProfileCard 
                    avatar="https://i.pravatar.cc/300?img=1"
                    name="Анна Иванова"
                    bio="Frontend разработчик | React энтузиаст 💻"
                    followers={1234}
                    following={567}
                />
                
                <ProfileCard 
                    avatar="https://i.pravatar.cc/300?img=3"
                    name="Иван Петров"
                    bio="UI/UX дизайнер | Люблю создавать красивые интерфейсы 🎨"
                    followers={2567}
                    following={432}
                />
                
                <ProfileCard 
                    avatar="https://i.pravatar.cc/300?img=5"
                    name="Мария Сидорова"
                    bio="Backend разработчик | Node.js эксперт 🚀"
                    followers={3421}
                    following={891}
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
