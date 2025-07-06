'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle, BookOpen, Shield, Zap, ArrowRight, Play, Users, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Animated Counter Component
function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = "", 
  prefix = "" 
}: { 
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return (
    <span ref={countRef} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  )
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-full"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-2/3"></div>
      <div className="flex gap-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true)
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  
  // Parallax transforms for decorative elements
  const y1 = useTransform(scrollY, [0, 500], [0, -100])
  const y2 = useTransform(scrollY, [0, 500], [0, 150])
  const scale = useTransform(scrollY, [0, 500], [1, 1.1])

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <LoadingSkeleton />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      {/* Parallax Decorative Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 blur-3xl"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-green-400 to-green-600 opacity-10 blur-3xl"
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-blue-500/20 dark:border-blue-400/20 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent font-semibold">
                Regulamentação atualizada 2025
              </span>
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Entenda a{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
                Resolução 996
              </span>{" "}
              do CONTRAN
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              O guia definitivo sobre autopropelidos no Brasil: patinetes elétricos, 
              bicicletas elétricas e ciclomotores. Saiba o que mudou, como se adequar 
              e circule com segurança.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/resolucao-996">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 border-0 gap-2 group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Ler a Resolução Completa
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/verificador">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm gap-2 group transition-all duration-300 hover:shadow-lg"
                >
                  <Shield className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Verificar Conformidade
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-4 mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <AnimatedCounter end={250} suffix="K+" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Usuários impactados pela resolução
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <AnimatedCounter end={96} suffix="%" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Taxa de conformidade atual
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(249, 115, 22, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <AnimatedCounter end={365} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Dias para adequação total
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 p-4 mb-4">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <AnimatedCounter end={32} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Velocidade máxima (km/h)
              </p>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-4 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Equipamentos Elétricos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Classificação e regras específicas para cada tipo de veículo elétrico
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="rounded-full bg-gradient-to-br from-green-500 to-green-600 p-4 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Segurança no Trânsito
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Equipamentos obrigatórios e boas práticas para circulação segura
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-4 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <AlertCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Prazos e Multas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Adequação até 31/12/2025 para ciclomotores e penalidades aplicáveis
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}