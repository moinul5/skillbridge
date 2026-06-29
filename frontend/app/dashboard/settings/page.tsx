'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '@/components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { Bell, KeyRound, Globe, EyeOff, Save } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast('Notification preference settings have been saved.', 'success', 'Settings Updated');
    }, 1000);
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs text-slate-500">Configure your application configuration options</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
        
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Notifications config */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-primary-500" /> Notifications Settings
            </h3>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Marketing Emails</h4>
                  <p className="text-[10px] text-slate-400">Receive holiday discount codes and travel newsletters.</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEmail}
                  onChange={(e) => setMarketingEmail(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Security Alerts</h4>
                  <p className="text-[10px] text-slate-400">Receive email alerts when role permissions or bookings change.</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          {/* Security details */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-primary-500" /> Security
            </h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Password Management</h4>
              <p className="text-xs text-slate-400">
                To modify your login email or reset password credentials, please check your linked authentication profile (Firebase Console or Auth Provider options).
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full sm:w-auto font-semibold rounded-xl"
            >
              Save Settings <Save className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

        </form>

      </div>

    </div>
  );
}
