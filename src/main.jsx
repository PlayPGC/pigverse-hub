import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ConnectWallet from './ConnectWallet.jsx'
import MintPiglet from './MintPiglet.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ConnectWallet />
    <MintPiglet />
  </React.StrictMode>,
)
