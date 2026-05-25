import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function WorkspacePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/20">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          欢迎，{user?.name}
        </h1>
        <p className="text-neutral-500 mb-8">
          工作台正在构建中 — 下一步将是无限画布编辑器
        </p>

        <div className="glass-strong rounded-2xl p-8 mb-8 text-left">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">即将到来</h3>
          <ul className="space-y-3">
            {[
              '无限缩放与拖拽画布',
              'AI 智能创作工具',
              '图形与文字编辑',
              '实时团队协作',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-neutral-600">
                <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                    <path d="M4 8l2.5 2.5L12 5" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-xl border-2 border-neutral-200 text-neutral-600 text-sm font-medium hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
