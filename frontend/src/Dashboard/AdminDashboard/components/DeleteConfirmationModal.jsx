"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal>
            {/* Overlay */}
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Content asChild>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md bg-zinc-900 rounded-xl p-6 shadow-2xl text-white space-y-6"
                >
                  {/* Visually Hidden Title for Screen Readers */}
                  <Dialog.Title asChild>
                    <VisuallyHidden>Delete {itemType}</VisuallyHidden>
                  </Dialog.Title>

                  {/* Visible Heading */}
                  <h2 className="text-lg font-semibold">
                    Are you absolutely sure?
                  </h2>

                  {/* Description */}
                  <Dialog.Description asChild>
                    <p className="text-sm text-zinc-400">
                      This action cannot be undone. This will permanently delete
                      this {itemType.toLowerCase()} and remove all its data from
                      our servers.
                    </p>
                  </Dialog.Description>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4">
                    <Dialog.Close asChild>
                      <button
                        className="text-sm text-zinc-300 hover:text-white transition"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>

                    <button
                      className="text-sm bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition"
                      onClick={onConfirm}
                    >
                      Yes, delete {itemType.toLowerCase()}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
