import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  LogInIcon,
  GiftIcon,
  UserIcon,
  KeyIcon,
  ImageIcon,
  ChevronLeftIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  onAuth: () => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    avatarUrl: "",
  });

  const validateImageUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|webp)$/i);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.username.includes(" ")) {
      toast.error(t("auth.usernameNoSpaces"));
      setLoading(false);
      return;
    }

    if (formData.avatarUrl && !validateImageUrl(formData.avatarUrl)) {
      toast.error(t("auth.invalidImageUrl"));
      setLoading(false);
      return;
    }

    try {
      const email = `${formData.username}@christmas.wishlist`;

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });
        if (error) {
          toast.error(t("auth.invalidCredentials"));
        }
      } else {
        // Check for existing username
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (existingUser) {
          throw new Error(t("auth.usernameTaken"));
        }

        // Sign up process
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password: formData.password,
            options: {
              data: {
                username: formData.username,
                avatar_url: formData.avatarUrl,
              },
            },
          });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: authData.user.id,
                username: formData.username,
                avatar_url: formData.avatarUrl,
              },
            ]);
          if (profileError) throw profileError;
        }

        toast.success(t("auth.accountCreated"));
      }
      onAuth();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-[url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80')] bg-cover bg-fixed flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <GiftIcon className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              {t("app.title")}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {!isLogin && (
                <div className="relative group">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    {t("auth.profilePicture")}
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-colors text-base"
                      value={formData.avatarUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, avatarUrl: e.target.value })
                      }
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {t("auth.profilePictureHint")}
                  </p>
                </div>
              )}

              <div className="relative group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  {t("auth.username")}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    pattern="[a-zA-Z0-9_-]+"
                    title={t("auth.usernameRequirements")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-colors text-base"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={!isLogin ? 6 : undefined}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-colors text-base"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label={isLogin ? t("auth.signIn") : t("auth.signUp")}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isLogin ? (
                  <>
                    <LogInIcon className="w-5 h-5" />
                    {t("auth.signIn")}
                  </>
                ) : (
                  t("auth.signUp")
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
