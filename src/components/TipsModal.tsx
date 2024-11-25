import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLinkIcon, ListIcon, StarIcon } from "lucide-react";

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TipsModal({ isOpen, onClose }: TipsModalProps) {
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
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                {t("help.quickTips")}
              </Dialog.Title>

              <div className="space-y-4">
                <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                  <div className="flex items-center gap-4">
                    <ListIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-accent-foreground font-medium">
                      {t("help.tips.addWish")}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                  <div className="flex items-center gap-4">
                    <ExternalLinkIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-accent-foreground font-medium">
                      {t("help.tips.clickLinks")}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                  <div className="flex items-center gap-4">
                    <StarIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-accent-foreground font-medium">
                      {t("help.tips.priority")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
