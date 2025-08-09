import React from "react";

export default function ProofBadge() {
  const cid = "bafkreiak7pgua22cl5ugjnjvfogy26dpibtcmbltuswai2c7m3ukfeo7fq";
  const tx = "0x76c925425594a82377b6cc717a7018704a0b09c8779bf7fa4d9fd9c53e899c7e";
  const sha = "0afbcd406b425f6864b5352b8d8d786f4066260573a4ac04685f66e8a291df2c";
  const timestamp = "Aug-09-2025 01:19:30 PM UTC";

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-gray-700">Proof of Ownership</span>
      </div>

      <div className="grid gap-2 text-sm text-gray-700">
        <div className="flex justify-between gap-3">
          <span className="font-medium">Timestamp:</span>
          <span className="text-right">{timestamp}</span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="font-medium">SHA-256:</span>
          <code className="truncate text-xs">{sha}</code>
        </div>

        <div className="flex justify-between gap-3">
          <span className="font-medium">IPFS CID:</span>
          <a
            className="truncate text-xs text-blue-600 underline"
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank" rel="noreferrer"
          >
            {cid}
          </a>
        </div>

        <div className="flex justify-between gap-3">
          <span className="font-medium">TX (BSC):</span>
          <a
            className="truncate text-xs text-blue-600 underline"
            href={`https://bscscan.com/tx/${tx}`}
            target="_blank" rel="noreferrer"
          >
            {tx}
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`https://github.com/PlayPGC/pigverse-hub/releases`}
          target="_blank" rel="noreferrer"
          className="rounded-full border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View GitHub Release
        </a>
        <a
          href={`https://bscscan.com/tx/${tx}`}
          target="_blank" rel="noreferrer"
          className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Verify on BscScan
        </a>
      </div>
    </div>
  );
}
