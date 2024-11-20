//V
import React, { useState } from "react";
import { WishlistItem as WishlistItemType, User } from "../types";
import {
  Trash2Icon,
  LinkIcon,
  PencilIcon,
  XIcon,
  CheckIcon,
  StarIcon,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface WishlistItemProps {
  item: WishlistItemType;
  user?: User;
  canEdit: boolean;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const priorityColors = {
  low: "bg-blue-100",
  medium: "bg-yellow-100",
  high: "bg-red-100",
};

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
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || "",
    price: item.price.toString(),
    link: item.link || "",
    priority: item.priority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("wishlist_items")
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          link: formData.link,
          priority: formData.priority,
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

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("wishlist.title")} *
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("wishlist.price")} *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("wishlist.priority")}
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
            >
              <option value="low">{t("wishlist.priorities.low")}</option>
              <option value="medium">{t("wishlist.priorities.medium")}</option>
              <option value="high">{t("wishlist.priorities.high")}</option>
            </select>
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
    <div
      className={`rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02] ${
        priorityColors[item.priority]
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {user && (
            <div className="flex items-center space-x-3 mb-2">
              <UserAvatar user={user} size="sm" />
              <span className="text-md text-gray-600 ml-2">
                {user.username}
                {t("wishlist.possessiveWish")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {item.title}
            </h3>
            {item.priority === "high" && (
              <StarIcon className="h-5 w-5 text-red-500 fill-red-500" />
            )}
          </div>
          {item.description && (
            <p className="text-gray-600 mt-2">{item.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-lg font-medium text-green-600">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <LinkIcon className="h-5 w-5" />
            </a>
          )}
          {canEdit && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
                title={t("wishlist.actions.edit")}
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700"
                title={t("wishlist.actions.delete")}
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
