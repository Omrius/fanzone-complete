import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  className?: string
}

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const variants = {
    up: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -80 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
