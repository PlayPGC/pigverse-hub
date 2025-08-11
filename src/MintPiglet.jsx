import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PigletNFT from "./abis/PigletNFT.json";

// BNB Testnet config
const BSC_TESTNET = {
  chainId: "0x61", // 97
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  blockExplorerUrls: ["https://testnet.bscscan.com/"],
};

// Your deployed PigletNFT (testnet) address
const CONTRACT = "0xd6cAf4E60432B0A3964a58b51C2472bA8259fc1c";

export default function MintPiglet() {
  const [addr, setAddr] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  // keep UI in sync if user switches account/network
  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;

    const onAccounts = (accounts) => setAddr(accounts?.[0] || "");
    const onChain = () => window.location.reload();

    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const ensureChain = async (eth) => {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_TESTNET.chainId }],
      });
    } catch (err) {
      if (err?.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [BSC_TESTNET],
        });
      } else {
        throw err;
      }
    }
  };

  const handleConnect = async () => {
    try {
      const eth = window.ethereum;
      if (!eth) {
        setStatus("MetaMask not detected. Open this page in MetaMask’s browser.");
        // deep link for mobile
        const url = encodeURIComponent(window.location.href);
        window.location.href = `metamask://dapp/${url}`;
        return;
      }
      await ensureChain(eth);
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setAddr(accounts?.[0] || "");
      setStatus(accounts?.[0] ? "Connected ✅" : "No account selected.");
    } catch (e) {
      setStatus(e?.message || "Connection failed");
    }
  };

  const handleMint = async () => {
    setStatus("");
    setTxHash("");
    try {
      if (!addr) {
        setStatus("Connect wallet first.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const me = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT, PigletNFT.abi, signer);

      // If contract is Ownable & mint(address) is owner-only, check:
      try {
        const owner = await contract.owner();
        if (owner && owner.toLowerCase() !== me.toLowerCase()) {
          setStatus("🔴 This wallet is NOT the contract owner. Mint would revert.");
          return;
        }
      } catch {
        // owner() might not exist; ignore
      }

      setStatus("⏳ Sending transaction…");
      const tx = await contract.mint(me); // mint to connected wallet
      setStatus("⛓ Waiting for confirmation…");
      const rec = await tx.wait();

      setTxHash(rec?.hash || tx.hash);
      setStatus("🎉 Piglet minted!");
    } catch (err) {
      setStatus(err?.shortMessage || err?.reason || err?.message || "Mint failed");
    }
  };

  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* Connect section */}
      {addr ? (
        <>
          <div style={{ color: "#16a34a", fontWeight: 600 }}>✅ Wallet Connected</div>
          <small style={{ opacity: 0.9 }}>{addr.slice(0, 6)}…{addr.slice(-4)}</small>
        </>
      ) : (
        <button
          onClick={handleConnect}
          style={{ background: "#22c55e", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none" }}
        >
          Connect Wallet
        </button>
      )}

      {/* Mint button */}
      <button
        onClick={handleMint}
        style={{ padding: "10px 16px", background: "#ec4899", color: "#fff", borderRadius: 8, border: "none" }}
      >
        🐷 Mint Piglet NFT
      </button>

      {/* Status + tx link */}
      {status && <small style={{ textAlign: "center" }}>{status}</small>}
      {txHash && (
        <a
          href={`https://testnet.bscscan.com/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 14 }}
        >
          View on BscScan
        </a>
      )}
    </div>
  );
}
