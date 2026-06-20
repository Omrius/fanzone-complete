import { useRef, useMemo } from 'react'
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
  const y3Spring = useSpring(y3, springConfig)
  const rotateSpring = useSpring(rotate, springConfig)

  // Generate stable random positions for particles (avoid re-render flicker)
  const particles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      key: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 23 + 7) % 100}%`,
      duration: 3 + ((i * 7) % 5),
      delay: (i * 0.3) % 4,
      size: 1 + (i % 3),
    }))
  }, [])

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated mesh gradient / aurora layer */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-60'}`}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 20% 30%, rgba(255, 71, 87, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(108, 92, 231, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, rgba(72, 52, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 206, 201, 0.15) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at 20% 30%, rgba(255, 71, 87, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(108, 92, 231, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, rgba(72, 52, 212, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 206, 201, 0.08) 0%, transparent 50%)',
            animation: 'auroraMove 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 60% 50%, rgba(255, 71, 87, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(108, 92, 231, 0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 60% 50%, rgba(255, 71, 87, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(108, 92, 231, 0.08) 0%, transparent 60%)',
            animation: 'auroraMove 25s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Floating orbs — more visible */}
      <motion.div
        style={{ y: y1Spring }}
        className="absolute -top-10 -left-10 w-96 h-96 rounded-full blur-3xl"
        animate={{
          background: isDark
            ? ['radial-gradient(circle, rgba(255,71,87,0.35), transparent)', 'radial-gradient(circle, rgba(108,92,231,0.35), transparent)', 'radial-gradient(circle, rgba(255,71,87,0.35), transparent)']
            : ['radial-gradient(circle, rgba(255,71,87,0.25), transparent)', 'radial-gradient(circle, rgba(255,215,0,0.25), transparent)', 'radial-gradient(circle, rgba(255,71,87,0.25), transparent)'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y: y2Spring }}
        className="absolute top-20 right-0 w-[30rem] h-[30rem] rounded-full blur-3xl"
        animate={{
          background: isDark
            ? ['radial-gradient(circle, rgba(108,92,231,0.3), transparent)', 'radial-gradient(circle, rgba(72,52,212,0.3), transparent)', 'radial-gradient(circle, rgba(108,92,231,0.3), transparent)']
            : ['radial-gradient(circle, rgba(108,92,231,0.2), transparent)', 'radial-gradient(circle, rgba(0,184,148,0.2), transparent)', 'radial-gradient(circle, rgba(108,92,231,0.2), transparent)'],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y: y3Spring, rotate: rotateSpring }}
        className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl"
        animate={{
          background: ['radial-gradient(circle, rgba(0,206,201,0.25), transparent)', 'radial-gradient(circle, rgba(255,118,117,0.25), transparent)', 'radial-gradient(circle, rgba(0,206,201,0.25), transparent)'],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern overlay */}
      <div className={`absolute inset-0 opacity-[0.04] ${isDark ? 'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBtMCA0MEw0MCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+\')]' : 'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBtMCA0MEw0MCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+\')]'}`} />

      {/* Floating particles — more and brighter */}
      {particles.map((p) => (
        <motion.div
          key={p.key}
          className={`absolute rounded-full ${isDark ? 'bg-white' : 'bg-gray-700'}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise / grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
