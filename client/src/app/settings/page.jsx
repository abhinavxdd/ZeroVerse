"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 12) {
      toast.error("Password must be at least 12 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.alias) {
      toast.error("Alias doesn't match");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await authAPI.deleteAccount();
      toast.success("Account deleted successfully");
      logout();
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="bg-zinc-900 border border-white/10 rounded-lg">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-semibold">Change Password</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Update Password</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Change your password to keep your account secure
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="ml-4 bg-white text-black hover:bg-gray-200"
                    >
                      Change Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Change Password
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Update your password to keep your account secure
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-300 block mb-1.5">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:border-white/40 text-white pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-300 block mb-1.5">
                          New Password (min 12 characters)
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:border-white/40 text-white pr-10"
                            required
                            minLength={12}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-300 block mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:border-white/40 text-white pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => {
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className="bg-zinc-800 text-white border-white/10 hover:bg-zinc-700"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Changing...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-zinc-900 border border-red-900/50 rounded-lg">
            <div className="p-4 border-b border-red-900/50">
              <h2 className="font-semibold text-red-500">Danger Zone</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="ml-4">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                      <label className="block text-sm text-gray-300 mb-2">
                        Type{" "}
                        <span className="font-bold text-white">
                          {user.alias}
                        </span>{" "}
                        to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded-md focus:outline-none focus:border-white/40 text-white"
                        placeholder={user.alias}
                      />
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeleteConfirmation("")}
                        className="bg-zinc-800 text-white border-white/10 hover:bg-zinc-700"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={
                          isDeletingAccount || deleteConfirmation !== user.alias
                        }
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeletingAccount ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
