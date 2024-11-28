import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import {
  GiftIcon,
  ListIcon,
  UsersIcon,
  ExternalLinkIcon,
  StarIcon,
  XIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionDialogPanel = motion(Dialog.Panel);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function WelcomeModal({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastLoginKey = `lastLoginTime_${userId}`;
    const lastLoginTime = localStorage.getItem(lastLoginKey);
    const currentTime = new Date().getTime();

    if (
      !lastLoginTime ||
      currentTime - parseInt(lastLoginTime) > 60 * 60 * 1000
    ) {
      setIsOpen(true);
      localStorage.setItem(lastLoginKey, currentTime.toString());
    }
  }, [userId]);

  const features = [
    {
      icon: ListIcon,
      title: t("welcome.createList.title"),
      description: t("welcome.createList.description"),
    },
    {
      icon: UsersIcon,
      title: t("welcome.viewLists.title"),
      description: t("welcome.viewLists.description"),
    },
    {
      icon: ExternalLinkIcon,
      title: t("welcome.shopping.title"),
      description: t("welcome.shopping.description"),
    },
    {
      icon: StarIcon,
      title: t("welcome.priority.title"),
      description: t("welcome.priority.description"),
    },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
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

        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <MotionDialogPanel className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 sm:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <GiftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                    <Dialog.Title className="text-xl sm:text-3xl font-bold text-gray-900">
                      {t("app.title")}
                    </Dialog.Title>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-500 rounded-full"
                  >
                    <XIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="mb-6 sm:mb-8 space-y-3"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="p-3 sm:p-6 rounded-xl bg-gray-50 border-2 border-gray-100"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white text-base sm:text-lg font-medium rounded-xl shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-200"
                  >
                    {t("welcome.getStarted")}
                  </motion.button>
                </motion.div>
              </div>
            </MotionDialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
