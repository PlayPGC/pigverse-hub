import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PigletNFT from "./abis/PigletNFT.json";

// BNB Testnet configuration
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

  // Keep UI in sync if user switches account/network
  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;

    const onAccounts = (accounts) => setAddr(accounts[0] || "");
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
      if (err.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [BSC_TESTNET],
        });
      } else {
        throw err;
      }
    }
  };

  const connectWallet = async () => {
    const eth = window.ethereum;
    if (!eth) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      await ensureChain(eth);
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setAddr(accounts[0] || "");
    } catch (err) {
      console.error(err);
    }
  };

  const mintPiglet = async () => {
    if (!addr) {
      alert("Connect wallet first!");
      return;
    }
    const eth = window.ethereum;
    if (!eth) return;

    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT, PigletNFT.abi, signer);

    try {
      setStatus("Minting Piglet...");
      const tx = await contract.safeMint(addr);
      await tx.wait();
      setTxHash(tx.hash);
      setStatus("Piglet Minted Successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Minting failed. See console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>🐷 Welcome to PigVerse Hub</h2>
      <p>This is your React-powered frontend for NFT minting.</p>

      {addr ? (
        <p>✅ Wallet Connected: {addr}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      <br />
      <button onClick={mintPiglet}>Mint Piglet</button>

      {status && <p>{status}</p>}
      {txHash && (
        <p>
          View TX:{" "}
          <a
            href={`https://testnet.bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}
