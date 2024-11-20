import React, { useState } from "react";
import { WishlistItem as WishlistItemType, User } from "../types";
import {
  Trash2Icon,
  ExternalLinkIcon,
  EditIcon,
  XIcon,
  CheckIcon,
  StarIcon,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface WishlistItemProps {
  item: WishlistItemType;
  user?: User;
  canEdit: boolean;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function WishlistItem({
  item,
  user,
  canEdit,
  onDelete,
  onUpdate,
}: WishlistItemProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDeleteConfirm = () => {
    onDelete(item.id);
    setShowDeleteModal(false);
  };

  if (isEditing) {
    return (
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
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XIcon className="h-4 w-4 mr-2" />
            {t("wishlist.actions.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            {loading
              ? t("wishlist.actions.saving")
              : t("wishlist.actions.save")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {user && (
              <div className="flex items-center gap-2 mb-1">
                <UserAvatar user={user} size="sm" />
                <span className="text-sm text-gray-600">
                  {t("wishlist.possessiveWish", { username: user.username })}
                </span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {item.title}
              {item.is_priority && (
                <StarIcon className="w-4 h-4 text-red-500 fill-red-500" />
              )}
            </h3>
            {item.description && (
              <p className="text-gray-600 mt-1">{item.description}</p>
            )}
            {item.price && (
              <p className="text-green-700 font-semibold mt-2">
                €{item.price.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
              >
                <ExternalLinkIcon className="w-5 h-5" />
              </a>
            )}
            {canEdit && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title={t("wishlist.actions.edit")}
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  title={t("wishlist.actions.delete")}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemTitle={item.title}
      />
    </>
  );
}
