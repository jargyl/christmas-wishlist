import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import { PlusIcon, XIcon } from "lucide-react";

interface AddWishlistItemProps {
  userId: string;
  onAdd: () => void;
}

export default function AddWishlistItem({ userId, onAdd }: AddWishlistItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    link: "",
    is_priority: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("wishlist_items").insert([
        {
          user_id: userId,
          title: formData.title,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          link: formData.link || null,
          is_priority: formData.is_priority,
        },
      ]);

      if (error) throw error;

      toast.success(t("messages.itemAdded"));
      setFormData({
        title: "",
        description: "",
        price: "",
        link: "",
        is_priority: false,
      });
      setIsOpen(false);
      onAdd();
    } catch (error: any) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 border-2 border-dashed border-red-200 rounded-xl text-red-600 hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="font-medium">{t("wishlist.addWish")}</span>
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => !loading && setIsOpen(false)} className="relative z-50">
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
              <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {t("wishlist.addWish")}
                  </Dialog.Title>
                  <button
                    onClick={() => !loading && setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("wishlist.title")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2.5"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("wishlist.description")}
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2.5"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("wishlist.price")} in €
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2.5"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("wishlist.link")}
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2.5"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_priority}
                        onChange={(checked) =>
                          setFormData({ ...formData, is_priority: checked })
                        }
                        onColor="#dc2626"
                        offColor="#d1d5db"
                        checkedIcon={false}
                        uncheckedIcon={false}
                        height={24}
                        width={48}
                        handleDiameter={20}
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {t("wishlist.priority")}
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => !loading && setIsOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {t("wishlist.actions.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? t("wishlist.actions.adding") : t("wishlist.actions.add")}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}