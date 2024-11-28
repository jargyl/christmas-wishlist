import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLinkIcon, ListIcon, StarIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MotionDialogPanel = motion(Dialog.Panel);

export default function TipsModal({ isOpen, onClose }: TipsModalProps) {
  const { t } = useTranslation();

  const tipItems = [
    {
      icon: ListIcon,
      text: t("help.tips.addWish"),
    },
    {
      icon: ExternalLinkIcon,
      text: t("help.tips.clickLinks"),
    },
    {
      icon: StarIcon,
      text: t("help.tips.priority"),
    },
  ];

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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
            <MotionDialogPanel
              className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  {t("help.quickTips")}
                </Dialog.Title>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-500 rounded-full"
                >
                  <XIcon className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {tipItems.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-gray-50 border-2 border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <tip.icon className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <p className="text-base text-gray-700 font-medium">
                        {tip.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </MotionDialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
