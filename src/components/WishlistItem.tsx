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
        className="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md hover:border-red-200 cursor-pointer"
        onClick={() => setShowDetailsModal(true)}
      >
        {user && (
          <div className="flex items-center gap-2 mb-3">
            <UserAvatar user={user} size="sm" />
            <span className="text-sm text-gray-600">
              {t("wishlist.possessiveWish", { username: user.username })}
            </span>
          </div>
        )}
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="truncate">{item.title}</span>
              {item.is_priority && (
                <StarIcon className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />
              )}
            </h3>
            {item.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>
            )}
            {item.price && (
              <p className="text-green-700 font-semibold">
                €{item.price.toFixed(2)}
              </p>
            )}
          </div>
          
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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