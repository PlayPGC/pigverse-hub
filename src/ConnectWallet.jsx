
import React, { useState } from "react";

export const ConnectWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnect = () => {
    setWalletConnected(true);
  };

  return (
    <div className="mb-6">
      {!walletConnected ? (
        <button
          onClick={handleConnect}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-green-700 font-semibold">Wallet Connected ✅</p>
      )}
    </div>
  );
};
