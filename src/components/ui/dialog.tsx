"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  close,
  children,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  description?: string;
  close: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="dialog-content"
          aria-describedby={description ? "sheet-description" : undefined}
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus.current?.isConnected) returnFocus.current.focus();
          }}
        >
          <motion.div
            initial={reduced ? false : { y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.16 }}
          >
            <div className="dialog-header">
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Close className="icon-button" aria-label={close}>
                <X size={21} />
              </Dialog.Close>
            </div>
            {description ? (
              <Dialog.Description id="sheet-description">
                {description}
              </Dialog.Description>
            ) : null}
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
