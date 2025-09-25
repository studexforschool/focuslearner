'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, Zap, Target, Users, Award, TrendingUp, Sparkles, Code, Globe } from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { MorphingText } from '@/components/morphing-text'
import { TextReveal } from '@/components/text-reveal'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [currentFeature, setCurrentFeature] = useState(0)

  const morphingTexts = [
    'Focus Better',
    'Work Smarter',
    'Achieve More',
    'Stay Productive',
    'Master Time'
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Intelligent insights to optimize your workflow'
    },
    {
      icon: Target,
      title: 'Goal Focused',
      description: 'Track and achieve your objectives efficiently'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for seamless experience'
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'Work together with your team effectively'
    },
    {
      icon: Award,
      title: 'Gamified',
      description: 'Earn achievements and track your progress'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Deep insights into your productivity patterns'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50M+', label: 'Focus Minutes' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' }
  ]

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, features.length])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pure-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-pure-black/90 backdrop-blur-2xl border border-white/10"
          >
            {/* Animated Grid Background */}
            <AnimatedGridPattern
              numSquares={50}
              maxOpacity={0.1}
              duration={4}
              repeatDelay={0.5}
              className="absolute inset-0 h-full"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl mb-8"
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-bold mb-6">
                  <MorphingText
                    texts={morphingTexts}
                    className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent"
                  />
                </h1>

                <TextReveal
                  text="Transform your productivity with AI-powered focus sessions"
                  className="text-xl md:text-2xl text-light-gray mb-8"
                  delay={0.3}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-4 mb-12"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                      className="glass-card px-6 py-4"
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-light-gray">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      className={`glass-card p-6 cursor-pointer transition-all ${
                        currentFeature === index ? 'border-white/30 bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          currentFeature === index ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-sm text-light-gray">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Mission Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-light-gray max-w-3xl mx-auto text-lg leading-relaxed">
                  We believe in empowering individuals to achieve their full potential through 
                  intelligent productivity tools. FocusLearner combines cutting-edge AI technology 
                  with proven productivity techniques to help you work smarter, not harder.
                </p>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="glass-card p-8 text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Built with Modern Tech</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand'].map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.05, type: 'spring' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm text-white border border-white/20"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center mt-12 pt-8 border-t border-white/10"
              >
                <div className="flex justify-center space-x-6 mb-4">
                  <Sparkles className="w-5 h-5 text-white/60" />
                  <Code className="w-5 h-5 text-white/60" />
                  <Globe className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-sm text-light-gray">
                  © 2024 FocusLearner. Crafted with passion for productivity.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
