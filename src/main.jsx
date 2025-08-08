import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ConnectWallet from './ConnectWallet.jsx'
import MintPiglet from './MintPiglet.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ConnectWallet />
    <App />
    <MintPiglet />
  </React.StrictMode>
)
