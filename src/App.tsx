import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { User, WishlistItem } from "./types";
import AuthForm from "./components/AuthForm";
import WishlistItemComponent from "./components/WishlistItem";
import AddWishlistItem from "./components/AddWishlistItem";
import UserAvatar from "./components/UserAvatar";
import {
  GiftIcon,
  LogOutIcon,
  UsersIcon,
  ArrowLeftIcon,
  HeartIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUsers();
        fetchItems();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUsers();
        fetchItems();
      }
    });
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url");
    if (error) {
      toast.error(t("messages.error"));
    } else {
      setUsers(data);
    }
  };

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(t("messages.error"));
    } else {
      setItems(data);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .match({ id });
    if (error) {
      toast.error(t("messages.error"));
    } else {
      toast.success(t("messages.itemDeleted"));
      fetchItems();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleUserSelect = (userId: string | null) => {
    setSelectedUser(userId);
    setShowUserSelection(false);
  };

  if (!session) {
    return <AuthForm onAuth={() => {}} />;
  }

  const currentUser = users.find((u) => u.id === session.user.id);
  const filteredItems = selectedUser
    ? items.filter((item) => item.user_id === selectedUser)
    : items;

  if (showUserSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-gray-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <GiftIcon className="w-8 h-8 text-red-700" />
              <h1 className="text-3xl font-bold text-gray-900">
                {t("app.title")}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {currentUser && (
                <button
                  onClick={() => handleUserSelect(currentUser.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                >
                  <UserAvatar user={currentUser} size="sm" />
                  <span className="text-gray-900">{currentUser.username}</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 transition-colors"
              >
                <LogOutIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t("auth.signOut")}</span>
              </button>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-center mb-8">
              <UsersIcon className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("app.chooseWishlist")}
              </h2>
              <p className="text-gray-700">
                {t("app.selectWishlistDescription")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleUserSelect(null)}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-red-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group"
              >
                <UsersIcon className="w-10 h-10 text-red-700 group-hover:text-red-800" />
                <span className="font-medium text-gray-900">
                  {t("app.allWishlists")}
                </span>
              </button>

              <button
                onClick={() => handleUserSelect(session.user.id)}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-red-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group"
              >
                <HeartIcon className="w-10 h-10 text-red-700 group-hover:text-red-800" />
                <span className="font-medium text-gray-900">
                  {t("app.myWishlist")}
                </span>
              </button>

              {users
                .filter((user) => user.id !== session.user.id)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className="flex flex-col items-center gap-3 p-6 border border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group"
                  >
                    <UserAvatar user={user} size="xl" />
                    <span className="font-medium text-gray-900 text-center truncate w-full max-w-[120px]">
                      {user.username}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Toaster position="top-right" />

        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-8 h-8 text-red-700" />
            <h1 className="text-3xl font-bold text-gray-900">
              {t("app.title")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUserSelection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>{t("wishlist.changeWishlist")}</span>
            </button>
            {currentUser && (
              <button
                onClick={() => handleUserSelect(currentUser.id)}
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
              >
                <UserAvatar user={currentUser} size="sm" />
                <span className="text-gray-900">{currentUser.username}</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t("auth.signOut")}</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
          {(!selectedUser || selectedUser === session.user.id) && (
            <div className="mb-6">
              <AddWishlistItem userId={session.user.id} onAdd={fetchItems} />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <WishlistItemComponent
                key={item.id}
                item={item}
                user={users.find((u) => u.id === item.user_id)}
                canEdit={item.user_id === session.user.id}
                onDelete={handleDelete}
                onUpdate={fetchItems}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-center text-gray-600 py-12">
              {t("wishlist.noWishes")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
