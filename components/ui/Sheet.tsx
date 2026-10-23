"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Accessible modal sheet built on the native <dialog> element, which gives us
 * focus containment, ESC to close and a backdrop for free.
 */
export function Sheet({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "top";
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const position = {
    right: "ml-auto h-dvh max-h-dvh w-[min(26rem,100vw)]",
    left: "mr-auto h-dvh max-h-dvh w-[min(22rem,90vw)]",
    top: "mx-auto mt-0 max-h-[85dvh] w-full max-w-2xl sm:mt-16 sm:rounded-(--radius-card)",
  }[side];

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-0 max-w-none bg-white p-0 text-ink ${position}`}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-xl font-bold uppercase">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 flex size-11 items-center justify-center rounded-md hover:bg-surface"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line p-4 pb-safe">{footer}</div>}
      </div>
    </dialog>
  );
}
