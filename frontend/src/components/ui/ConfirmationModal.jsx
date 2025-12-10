import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  confirmButtonClass = "bg-bmRed hover:bg-red-700 text-white",
  cancelText = "Cancel",
  isLoading = false,
  loadingText = "Processing...",
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-bmBlack font-lexend mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000] ${confirmButtonClass}`}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
