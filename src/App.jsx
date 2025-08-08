import React from "react";
import ConnectWallet from "./ConnectWallet";
import MintPiglet from "./MintPiglet";

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🐷 Welcome to PigVerse Hub</h1>
      <p>This is your React-powered frontend for NFT minting.</p>

      <div style={{ marginTop: '2rem' }}>
        <ConnectWallet />
        <MintPiglet />
      </div>
    </div>
  );
}

export default App;
