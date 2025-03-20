import React, { useState, useEffect } from 'react';
import './App.css';
import { ConnectModal, SuiClientProvider, useCurrentAccount, WalletProvider, useConnectWallet } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') }
};

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const currentAccount = useCurrentAccount();
  const { isPending } = useConnectWallet();
	const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:00');
  const [gameMode, setGameMode] = useState('data'); // 'data' or 'game'
  const [score, setScore] = useState(0);
  const [coinData] = useState([
    { name: 'DOGE', price: '$0.15', change: '+5.2%' },
    { name: 'SHIB', price: '$0.00001', change: '-2.1%' },
    { name: 'PEPE', price: '$0.0000001', change: '+12.5%' },
    { name: 'BONK', price: '$0.00002', change: '+8.3%' },
    { name: 'KAMO', price: '$0.00003', change: '+10.0%' },
  ]);

  const memeImages = [
    '/kamo_meme0.PNG',
    '/kamo_meme1.PNG',
    '/kamo_meme2.PNG',
    '/kamo_meme3.PNG',
    '/kamo_meme4.png'
  ];

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to get random rotation
  const getRandomRotation = () => {
    const rotations = [-5, -3, 0, 3, 5];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  // Function to handle app entry
  const handleEnterGame = () => {
    setGameMode('game');
    setScore(0);
  };

  // Function to handle tap
  const handleTap = () => {
    if (gameMode === 'game') {
      setScore(prev => prev + 1);
    }
  };

  // Function to render meme items
  const renderMemeItems = () => {
    const items = [];
    const totalSlots = 16;

    for (let i = 0; i < totalSlots; i++) {
      const memeIndex = i % memeImages.length;
      const rotation = getRandomRotation();
      
      items.push(
        <div 
          key={i} 
          className="meme-item"
          style={{ '--random-rotation': `${rotation}deg` } as React.CSSProperties}
        >
          <img 
            src={memeImages[memeIndex]} 
            alt={`Kamo Meme ${memeIndex}`}
            loading="lazy"
          />
        </div>
      );
    }
    return items;
  };

  const renderPhoneContent = () => {
    if (gameMode === 'data') {
      return (
        <>
          <div className="coin-list">
            {coinData.map((coin, index) => (
              <div key={index} className="coin-item">
                <div className="coin-info">
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-price">{coin.price}</span>
                </div>
                <span className={`coin-change ${coin.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {coin.change}
                </span>
              </div>
            ))}
          </div>
          <button className="enter-app-button" onClick={handleEnterGame}>
            Play to Earn
          </button>
        </>
      );
    } else {
      return (
        <div className="game-container" onClick={handleTap}>
          <div className="score-display">Score: {score}</div>
          <div className="tap-area">
            <div className="tap-text">Tap to Earn $KAMO!</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="meme-container">
        <div className="meme-grid">
          {/* Top row */}
          {renderMemeItems().slice(0, 5)}

          {/* Second row */}
          {renderMemeItems().slice(5, 7)}
          <div className="main-screen">
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-content">
                <div className="phone-header">
                  <h2>Meme Coin Tracker</h2>
                  <span className="time">{currentTime}</span>
                </div>
                <div className="wallet-connect">
                  <ConnectModal
                    trigger={
                      <button 
                        className="connect-trigger-button"
                        disabled={isPending}
                        onClick={() => setIsModalOpen(true)}
                      >
                        {currentAccount ? (
                          <span className="connected-address">
                            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
                          </span>
                        ) : (
                          'Connect Wallet'
                        )}
                      </button>
                    }
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                  />
                </div>
                {renderPhoneContent()}
                <div className="phone-footer">
                  <div className="footer-icon">📊</div>
                  <div className="footer-icon">💎</div>
                  <div className="footer-icon">⚙️</div>
                </div>
              </div>
            </div>
          </div>
          {renderMemeItems().slice(7, 9)}

          {/* Fourth row */}
          {renderMemeItems().slice(9, 14)}

          {/* Bottom row */}
          {renderMemeItems().slice(14, 16)}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
