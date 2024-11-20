import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
}: DeleteConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangleIcon className="w-6 h-6" />
                <Dialog.Title className="text-lg font-semibold">
                  {t("wishlist.delete.confirmTitle")}
                </Dialog.Title>
              </div>

              <p className="text-gray-600 mb-6">
                {t("wishlist.delete.confirmMessage", { title: itemTitle })}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {t("wishlist.delete.cancel")}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  {t("wishlist.delete.confirm")}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
