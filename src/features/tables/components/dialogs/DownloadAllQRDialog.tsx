import React, { useState } from "react";

interface Props {
    onClose: () => void;
    onDownloadZip: () => void;
}

export function DownloadAllQRDialog({ onClose, onDownloadZip }: Props) {
    const [type, setType] = useState<"zip" | "pdf">("zip");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[360px]">
                <h3 className="text-lg mb-4">Download All QR Codes</h3>

                <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={type === "zip"}
                            onChange={() => setType("zip")}
                        />
                        ZIP (.png files)
                    </label>

                    <label className="flex items-center gap-2 text-gray-400">
                        <input type="radio" disabled />
                        PDF (Coming soon)
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (type === "zip") onDownloadZip();
                            onClose();
                        }}
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
