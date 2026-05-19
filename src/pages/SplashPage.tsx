import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Layers, Sparkles, Wand2, Video, MousePointer2 } from 'lucide-react'

interface Orb {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  alpha: number
  pulse: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
}

const ORB_COLORS = [
  'rgba(99, 102, 241, {alpha})',
  'rgba(139, 92, 246, {alpha})',
  'rgba(236, 72, 153, {alpha})',
  'rgba(59, 130, 246, {alpha})',
  'rgba(168, 85, 247, {alpha})',
]

const features = [
  {
    icon: Wand2,
    title: '图生图',
    desc: '以图生图，风格迁移',
    detail: '上传一张图片，AI 即刻理解你的意图，生成无限变体。从草图到完稿，转瞬之间。',
    gradient: 'from-primary-500 to-blue-500',
    bgGlow: 'bg-primary-500/10',
  },
  {
    icon: Video,
    title: '图生视频',
    desc: '静态图像，动态演绎',
    detail: '让静止的画面活起来。AI 驱动的智能补帧与运动生成，赋予图像生命力。',
    gradient: 'from-purple-500 to-pink-500',
    bgGlow: 'bg-purple-500/10',
  },
  {
    icon: MousePointer2,
    title: '零门槛',
    desc: '三岁稚童都能用',
    detail: '无需学习，无需专业技能。直觉化的交互设计，让每个人都能释放创造力。',
    gradient: 'from-amber-500 to-rose-500',
    bgGlow: 'bg-amber-500/10',
  },
]

