import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title = "Confirm Action",
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-gray-900">{title}</h3>
                </div>

                {/* Content */}
                <div className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="border-gray-300"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className={
                            confirmVariant === "danger"
                                ? "bg-red-600 hover:bg-red-700 text-red"
                                : "bg-[#27ae60] hover:bg-[#229954] text-white"
                        }
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
