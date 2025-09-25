'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { DashboardLayout } from '@/components/dashboard-layout'
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Palette, 
  Volume2, 
  Monitor, 
  Save,
  Moon,
  Sun,
  Check
} from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'

export default function Settings() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [settings, setSettings] = useState({
    // Profile
    name: user?.name || '',
    email: user?.email || '',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    
    // Preferences
    sessionDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartSessions: false,
    
    // Display
    theme: theme || 'dark',
    showAnimations: true,
    compactMode: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  const handleSaveSettings = () => {
    // Save settings logic here
    localStorage.setItem('userSettings', JSON.stringify(settings))
    
    if (settings.theme !== theme) {
      setTheme(settings.theme)
    }
    
    toast.success('Settings saved successfully!')
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="main-content relative">
        {/* Animated Grid Background */}
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.05}
          duration={4}
          repeatDelay={1}
          className="absolute inset-0"
        />
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <TypewriterEffect
            words={[
              {
                text: "Settings",
                className: "text-4xl font-bold text-white"
              }
            ]}
            className="mb-2"
          />
          <p className="text-light-gray text-lg">Manage your account and preferences</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Email Notifications</span>
                <button
                  onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Push Notifications</span>
                <button
                  onClick={() => handleInputChange('pushNotifications', !settings.pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Sound Effects</span>
                <button
                  onClick={() => handleInputChange('soundEnabled', !settings.soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Focus Preferences */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Focus Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Session Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.sessionDuration}
                  onChange={(e) => handleInputChange('sessionDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={settings.shortBreak}
                  onChange={(e) => handleInputChange('shortBreak', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={settings.longBreak}
                  onChange={(e) => handleInputChange('longBreak', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleInputChange('theme', 'dark')}
                    className={`p-3 rounded-lg border transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-white/20 border-white text-white'
                        : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
                    }`}
                  >
                    <Moon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => handleInputChange('theme', 'light')}
                    className={`p-3 rounded-lg border transition-all ${
                      settings.theme === 'light'
                        ? 'bg-white/20 border-white text-white'
                        : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
                    }`}
                  >
                    <Sun className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Light</span>
                  </button>
                </div>
              </div>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Animations</span>
                <button
                  onClick={() => handleInputChange('showAnimations', !settings.showAnimations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showAnimations ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.showAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full btn-secondary py-3">
                Change Password
              </button>
              <button className="w-full btn-secondary py-3">
                Two-Factor Authentication
              </button>
              <button className="w-full btn-secondary py-3">
                Connected Devices
              </button>
            </div>
          </div>

          {/* Advanced */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-6">
              <Monitor className="w-6 h-6 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Advanced</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Auto-start Breaks</span>
                <button
                  onClick={() => handleInputChange('autoStartBreaks', !settings.autoStartBreaks)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoStartBreaks ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Auto-start Sessions</span>
                <button
                  onClick={() => handleInputChange('autoStartSessions', !settings.autoStartSessions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoStartSessions ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.autoStartSessions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-white">Compact Mode</span>
                <button
                  onClick={() => handleInputChange('compactMode', !settings.compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.compactMode ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="relative z-10 mt-8 flex justify-center">
          <button
            onClick={handleSaveSettings}
            className="btn-primary px-8 py-3 text-lg font-semibold flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