export default function SplashPage() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)
  const rafRef = useRef<number>(0)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let orbs: Orb[] = []
    let particles: Particle[] = []
    let time = 0
    let mouseX = 0
    let mouseY = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const init = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      orbs = Array.from({ length: 6 }, (_, i) => ({
        x: w * (0.1 + Math.random() * 0.8),
        y: h * (0.1 + Math.random() * 0.8),
        radius: 100 + Math.random() * 220,
        color: ORB_COLORS[i % ORB_COLORS.length],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: 0.1 + Math.random() * 0.18,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const spawnParticles = (w: number, h: number) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.15,
          size: 1 + Math.random() * 2.5,
          alpha: 0.15 + Math.random() * 0.35,
          life: 0,
          maxLife: 400 + Math.random() * 400,
        })
      }
    }

    const animate = (timestamp: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      time = timestamp * 0.001

      ctx.clearRect(0, 0, w, h)

      // Deep background
      const bg = ctx.createRadialGradient(
        w * (0.3 + Math.sin(time * 0.06) * 0.2),
        h * (0.3 + Math.cos(time * 0.05) * 0.2),
        0,
        w * 0.5, h * 0.5,
        w * 0.9,
      )
      bg.addColorStop(0, '#1a1040')
      bg.addColorStop(0.4, '#0f0724')
      bg.addColorStop(1, '#080312')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Subtle grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.012)'
      ctx.lineWidth = 0.5
      const gs = 60
      for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      // Orbs
      for (const orb of orbs) {
        orb.pulse += 0.008
        orb.x += orb.vx + Math.sin(time * 0.2 + orb.radius) * 0.12
        orb.y += orb.vy + Math.cos(time * 0.18 + orb.radius) * 0.12

        if (mouseX > 0 && mouseY > 0) {
          const dx = orb.x - mouseX; const dy = orb.y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 350) {
            const f = (350 - dist) / 350
            orb.x += (dx / dist) * f * 2.5
            orb.y += (dy / dist) * f * 2.5
          }
        }

        if (orb.x < -orb.radius) orb.x = w + orb.radius
        if (orb.x > w + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = h + orb.radius
        if (orb.y > h + orb.radius) orb.y = -orb.radius

        const pulseAlpha = orb.alpha * (0.6 + Math.sin(orb.pulse) * 0.4)
        const grd = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        grd.addColorStop(0, orb.color.replace('{alpha}', String(pulseAlpha)))
        grd.addColorStop(0.4, orb.color.replace('{alpha}', String(pulseAlpha * 0.35)))
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Particles
      spawnParticles(w, h)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        p.life++; p.alpha *= 0.996
        if (p.life > p.maxLife || p.alpha < 0.01) { particles.splice(i, 1); continue }
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha * (1 - p.life / p.maxLife)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize(); init()
    const hm = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top }
    const hl = () => { mouseX = 0; mouseY = 0 }
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', hm)
    canvas.addEventListener('mouseleave', hl)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', hm)
      canvas.removeEventListener('mouseleave', hl)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(() => navigate('/login'), 800)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="relative bg-[#080312]"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ═══════ HERO ═══════ */}
          <motion.div
            ref={heroRef}
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative h-dvh overflow-hidden"
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,3,18,0.7)_100%)]" />

            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-primary-500/15 to-transparent" />
            <div className="absolute top-0 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-primary-500/15 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
            <div className="absolute bottom-0 left-0 w-px h-1/2 bg-gradient-to-t from-transparent via-purple-500/15 to-transparent" />

            {/* Hero content */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs tracking-wider">
                  <Sparkles size={12} className="text-primary-400" />
                  新一代 AI 创意平台
                </div>
              </motion.div>

              {/* Logo icon */}
              <motion.div variants={itemVariants} className="relative mb-8">
                <motion.div
                  className="absolute -inset-10 rounded-full bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                  <Layers size={40} className="text-white" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Main title */}
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-white/60 bg-[length:200%_100%] animate-gradient">
                    Diploma Mouse
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg sm:text-xl text-white/40 font-light max-w-lg leading-relaxed"
              >
                编织想象，无界创生
              </motion.p>

              {/* Feature pills */}
              <motion.div variants={itemVariants} className="mt-6 flex flex-wrap justify-center gap-3">
                {['图生图', '图生视频', '零门槛'].map((f) => (
                  <span
                    key={f}
                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/35 text-xs tracking-wide"
                  >
                    {f}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={itemVariants} className="mt-12">
                <motion.button
                  onClick={handleEnter}
                  className="relative group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="absolute -inset-5 rounded-full bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative px-10 py-4 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-primary-500/25 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary-500/40 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Sparkles size={18} />
                      开始体验
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] text-white/15 tracking-[0.25em] uppercase">向下滚动</span>
                <motion.div
                  className="w-4 h-6 rounded-full border border-white/15 flex items-start justify-center p-1"
                >
                  <motion.div
                    className="w-1 h-1.5 rounded-full bg-white/30"
                    animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ═══════ FEATURES ═══════ */}
          <section className="relative px-6 py-24 sm:py-32 bg-gradient-to-b from-[#080312] via-[#0c0820] to-[#080312]">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-[120px]" />

            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16 sm:mb-20"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  优雅掌控，
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300">
                    极致生成
                  </span>
                </h2>
                <p className="mt-4 text-white/30 text-base sm:text-lg max-w-xl mx-auto">
                  新一代革命性图生图、图生视频，三岁的稚童都能用
                </p>
              </motion.div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
                  >
                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-2xl ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-5`}>
                        <feature.icon size={24} className="text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white/40 font-medium mb-3">{feature.desc}</p>

                      {/* Description */}
                      <p className="text-sm text-white/25 leading-relaxed">{feature.detail}</p>

                      {/* Bottom accent line */}
                      <div className={`mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-16 sm:mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center"
              >
                {[
                  { num: '99%', label: '生成准确率' },
                  { num: '0.3s', label: '极速推理' },
                  { num: '∞', label: '无限可能' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-purple-300">
                      {s.num}
                    </div>
                    <div className="text-xs text-white/25 mt-1 tracking-wide">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mt-16 sm:mt-20"
              >
                <motion.button
                  onClick={handleEnter}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:text-white/90 hover:border-white/20">
                    准备好开始了吗？
                    <span className="ml-2 text-primary-400 font-semibold">立即体验 →</span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* Footer hint */}
          <div className="text-center py-6 border-t border-white/[0.03]">
            <p className="text-xs text-white/10 tracking-wider">移动鼠标与画面互动 · Diploma Mouse</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
