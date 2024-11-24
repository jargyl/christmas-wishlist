import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, LogOutIcon, HelpCircleIcon } from "lucide-react";
import { cn } from "../lib/utils";
import UserAvatar from "./UserAvatar";
import { User } from "../types";

interface DashboardProps {
  user: User;
  onBack?: () => void;
  onLogout: () => void;
  children: React.ReactNode;
  showTips?: boolean;
}

export default function Dashboard({ 
  user, 
  onBack, 
  onLogout, 
  children,
  showTips = false
}: DashboardProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Navigation and Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>{t("wishlist.changeWishlist")}</span>
            </button>
          )}

          <div className={cn("flex items-center gap-4", !onBack && "ml-auto")}>
            <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border">
              <UserAvatar user={user} size="md" />
              <span className="font-medium text-card-foreground">{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t("auth.signOut")}</span>
            </button>
          </div>
        </div>

        {/* Tips Section */}
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-card rounded-lg border p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircleIcon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                {t("help.quickTips")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                <p className="text-sm text-accent-foreground">
                  {t("help.tips.addWish")}
                </p>
              </div>
              <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                <p className="text-sm text-accent-foreground">
                  {t("help.tips.clickLinks.before")} <ExternalLinkIcon className="w-4 h-4 inline" /> {t("help.tips.clickLinks.after")}
                </p>
              </div>
              <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                <p className="text-sm text-accent-foreground">
                  {t("help.tips.switchLists")}
                </p>
              </div>
              <div className="p-4 rounded-md bg-accent/50 border border-accent-foreground/10">
                <p className="text-sm text-accent-foreground">
                  {t("help.tips.priority")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}