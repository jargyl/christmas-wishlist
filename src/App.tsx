import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { User, WishlistItem } from "./types";
import AuthForm from "./components/AuthForm";
import WishlistItemComponent from "./components/WishlistItem";
import AddWishlistItem from "./components/AddWishlistItem";
import UserAvatar from "./components/UserAvatar";
import LanguageSelector from "./components/LanguageSelector";
import { GiftIcon, LogOutIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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

  if (!session) {
    return <AuthForm onAuth={() => {}} />;
  }

  const currentUser = users.find((u) => u.id === session.user.id);
  const filteredItems = selectedUser
    ? items.filter((item) => item.user_id === selectedUser)
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <GiftIcon className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t("app.title")}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <LanguageSelector />
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={currentUser} />
                  <span className="text-gray-700">{currentUser.username}</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOutIcon className="h-5 w-5" />
                <span>{t("auth.signOut")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedUser(null)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              !selectedUser
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("app.allWishlists")}
          </button>
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                selectedUser === user.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserAvatar user={user} size="sm" />
              <span>{user.username}</span>
            </button>
          ))}
        </div>

        {(!selectedUser || selectedUser === session.user.id) && (
          <AddWishlistItem userId={session.user.id} onAdd={fetchItems} />
        )}

        <div className="space-y-6">
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
          {filteredItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {t("wishlist.noWishes")}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
