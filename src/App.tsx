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
  ArrowUpIcon,
  StarIcon,
  ArrowLeftIcon,
  UsersIcon,
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

  const sortItems = (items: WishlistItem[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "price") {
        return b.price - a.price;
      } else {
        return Number(b.is_priority) - Number(a.is_priority);
      }
    });
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
  const sortedItems = sortItems(filteredItems);

  if (showUserSelection) {
    return (
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80')] bg-cover bg-fixed">
        <div className="min-h-screen bg-white/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-6">
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <GiftIcon className="w-8 h-8 text-red-600" />
                <h1 className="text-4xl font-bold text-gray-800">
                  {t("app.title")}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Tooltip text={t("help.language")} position="bottom">
                  <LanguageSelector />
                </Tooltip>
                {currentUser && (
                  <div className="flex items-center gap-2">
                    <UserAvatar user={currentUser} size="md" />
                    <span className="text-gray-700">
                      {currentUser.username}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-gray-600 bg-white hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1"
                >
                  <LogOutIcon className="w-5 h-5" />
                  {t("auth.signOut")}
                </button>
              </div>
            </header>

            <div className="bg-white rounded-lg shadow-lg p-6 h-[80vh] flex flex-col">
              <div className="text-center mb-8">
                <UsersIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("app.chooseWishlist")}
                </h2>
                <p className="text-gray-600">
                  {t("app.selectWishlistDescription")}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-custom">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleUserSelect(null)}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-red-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                  >
                    <UsersIcon className="w-12 h-12 text-red-600" />
                    <span className="font-medium text-gray-900">
                      {t("app.allWishlists")}
                    </span>
                  </button>

                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                    >
                      <UserAvatar user={user} size="lg" />
                      <span className="font-medium text-gray-900">
                        {user.username}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                className="flex items-center gap-1 text-gray-600 bg-white hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1"
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
                      <li>
                        <span className="inline-flex items-center">
                          {t("help.tips.priority")}
                          <StarIcon className="w-4 h-4 mx-1 text-blue-800" />
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                onClick={() => setShowUserSelection(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white hover:text-gray-900 border border-gray-300 rounded-md transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {t("wishlist.changeWishlist")}
              </button>

              <div className="flex-1" />

              <Tooltip text={t("wishlist.sort.sortBy")} position="bottom">
                <div className="flex items-center gap-2">
                  <ArrowUpIcon className="w-5 h-5 text-gray-500" />
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
              </Tooltip>
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
