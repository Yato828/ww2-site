import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

export default function AnimatedThread({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const length = useSpring(scrollYProgress, { stiffness: 50, damping: 22 })
  const reduced = useReducedMotion()
  return <div ref={ref} className={`animated-thread ${className}`} aria-hidden="true"><svg viewBox="0 0 800 600" preserveAspectRatio="none"><path d="M780 0C750 150 370 50 390 210S50 270 100 410 600 450 590 600" fill="none" stroke="currentColor" strokeWidth="1" opacity=".14" /><motion.path d="M780 0C750 150 370 50 390 210S50 270 100 410 600 450 590 600" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ pathLength: reduced ? 1 : length }} /></svg></div>
}
