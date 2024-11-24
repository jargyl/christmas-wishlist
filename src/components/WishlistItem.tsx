import React, { useState } from "react";
import { WishlistItem as WishlistItemType, User } from "../types";
import { ExternalLinkIcon, StarIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useTranslation } from "react-i18next";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import WishDetailsModal from "./WishDetailsModal";

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(item.id);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg cursor-pointer"
        onClick={() => setShowDetailsModal(true)}
      >
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
              <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            )}
            {item.price && (
              <p className="text-green-700 font-semibold mt-2">
                €{item.price.toFixed(2)}
              </p>
            )}
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <WishDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        item={item}
        user={user}
        canEdit={canEdit}
        onEdit={() => {}}
        onDelete={() => setShowDeleteModal(true)}
        onUpdate={onUpdate}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemTitle={item.title}
      />
    </>
  );
}