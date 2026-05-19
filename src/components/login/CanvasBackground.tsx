import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Shape {
  x: number
  y: number
  size: number
  type: 'circle' | 'rect' | 'triangle'
  color: string
  rotation: number
  rotationSpeed: number
  velocityX: number
  velocityY: number
  opacity: number
}

const COLORS = [
  'rgba(99, 102, 241, {opacity})',
  'rgba(139, 92, 246, {opacity})',
  'rgba(236, 72, 153, {opacity})',
  'rgba(59, 130, 246, {opacity})',
  'rgba(168, 85, 247, {opacity})',
]

function createShape(canvasW: number, canvasH: number): Shape {
  const types: Shape['type'][] = ['circle', 'rect', 'triangle']
  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    size: 20 + Math.random() * 60,
    type: types[Math.floor(Math.random() * types.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    velocityX: (Math.random() - 0.5) * 0.3,
    velocityY: (Math.random() - 0.5) * 0.3,
    opacity: 0.06 + Math.random() * 0.12,
  }
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapesRef = useRef<Shape[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
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

    const initShapes = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const count = Math.floor((w * h) / 35000)
      shapesRef.current = Array.from({ length: Math.max(count, 15) }, () => createShape(w, h))
    }

    const drawTriangle = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath()
      ctx.moveTo(0, -size / 2)
      ctx.lineTo(-size / 2, size / 2)
      ctx.lineTo(size / 2, size / 2)
      ctx.closePath()
    }

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, time: number) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation + time * shape.rotationSpeed)

      const color = shape.color.replace('{opacity}', String(shape.opacity))
      ctx.fillStyle = color
      ctx.strokeStyle = shape.color.replace('{opacity}', String(shape.opacity * 2))
      ctx.lineWidth = 1.5

      switch (shape.type) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          break
        case 'rect':
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          break
        case 'triangle':
          drawTriangle(ctx, shape.size)
          ctx.fill()
          ctx.stroke()
          break
      }

      ctx.restore()
    }

    const drawConnections = (ctx: CanvasRenderingContext2D, shapes: Shape[]) => {
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[i].x - shapes[j].x
          const dy = shapes[i].y - shapes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(shapes[i].x, shapes[i].y)
            ctx.lineTo(shapes[j].x, shapes[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 * (1 - dist / 200)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = (timestamp: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const ctx2d = ctx

      timeRef.current = timestamp * 0.001

      ctx2d.clearRect(0, 0, w, h)

      // Subtle gradient background
      const gradient = ctx2d.createRadialGradient(
        w * 0.3 + Math.sin(timeRef.current * 0.1) * w * 0.1,
        h * 0.4 + Math.cos(timeRef.current * 0.15) * h * 0.1,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8,
      )
      gradient.addColorStop(0, `rgba(99, 102, 241, ${0.04 + Math.sin(timeRef.current * 0.05) * 0.02})`)
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.03 + Math.cos(timeRef.current * 0.07) * 0.015})`)
      gradient.addColorStop(1, `rgba(236, 72, 153, ${0.02 + Math.sin(timeRef.current * 0.06) * 0.01})`)
      ctx2d.fillStyle = gradient
      ctx2d.fillRect(0, 0, w, h)

      // Mouse interaction
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update shapes
      for (const shape of shapesRef.current) {
        shape.x += shape.velocityX
        shape.y += shape.velocityY

        // Mouse repulsion
        if (mx > 0 && my > 0) {
          const dx = shape.x - mx
          const dy = shape.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const force = (150 - dist) / 150
            shape.x += (dx / dist) * force * 1.5
            shape.y += (dy / dist) * force * 1.5
          }
        }

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = w + shape.size
        if (shape.x > w + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = h + shape.size
        if (shape.y > h + shape.size) shape.y = -shape.size
      }

      // Draw connections
      drawConnections(ctx2d, shapesRef.current)

      // Draw shapes
      for (const shape of shapesRef.current) {
        drawShape(ctx2d, shape, timeRef.current)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initShapes()

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 }
    }

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-primary-950 via-[#1e1238] to-[#0f0724]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0724]/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0724]/40 via-transparent to-transparent" />

      {/* Brand Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white/90 tracking-tight">Diploma Mouse</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300">
              编织想象，无界创生
            </span>
          </h1>

          <p className="text-base lg:text-lg text-white/50 max-w-md leading-relaxed font-light">
            新一代革命性图生图 · 图生视频
            <br />
            <span className="text-white/40">三岁的稚童都能用</span>
          </p>
          <p className="text-sm text-white/30 max-w-md mt-2 leading-relaxed font-light italic">
            「优雅掌控，极致生成」
          </p>
        </motion.div>

        {/* Feature indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-8 mt-12"
        >
          {[
            { label: '图生图', desc: '以图生图，创意无限' },
            { label: '图生视频', desc: '静态图像，动态演绎' },
            { label: '零门槛', desc: '三岁的稚童都能用' },
          ].map((item) => (
            <div key={item.label} className="group">
              <div className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-white/30 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
