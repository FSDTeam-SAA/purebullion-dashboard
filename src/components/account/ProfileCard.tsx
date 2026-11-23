"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, ChevronDown } from "lucide-react";
import {
  useAccountProfile,
  useUpdateAccountProfile,
  useUploadAvatar,
} from "./hooks/useAccount";

export default function ProfileCard() {
  const { data: profile } = useAccountProfile();
  const updateProfileMutation = useUpdateAccountProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Eastern Time (ET)");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.name) setFullName(profile.name);
      if (profile.username) setDisplayName(profile.username);
      if (profile.email) setEmail(profile.email);
      if (profile.timezone) setTimezone(profile.timezone);
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: fullName,
      username: displayName,
      timezone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDiscard = () => {
    if (profile) {
      setFullName(profile.name || "");
      setDisplayName(profile.username || "");
      setEmail(profile.email || "");
      setTimezone(profile.timezone || "");
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway shadow-xs">
      {/* Hidden Avatar File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarSelect}
      />

      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1B2227]">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar with Change Photo Overlay */}
          <div className="relative group shrink-0">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E7C042]/50 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1B2227] to-[#2B353E] border-2 border-[#E7C042]/50 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
              title="Change photo"
            >
              <Camera className="w-5 h-5 text-[#E7C042]" />
            </button>
          </div>

          {/* User Details & Badges */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {fullName}
              </h3>
            </div>
            <p className="text-xs text-[#8E9CA8] font-nunito truncate mt-0.5">
              {email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#E7C042]/10 border border-[#E7C042]/30 text-xs font-bold text-[#E7C042]">
                {profile?.role === "ADMIN" ? "Super Admin" : "Member"}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-medium text-[#8E9CA8]">
                {profile?.isFoundingMember ? "Founding member #388" : "Standard member"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-[#182026] hover:bg-[#222C35] border border-[#2B353E] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Change Photo
          </button>
          <span className="px-2.5 py-1 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-medium text-[#718090]">
            2 Today
          </span>
        </div>
      </div>

      {/* Form Fields: 2 Columns */}
      <form onSubmit={handleSave} className="pt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white font-medium transition-all"
              />
            </div>
          </div>

          {/* Display Name in Community */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-2">
              Display Name in Community
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white font-medium transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white font-medium transition-all"
              />
            </div>
            <p className="text-xs text-[#5B6675] font-nunito mt-1.5">
              Changing this requires re-verification.
            </p>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-2">
              Time zone
            </label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white font-medium transition-all appearance-none cursor-pointer"
              >
                <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                <option value="Central Time (CT)">Central Time (CT)</option>
                <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#718090] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-start gap-3 pt-4">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg gold-gradient-btn text-black text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            {isSaved ? "Saved Successfully!" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="px-4 py-2.5 rounded-lg bg-[#182026] hover:bg-[#222C35] border border-[#2B353E] text-xs font-semibold text-[#8E9CA8] hover:text-white transition-colors cursor-pointer"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
