import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";

interface AddWishlistItemProps {
  userId: string;
  onAdd: () => void;
}

export default function AddWishlistItem({
  userId,
  onAdd,
}: AddWishlistItemProps) {
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
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:border-red-400 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t("wishlist.addWish")}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("wishlist.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
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
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t("wishlist.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading
                ? t("wishlist.actions.adding")
                : t("wishlist.actions.add")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
