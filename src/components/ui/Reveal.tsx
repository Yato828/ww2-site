import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay: reduced ? 0 : delay }}>{children}</motion.div>
}
