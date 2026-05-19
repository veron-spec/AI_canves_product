import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function LaunchPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Diploma Mouse'
  }, [])

  return (
    <div
      className="fixed inset-0 bg-[#080312] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={() => navigate('/splash')}
    >
      {/* Animated glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#6366f1]/10"
          style={{
            filter: 'blur(100px)',
            animation: 'floatOrb1 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#a855f7]/10"
          style={{
            filter: 'blur(120px)',
            animation: 'floatOrb2 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#ec4899]/10"
          style={{
            filter: 'blur(110px)',
            animation: 'pulseGlow 5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Logo */}
      <div
        className="relative z-10 flex flex-col items-center gap-5"
        style={{ animation: 'fadeUp 0.8s ease-out both' }}
      >
        <div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#9333ea] to-[#ec4899] flex items-center justify-center shadow-2xl shadow-[#6366f1]/25"
          style={{ animation: 'floatIcon 3s ease-in-out infinite' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white/90 tracking-tight">
          Diploma Mouse
        </h1>
      </div>

      {/* Click hint */}
      <p
        className="absolute bottom-12 text-xs text-white/20 tracking-[0.3em]"
        style={{ animation: 'fadeUp 0.8s 0.6s ease-out both' }}
      >
        <span
          style={{ animation: 'blink 2.5s ease-in-out infinite' }}
        >
          点击任意处进入
        </span>
      </p>

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 20px); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
