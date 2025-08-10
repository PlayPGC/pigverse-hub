import { useState } from "react";
import { ethers } from "ethers";
import PigletNFT from "./abis/PigletNFT.json";

const PIGLET_NFT_CONTRACT_ADDRESS = "0xd6cAf4E60432B0A3964a58b51C2472bA8259fc1c"; // Testnet deployed contract address

export const MintPiglet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (err) {
        console.error("User rejected wallet connection", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleMint = async () => {
    if (!walletConnected || !window.ethereum) {
      alert("Connect wallet first");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PIGLET_NFT_CONTRACT_ADDRESS,
        PigletNFT.abi,
        signer
      );

      const tx = await contract.mint();
      await tx.wait();
      setMinted(true);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  return (
    <div className="p-4 text-center">
      {!walletConnected ? (
        <button
          onClick={handleConnect}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Connect Wallet
        </button>
      ) : !minted ? (
        <button
          onClick={handleMint}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Mint Piglet NFT
        </button>
      ) : (
        <p className="text-lg font-semibold mt-4">🐷 Piglet Minted Successfully!</p>
      )}
    </div>
  );
};

export default MintPiglet;
