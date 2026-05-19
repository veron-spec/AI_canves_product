import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Layers } from 'lucide-react'

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
}

export default function TransitionPage() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exiting, setExiting] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dots: Dot[] = []
    let time = 0
    let mouseX = -999
    let mouseY = -999

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const spawn = (w: number, h: number) => {
      for (let i = 0; i < 2; i++) {
        dots.push({
          x: Math.random() * w,
          y: h + 10,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -(0.15 + Math.random() * 0.3),
          size: 1.5 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.3,
          life: 0,
          maxLife: 500 + Math.random() * 500,
        })
      }
    }

    const animate = (timestamp: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      time = timestamp * 0.001

      ctx.clearRect(0, 0, w, h)

      // Background gradient — subtle deep purple
      const bg = ctx.createRadialGradient(
        w * 0.5 + Math.sin(time * 0.04) * w * 0.1,
        h * 0.4 + Math.cos(time * 0.03) * h * 0.1,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.75,
      )
      bg.addColorStop(0, '#1a1040')
      bg.addColorStop(0.5, '#0f0724')
      bg.addColorStop(1, '#080312')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Dots floating upward
      spawn(w, h)
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i]
        d.x += d.vx
        d.y += d.vy
        d.life++
        d.alpha *= 0.998

        // Mouse interaction — gentle displacement
        const dx = d.x - mouseX
        const dy = d.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          d.x += (dx / dist) * force * 0.8
          d.y += (dy / dist) * force * 0.8
        }

        if (d.life > d.maxLife || d.alpha < 0.01 || d.y < -20) {
          dots.splice(i, 1)
          continue
        }

        const lifeRatio = d.life / d.maxLife
        const fadeAlpha = d.alpha * (1 - lifeRatio) * 2
        if (fadeAlpha > 0) {
          ctx.fillStyle = `rgba(167, 139, 250, ${fadeAlpha})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.size * (1 - lifeRatio * 0.3), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const handleLeave = () => { mouseX = -999; mouseY = -999 }

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleClick = () => {
    setExiting(true)
    setTimeout(() => navigate('/login'), 700)
  }

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="transition"
          className="fixed inset-0 overflow-hidden bg-[#080312] cursor-pointer select-none"
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Soft vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,3,18,0.5)_100%)]" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8"
            >
              <motion.div
                className="absolute -inset-10 rounded-full bg-gradient-to-r from-primary-500/15 via-purple-500/15 to-pink-500/15 blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-primary-500/25"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Layers size={38} className="text-white" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            {/* Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight"
            >
              Diploma Mouse
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-sm text-white/30 font-light tracking-wide"
            >
              编织想象，无界创生
            </motion.p>

            {/* Click hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.span
                className="text-xs text-white/20 tracking-[0.3em]"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                点击任意处继续
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="transition-exit"
          className="fixed inset-0 bg-[#080312]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  )
}
