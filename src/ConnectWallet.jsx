import { useState } from "react";

const BSC_TESTNET = {
  chainId: "0x61", // 97
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
};

export default function ConnectWallet() {
  const [addr, setAddr] = useState("");
  const [status, setStatus] = useState("");

  const openInMetaMask = () => {
    // Deep link to MetaMask mobile with the current URL
    const url = encodeURIComponent(window.location.href);
    window.location.href = `metamask://dapp/${url}`;
  };

  const ensureChain = async (ethereum) => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_TESTNET.chainId }],
      });
    } catch (err) {
      // If the chain is not added, add it
      if (err?.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BSC_TESTNET],
        });
      } else {
        throw err;
      }
    }
  };

  const connect = async () => {
    setStatus("");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setStatus("MetaMask not detected. Opening in MetaMask browser…");
        openInMetaMask();
        return;
      }

      await ensureChain(ethereum);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.length) {
        setAddr(accounts[0]);
        setStatus("Connected ✅");
      } else {
        setStatus("No account selected.");
      }
    } catch (e) {
      setStatus(e?.message || "Connection failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <button
        onClick={connect}
        style={{ background: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none" }}
      >
        {addr ? "Wallet Connected" : "Connect Wallet"}
      </button>
      {addr && (
        <small style={{ opacity: 0.8 }}>
          {addr.slice(0, 6)}…{addr.slice(-4)}
        </small>
      )}
      {status && <small style={{ textAlign: "center" }}>{status}</small>}
    </div>
  );
}
