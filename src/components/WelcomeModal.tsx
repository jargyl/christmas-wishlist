import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { GiftIcon, ListIcon, UsersIcon, ExternalLinkIcon } from 'lucide-react';

export default function WelcomeModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

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
            <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
              <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <GiftIcon className="w-8 h-8 text-red-600" />
                {t('app.title')}
              </Dialog.Title>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <ListIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('welcome.createList.title')}</h3>
                    <p className="text-gray-600">{t('welcome.createList.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UsersIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('welcome.viewLists.title')}</h3>
                    <p className="text-gray-600">{t('welcome.viewLists.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ExternalLinkIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('welcome.shopping.title')}</h3>
                    <p className="text-gray-600">{t('welcome.shopping.description')}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('welcome.getStarted')}
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}