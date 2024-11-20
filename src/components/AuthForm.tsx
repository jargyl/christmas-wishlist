import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { GiftIcon } from "lucide-react";
import toast from "react-hot-toast";

interface AuthFormProps {
  onAuth: () => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
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

    if (formData.avatarUrl && !validateImageUrl(formData.avatarUrl)) {
      toast.error("Please enter a valid image URL (jpg, jpeg, png, or webp)");
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
        if (error) throw error;
      } else {
        // Check if username already exists
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (existingUser) {
          throw new Error("Username already taken");
        }

        // 1. Sign up the user
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

        // 2. Create the profile record
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

        toast.success("Account created successfully!");
      }
      onAuth();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <GiftIcon className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Family Christmas Wishlist
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture URL (optional)
              </label>
              <input
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a URL for your profile picture (jpg, jpeg, png, or webp)
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              required
              pattern="[a-zA-Z0-9_-]+"
              title="Username can only contain letters, numbers, underscores, and hyphens"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-500"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
