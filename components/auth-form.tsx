'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MagicCard } from "@/components/magic-card"
import { useTheme } from "next-themes"
import { Brain, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import toast from 'react-hot-toast'

export function AuthForm() {
  const { theme } = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { login, register, loading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!isLogin && !formData.name) newErrors.name = 'Name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
      } else {
        await register(formData.email, formData.password, formData.name)
        toast.success('Account created successfully!')
      }
    } catch (error: any) {
      setErrors({ submit: error.message })
      toast.error(error.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-pure-black dark:bg-pure-black light:bg-white relative">
      <div className="min-h-screen flex flex-col">
        {/* Compact Header & Auth Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-3xl mb-4">
            <Brain className="w-8 h-8 text-white dark:text-white light:text-black" />
          </div>
          
          {/* Text Hover Effect Title */}
          <div className="h-[12rem] flex items-center justify-center mb-4">
            <TextHoverEffect text="FOCUS" />
          </div>
          
          {/* Subheading */}
          <p className="text-base text-light-gray dark:text-light-gray light:text-gray-600 mb-6 max-w-md mx-auto text-center">
            Transform your productivity with AI-powered focus sessions
          </p>

          {/* Auth Card */}
          <div className="w-full max-w-sm mx-auto">
            <Card className="p-0 shadow-none border-none backdrop-blur-sm">
              <MagicCard
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                className="p-0"
              >
                <CardHeader className="border-b border-white/10 dark:border-white/10 light:border-black/10 p-4">
                  <CardTitle className="text-white dark:text-white light:text-black text-xl">
                    {isLogin ? 'Welcome Back' : 'Join FocusLearner'}
                  </CardTitle>
                  <CardDescription className="text-light-gray dark:text-light-gray light:text-gray-600 text-sm">
                    {isLogin ? 'Continue your productivity journey' : 'Start your focus transformation today'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {!isLogin && (
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white dark:text-white light:text-black">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            type="text" 
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-white/5 dark:bg-white/5 light:bg-black/5 border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-black placeholder-light-gray"
                          />
                          {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white dark:text-white light:text-black">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white/5 dark:bg-white/5 light:bg-black/5 border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-black placeholder-light-gray"
                        />
                        {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white dark:text-white light:text-black">Password</Label>
                        <Input 
                          id="password" 
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-white/5 dark:bg-white/5 light:bg-black/5 border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-black placeholder-light-gray"
                        />
                        {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
                      </div>
                    </div>
                    {errors.submit && (
                      <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-sm text-red-400">{errors.submit}</p>
                      </div>
                    )}
                  </form>
                </CardContent>
                
                <CardFooter className="p-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex-col space-y-3">
                  <Button 
                    className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-semibold py-3 flex items-center justify-center gap-2"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-light-gray dark:text-light-gray light:text-gray-600 text-sm mb-2">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-electric-blue hover:text-electric-blue/80 font-medium transition-colors duration-200"
                    >
                      {isLogin ? 'Create Account' : 'Sign In'}
                    </button>
                  </div>
                </CardFooter>
              </MagicCard>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
