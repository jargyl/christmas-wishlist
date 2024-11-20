import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { User, WishlistItem } from "./types";
import AuthForm from "./components/AuthForm";
import WishlistItemComponent from "./components/WishlistItem";
import AddWishlistItem from "./components/AddWishlistItem";
import UserAvatar from "./components/UserAvatar";
import LanguageSelector from "./components/LanguageSelector";
import WelcomeModal from "./components/WelcomeModal";
import Tooltip from "./components/Tooltip";
import {
  GiftIcon,
  LogOutIcon,
  HelpCircleIcon,
  ExternalLinkIcon,
  ArrowUpDownIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

type SortOption = "priority" | "price";

export default function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("priority");

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
    setSession(null);
    setUsers([]);
    setItems([]);
    setSelectedUser(null);

    localStorage.clear();
  };

  const sortItems = (items: WishlistItem[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "price") {
        return b.price - a.price;
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });
  };

  if (!session) {
    return <AuthForm onAuth={() => {}} />;
  }

  const currentUser = users.find((u) => u.id === session.user.id);
  const filteredItems = selectedUser
    ? items.filter((item) => item.user_id === selectedUser)
    : items;
  const sortedItems = sortItems(filteredItems);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80')] bg-cover bg-fixed">
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-6">
          <Toaster position="top-right" />
          <WelcomeModal />

          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <GiftIcon className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                {t("app.title")}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip text={t("help.tooltip")} position="bottom">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={t("help.tooltip")}
                >
                  <HelpCircleIcon className="w-6 h-6" />
                </button>
              </Tooltip>
              <Tooltip text={t("help.language")} position="bottom">
                <LanguageSelector />
              </Tooltip>
              {currentUser && (
                <div className="flex items-center gap-2">
                  <UserAvatar user={currentUser} size="md" />
                  <span className="text-gray-700">{currentUser.username}</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <LogOutIcon className="w-5 h-5" />
                {t("auth.signOut")}
              </button>
            </div>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-6 h-[80vh] flex flex-col">
            {showHelp && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <HelpCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      {t("help.quickTips")}
                    </h3>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                      <li>{t("help.tips.addWish")}</li>
                      <li>{t("help.tips.switchLists")}</li>
                      <li>
                        <span className="inline-flex items-center">
                          {t("help.tips.clickLinks.before")}
                          <ExternalLinkIcon className="w-4 h-4 mx-1" />
                          {t("help.tips.clickLinks.after")}
                        </span>
                      </li>
                      <li>{t("help.tips.priority")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-4 flex-1" role="tablist">
                <Tooltip text={t("help.viewAllTooltip")} position="bottom">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      !selectedUser
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    role="tab"
                    aria-selected={!selectedUser}
                  >
                    {t("app.allWishlists")}
                  </button>
                </Tooltip>
                {users.map((user) => (
                  <Tooltip
                    key={user.id}
                    text={t("help.viewUserTooltip", {
                      username: user.username,
                    })}
                    position="bottom"
                  >
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        selectedUser === user.id
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      role="tab"
                      aria-selected={selectedUser === user.id}
                    >
                      <UserAvatar user={user} size="sm" />
                      <span>{user.username}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDownIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="priority">
                    {t("wishlist.sort.priority")}
                  </option>
                  <option value="price">{t("wishlist.sort.price")}</option>
                </select>
              </div>
            </div>

            {(!selectedUser || selectedUser === session.user.id) && (
              <AddWishlistItem userId={session.user.id} onAdd={fetchItems} />
            )}
            <div className="flex-1 overflow-y-auto scrollbar-custom">
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <WishlistItemComponent
                    key={item.id}
                    item={item}
                    user={users.find((u) => u.id === item.user_id)}
                    canEdit={item.user_id === session.user.id}
                    onDelete={handleDelete}
                    onUpdate={fetchItems}
                  />
                ))}
                {sortedItems.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    {t("wishlist.noWishes")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
