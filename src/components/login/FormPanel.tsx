import { useState, type FormEvent } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import InputField from './InputField'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import type { LoginErrors, LoginFormData } from '@/types/auth'

function validateForm(data: LoginFormData): LoginErrors {
  const errors: LoginErrors = {}
  if (!data.email) {
    errors.email = '请输入邮箱地址'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '请输入有效的邮箱地址'
  }
  if (!data.password) {
    errors.password = '请输入密码'
  } else if (data.password.length < 6) {
    errors.password = '密码至少需要6个字符'
  }
  return errors
}

export default function FormPanel() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loginError, setLoginError] = useState('')

  const updateField = <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
    setLoginError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validation = validateForm(form)
    setErrors(validation)

    if (Object.keys(validation).length > 0) return

    try {
      await login(form.email, form.password)
      navigate('/workspace', { replace: true })
    } catch {
      setLoginError('登录失败，请检查邮箱和密码')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl shadow-primary-500/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white">Diploma Mouse</span>
      </div>

      <div className="text-center mb-8">
        <p className="text-white/60 text-base">小手一点，轻轻一拽，图就有了</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          <InputField
            label="邮箱地址"
            type="email"
            icon={<Mail size={20} />}
            value={form.email}
            onChange={(v) => updateField('email', v)}
            error={errors.email}
            autoFocus
          />

          <InputField
            label="密码"
            type="password"
            icon={<Lock size={20} />}
            value={form.password}
            onChange={(v) => updateField('password', v)}
            error={errors.password}
          />
        </div>

        <div className="flex items-center justify-between mt-5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => updateField('rememberMe', e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 transition-all duration-150 ${
                  form.rememberMe
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-white/30 group-hover:border-white/50'
                }`}
              >
                {form.rememberMe && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M4 8l2.5 2.5L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
              记住我
            </span>
          </label>

          <button
            type="button"
            className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            忘记密码？
          </button>
        </div>

        <AnimatePresence>
          {loginError && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
              {loginError}
            </div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 text-white font-semibold text-base shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                登录中...
              </span>
            ) : (
              '登录'
            )}
          </button>
        </div>

        <div className="mt-5 text-center">
          <span className="text-sm text-white/60">还没有账号？</span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="ml-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-2 decoration-primary-400/30 hover:decoration-primary-400/60"
          >
            立即注册
          </button>
        </div>
      </form>

      <div className="mt-6 flex gap-3">
        {[
          {
            name: 'Google',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            ),
          },
          {
            name: 'GitHub',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/90">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            ),
          },
        ].map((provider) => (
          <button
            key={provider.name}
            type="button"
            className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 border-white/20 bg-white/5 text-white/80 text-sm font-medium transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
          >
            {provider.icon}
            <span className="hidden sm:inline">{provider.name}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-xs text-white/40 font-medium">更多方式</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  )
}
