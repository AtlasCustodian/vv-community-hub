"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--color-foreground)", textAlign: "center", marginBottom: 20 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onConfirm}
            className="btn-stone px-6 py-2 text-sm font-semibold uppercase tracking-wider"
            style={{ borderColor: "rgba(248, 113, 113, 0.4)", color: "#f87171" }}
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="btn-stone px-6 py-2 text-sm font-semibold uppercase tracking-wider"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
