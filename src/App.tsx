import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { User, WishlistItem } from "./types";
import AuthForm from "./components/AuthForm";
import WishlistItemComponent from "./components/WishlistItem";
import AddWishlistItem from "./components/AddWishlistItem";
import UserAvatar from "./components/UserAvatar";
import { UsersIcon, HeartIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Dashboard from "./components/Dashboard";
import { motion } from "framer-motion";
import WelcomeModal from "./components/WelcomeModal";

export default function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem("hasVisited", "true");
    }

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
    localStorage.removeItem("supabase.auth.token");
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

  if (!currentUser) return null;

  if (showUserSelection) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleSignOut}
        showTips={isFirstVisit}
      >
        <WelcomeModal userId={session.user.id} />
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(null)}
              className="flex flex-col items-center gap-2 p-4 sm:p-8 bg-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
            >
              <UsersIcon className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              <span className="font-medium text-primary text-sm sm:text-base">
                {t("app.allWishlists")}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(session.user.id)}
              className="flex flex-col items-center gap-2 p-4 sm:p-8 bg-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
            >
              <HeartIcon className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              <span className="font-medium text-primary text-sm sm:text-base">
                {t("app.myWishlist")}
              </span>
            </motion.button>
          </div>

          {/* Family Members */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t("app.familyMembers")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {users
                .filter((user) => user.id !== session.user.id)
                .map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUserSelect(user.id)}
                    className="flex flex-col items-center gap-3 p-6 bg-card border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <UserAvatar user={user} size="xl" />
                    <span className="font-medium text-card-foreground truncate w-full max-w-[120px]">
                      {user.username}
                    </span>
                  </motion.button>
                ))}
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }

  const isPersonalList = selectedUser === session.user.id;

  return (
    <Dashboard
      user={currentUser}
      onBack={() => setShowUserSelection(true)}
      onLogout={handleSignOut}
      showTips={false}
    >
      <Toaster position="top-right" />

      <div className="space-y-6">
        {isPersonalList && (
          <AddWishlistItem userId={session.user.id} onAdd={fetchItems} />
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
          <p className="text-center text-muted-foreground py-12">
            {selectedUser === session.user.id
              ? t("wishlist.noWishes")
              : t("wishlist.noWishesOther")}
          </p>
        )}
      </div>
    </Dashboard>
  );
}
