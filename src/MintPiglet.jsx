import { useState } from "react";
import { ethers } from "ethers";
import PigletNFT from "./abis/PigletNFT.json";

// PigletNFT on BNB Testnet (your deployed address)
const CONTRACT = "0xd6cAf4E60432B0A3964a58b51C2472bA8259fc1c";

export default function MintPiglet() {
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  const ensureWallet = async () => {
    if (!window.ethereum) throw new Error("Please install MetaMask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const handleMint = async () => {
    setStatus("");
    setTxHash("");
    try {
      await ensureWallet();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const me = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT, PigletNFT.abi, signer);

      // ⚠️ Contract requires the OWNER to call mint(address)
      // We check and warn to avoid a revert
      try {
        const owner = await contract.owner();
        if (owner && owner.toLowerCase() !== me.toLowerCase()) {
          setStatus("🔴 This wallet is NOT the contract owner. Mint would fail.");
          return;
        }
      } catch {
        // owner() might not exist on some ABIs; ignore
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
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <button
        onClick={handleMint}
        style={{ padding: "10px 16px", background: "#ec4899", color: "#fff", borderRadius: 8, border: "none" }}
      >
        🐷 Mint Piglet NFT
      </button>

      {status && <p style={{ fontSize: 14, textAlign: "center" }}>{status}</p>}

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
