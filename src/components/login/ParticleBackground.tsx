import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const createParticle = (w: number, h: number): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    })

    const initParticles = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const count = Math.floor((w * h) / 2500)
      particlesRef.current = Array.from({ length: Math.max(count, 50) }, () => createParticle(w, h))
    }

    const animate = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      ctx.clearRect(0, 0, w, h)

      for (const particle of particlesRef.current) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = w
        if (particle.x > w) particle.x = 0
        if (particle.y < 0) particle.y = h
        if (particle.y > h) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.02 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#080312] via-[#0c0820] to-[#080312]" />
      
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#6366f1]/10" style={{ filter: 'blur(100px)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#a855f7]/10" style={{ filter: 'blur(120px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#ec4899]/10" style={{ filter: 'blur(110px)' }} />
    </div>
  )
}
