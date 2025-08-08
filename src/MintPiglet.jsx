import React, { useState } from "react";

const MintPiglet = () => {
  const [minted, setMinted] = useState(false);

  const handleMint = () => {
    setMinted(true);
  };

  return (
    <div>
      {!minted ? (
        <button
          onClick={handleMint}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Mint Piglet NFT
        </button>
      ) : (
        <p className="text-pink-700 font-semibold mt-2">
          🐷 Piglet Minted Successfully!
        </p>
      )}
    </div>
  );
};

export default MintPiglet;
