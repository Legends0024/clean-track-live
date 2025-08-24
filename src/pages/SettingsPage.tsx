import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Moon, Globe } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Card } from '@/components/ui/card';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toggleNotification, setTheme, setLanguage } from '@/features/settings/settingsSlice';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'hi', label: 'हिंदी' },
];

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.settings);

  const handleNotificationToggle = (type: 'taskAlerts' | 'slaBreaches') => (enabled: boolean) => {
    dispatch(toggleNotification({ type, enabled }));
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    dispatch(setTheme(theme));
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(language));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-2xl py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <ToggleSwitch
              label="Task Alerts"
              description="Get notified about new tasks and updates"
              checked={settings.notifications.taskAlerts}
              onChange={handleNotificationToggle('taskAlerts')}
            />
            <ToggleSwitch
              label="SLA Breach Alerts"
              description="Get notified when SLA thresholds are breached"
              checked={settings.notifications.slaBreaches}
              onChange={handleNotificationToggle('slaBreaches')}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Moon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            <Select
              value={settings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Language</h2>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Select your preferred language</p>
            <Select
              value={settings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
