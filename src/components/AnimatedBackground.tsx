import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

export default function AnimatedBackground() {
  const { isDark } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const y1Spring = useSpring(y1, springConfig)
  const y2Spring = useSpring(y2, springConfig)
  const rotateSpring = useSpring(rotate, springConfig)

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Video background layer */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30 dark:opacity-20"
        >
          <source 
            src={isDark 
              ? "https://cdn.coverr.co/videos/coverr-neon-lights-in-the-city-4867/1080p.mp4"
              : "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-stadium-2512/1080p.mp4"
            } 
            type="video/mp4" 
          />
        </video>
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isDark 
            ? 'bg-gradient-to-b from-fanzone-dark/80 via-fanzone-dark/90 to-fanzone-dark'
            : 'bg-gradient-to-b from-white/70 via-white/85 to-white'
        }`} />
      </div>

      {/* Floating orbs */}
      <motion.div 
        style={{ y: y1Spring }}
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
        animate={{
          background: isDark 
            ? ['radial-gradient(circle, #ff4757, transparent)', 'radial-gradient(circle, #6c5ce7, transparent)', 'radial-gradient(circle, #ff4757, transparent)']
            : ['radial-gradient(circle, #ff4757, transparent)', 'radial-gradient(circle, #ffd700, transparent)', 'radial-gradient(circle, #ff4757, transparent)'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        style={{ y: y2Spring }}
        className="absolute top-40 right-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
        animate={{
          background: isDark
            ? ['radial-gradient(circle, #6c5ce7, transparent)', 'radial-gradient(circle, #4834d4, transparent)', 'radial-gradient(circle, #6c5ce7, transparent)']
            : ['radial-gradient(circle, #6c5ce7, transparent)', 'radial-gradient(circle, #00b894, transparent)', 'radial-gradient(circle, #6c5ce7, transparent)'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        style={{ y: y3Spring, rotate: rotateSpring }}
        className="absolute bottom-40 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
        animate={{
          background: ['radial-gradient(circle, #00cec9, transparent)', 'radial-gradient(circle, #ff7675, transparent)', 'radial-gradient(circle, #00cec9, transparent)'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBtMCA0MEw0MCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+\')]' : 'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBtMCA0MEw0MCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+\')]'}`} />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white' : 'bg-gray-400'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
