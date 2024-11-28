import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { WishlistItem, User } from "../types";
import { XIcon, EditIcon, Trash2Icon, ExternalLinkIcon, StarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserAvatar from "./UserAvatar";
import Switch from "react-switch";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

interface WishDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem;
  user?: User;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

export default function WishDetailsModal({
  isOpen,
  onClose,
  item,
  user,
  canEdit,
  onDelete,
  onUpdate,
}: WishDetailsModalProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item.title || "",
    description: item.description || "",
    price: item.price ? item.price.toString() : "",
    link: item.link || "",
    is_priority: Boolean(item.is_priority),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("wishlist_items")
        .update({
          title: formData.title,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          link: formData.link || null,
          is_priority: formData.is_priority,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast.success(t("messages.itemUpdated"));
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setIsEditing(false);
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
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
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {user && <UserAvatar user={user} size="sm" />}
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {isEditing ? t("wishlist.actions.edit") : (user ? t("wishlist.possessiveWish", { username: user.username }) : item.title)}
                  </Dialog.Title>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={loading}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("wishlist.title")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={loading}
                      >
                        {t("wishlist.actions.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {loading ? t("wishlist.actions.saving") : t("wishlist.actions.save")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.title}
                        </h3>
                        {item.is_priority && (
                          <StarIcon className="w-5 h-5 text-red-500 fill-red-500" />
                        )}
                      </div>

                      {item.description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            {t("wishlist.description")}
                          </h4>
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {item.description}
                          </p>
                        </div>
                      )}

                      {item.price && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            {t("wishlist.price")}
                          </h4>
                          <p className="text-lg font-semibold text-green-700">
                            €{item.price.toFixed(2)}
                          </p>
                        </div>
                      )}

                      {item.link && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            {t("wishlist.link")}
                          </h4>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {new URL(item.link).hostname}
                            <ExternalLinkIcon className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    {canEdit && (
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                          {t("wishlist.actions.edit")}
                        </button>
                        <button
                          onClick={onDelete}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          {t("wishlist.actions.delete")}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}