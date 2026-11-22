"use client";

import React, { useState } from "react";
import { Lock, Download, Trash2, UserX } from "lucide-react";
import {
  useExportUserData,
  useDeleteConversationHistory,
  useCloseAccount,
} from "./hooks/useAccount";

export default function PrivacyDataCard() {
  const exportMutation = useExportUserData();
  const deleteHistoryMutation = useDeleteConversationHistory();
  const closeAccountMutation = useCloseAccount();

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleDeleteHistory = () => {
    deleteHistoryMutation.mutate();
  };

  const handleConfirmClose = () => {
    closeAccountMutation.mutate({
      reason: "User requested account closure from dashboard settings",
    });
    setShowCloseConfirm(false);
  };

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1B2227]">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-[#E7C042]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Privacy and data
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-medium text-[#718090]">
            2 Today
          </span>
          <button
            type="button"
            className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors font-medium"
          >
            View all →
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#1B2227]">
        {/* Export Data */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#182026] border border-[#2B353E] text-[#8E9CA8] shrink-0 mt-0.5">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Export my data
              </h4>
              <p className="text-xs text-[#8E9CA8] font-nunito mt-0.5">
                Download everything we hold about you as JSON.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-[#182026] hover:bg-[#222C35] border border-[#2B353E] text-xs font-semibold text-white transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            {exportMutation.isPending ? "Exporting..." : "Export"}
          </button>
        </div>

        {/* Delete AI History */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#182026] border border-[#2B353E] text-[#EF4444] shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Delete AI conversation history
              </h4>
              <p className="text-xs text-[#8E9CA8] font-nunito mt-0.5">
                Removes all assistant conversations from your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteHistory}
            className="px-4 py-2 rounded-lg bg-[#2E1417] hover:bg-[#3D1A1E] border border-[#EF4444]/30 text-xs font-semibold text-[#EF4444] transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            {deleteHistoryMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Close Account */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#182026] border border-[#2B353E] text-[#EF4444] shrink-0 mt-0.5">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Close account
              </h4>
              <p className="text-xs text-[#8E9CA8] font-nunito mt-0.5">
                Permanently deletes your account after 90 days.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCloseConfirm(true)}
            className="px-4 py-2 rounded-lg bg-[#2E1417] hover:bg-[#3D1A1E] border border-[#EF4444]/30 text-xs font-semibold text-[#EF4444] transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            Close account
          </button>
        </div>
      </div>

      {/* Close Account Confirmation Dialog */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0C0F10] border border-[#1B2227] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Close Account?</h3>
            <p className="text-xs text-[#8E9CA8] leading-relaxed mb-5">
              Are you sure you want to request account closure? Your account will be scheduled for permanent deletion after 90 days.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8E9CA8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-lg bg-[#EF4444] text-white text-xs font-bold"
              >
                Confirm Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
