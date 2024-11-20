import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogInIcon, GiftIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import Tooltip from "./Tooltip";

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
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (existingUser) {
          throw new Error(t("auth.usernameTaken"));
        }

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
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80')] bg-cover bg-fixed flex items-center justify-center p-4 relative">
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <GiftIcon className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-800">{t("app.title")}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.profilePicture")}
              </label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("auth.profilePictureHint")}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("auth.username")}
            </label>
            <input
              type="text"
              required
              pattern="[a-zA-Z0-9_-]+"
              title={t("auth.usernameRequirements")}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("auth.password")}
            </label>
            <input
              type="password"
              required
              minLength={!isLogin ? 6 : undefined}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 p-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              t("auth.loading")
            ) : isLogin ? (
              <>
                <LogInIcon className="h-5 w-5" />
                {t("auth.signIn")}
              </>
            ) : (
              t("auth.signUp")
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-500"
          >
            {isLogin ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
