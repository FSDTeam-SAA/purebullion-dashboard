'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { userService, UserProfile } from '@/services/user.service';
import { getErrorMessage } from '@/services/apiClient';
import { usePermissions } from '@/hooks/usePermissions';

export default function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const { isReadOnly } = usePermissions();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing user profile on mount (once)
  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const response = await userService.getProfile();
        if (isMounted && response.data) {
          const profile: UserProfile = response.data;
          setFirstName(profile.firstName || '');
          setLastName(profile.lastName || '');
          setEmail(profile.email || '');
          setExistingPhotoUrl(profile.photo || profile.profileImage || null);
        }
      } catch {
        // Fallback to session data if backend profile is unreachable or demo session
        if (isMounted) {
          if (session?.user) {
            const fullName = session.user.name || '';
            const parts = fullName.trim().split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
            setEmail(session.user.email || '');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setExistingPhotoUrl((session.user as any).profileImage || null);
          } else {
            setFirstName('John');
            setLastName('Bhawal');
            setEmail('you@gmail.com');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [session]);

  // Clean up preview object URL on change or unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image file selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Handle removing the selected or existing photo
  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setExistingPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) {
      toast.error('Read-only accounts cannot modify profiles.');
      return;
    }

    if (!firstName.trim()) {
      toast.error('First name is required.');
      return;
    }

    if (!email.trim()) {
      toast.error('Email address is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userService.updateProfile(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          photo: existingPhotoUrl || undefined,
        },
        selectedFile
      );

      const updatedUser = response.data;
      if (updatedUser) {
        setFirstName(updatedUser.firstName || firstName);
        setLastName(updatedUser.lastName || lastName);
        setEmail(updatedUser.email || email);
        const newPhoto = updatedUser.photo || updatedUser.profileImage || null;
        setExistingPhotoUrl(newPhoto);
      }

      // Clear pending local preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);

      // Update client session so header/navbar updates immediately
      if (updateSession) {
        await updateSession({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
          profileImage: updatedUser?.photo || existingPhotoUrl,
        });
      }

      toast.success(response.message || 'Profile updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute initials for avatar fallback
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'JB';

  const displayedImage = previewUrl || existingPhotoUrl;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-gray-900 text-xl font-bold tracking-tight">Profile</h2>
      </div>

      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-7 h-7 animate-spin text-sky-600" />
          <p className="text-sm">Loading profile data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Profile Image Section */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Circle */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl select-none">
                  {displayedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayedImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                {/* Floating camera icon trigger */}
                <label
                  htmlFor="profile-image-input"
                  className="absolute bottom-0 right-0 p-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md cursor-pointer transition-transform active:scale-95 border-2 border-white"
                  title="Change photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
              </div>

              {/* Upload & Remove Controls */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Profile Photo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload your profile photo. PNG, JPG, GIF or WEBP up to 5MB.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    id="profile-image-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  <label
                    htmlFor="profile-image-input"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload New Photo</span>
                  </label>

                  {displayedImage && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 1: First name & Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="text-sky-900 text-base font-medium"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name......"
                  className="w-full h-14 px-4 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="text-sky-900 text-base font-medium"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name......"
                  className="w-full h-14 px-4 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Row 2: Email Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sky-900 text-base font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full h-14 px-4 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Card Footer with Save Changes Button */}
          <div className="p-5 border-t border-slate-200 flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting || isReadOnly}
              className="h-12 px-6 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-base font-medium rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>

            {isReadOnly && (
              <span className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                Read-Only Mode: Profile editing is restricted.
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
