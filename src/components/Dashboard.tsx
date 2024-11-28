import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import UserAvatar from "./UserAvatar";
import { User } from "../types";
import TipsModal from "./TipsModal";

interface DashboardProps {
  user: User;
  onBack?: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Dashboard({
  user,
  onBack,
  onLogout,
  children,
}: DashboardProps) {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80')] bg-cover bg-fixed">
      <div className="min-h-screen bg-white/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          {/* Navigation and Profile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {onBack ? (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t("wishlist.goBack")}</span>
              </button>
            ) : (
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <UserAvatar user={user} size="md" />
                  <span className="font-medium text-card-foreground">
                    {user.username}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <button
                      onClick={() => {
                        setShowTipsModal(true);
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <HelpCircleIcon className="w-4 h-4" />
                      Tips & Help
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      {t("auth.signOut")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.main>
        </div>

        {/* Tips Modal */}
        <TipsModal
          isOpen={showTipsModal}
          onClose={() => setShowTipsModal(false)}
        />

        {/* Backdrop for dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}
