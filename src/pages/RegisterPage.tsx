import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputField from '@/components/login/InputField'
import { useAuthStore } from '@/store/authStore'
import type { RegisterFormData, RegisterErrors } from '@/types/auth'

function validateForm(data: RegisterFormData): RegisterErrors {
  const errors: RegisterErrors = {}
  if (!data.name.trim()) {
    errors.name = '请输入用户名'
  } else if (data.name.trim().length < 2) {
    errors.name = '用户名至少需要2个字符'
  }
  if (!data.email) {
    errors.email = '请输入邮箱地址'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '请输入有效的邮箱地址'
  }
  if (!data.password) {
    errors.password = '请输入密码'
  } else if (data.password.length < 6) {
    errors.password = '密码至少需要6个字符'
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(data.password)) {
    errors.password = '密码需包含字母和数字'
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = '请确认密码'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = '两次密码不一致'
  }
  if (!data.agreeTerms) {
    errors.agreeTerms = '请阅读并同意服务条款'
  }
  return errors
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()

  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [registerError, setRegisterError] = useState('')
  const [step, setStep] = useState(0) // 0=info, 1=password

  const updateField = <K extends keyof RegisterFormData>(key: K, value: RegisterFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
    setRegisterError('')
  }

  const handleNext = () => {
    const stepErrors: RegisterErrors = {}
    if (!form.name.trim()) stepErrors.name = '请输入用户名'
    else if (form.name.trim().length < 2) stepErrors.name = '用户名至少需要2个字符'
    if (!form.email) stepErrors.email = '请输入邮箱地址'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) stepErrors.email = '请输入有效的邮箱地址'

    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) {
      setStep(1)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validation = validateForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    try {
      await register(form.name, form.email, form.password)
      navigate('/workspace', { replace: true })
    } catch {
      setRegisterError('注册失败，请稍后再试')
    }
  }

  return (
    <div className="flex min-h-dvh w-dvw overflow-hidden">
      {/* Left: Decorative panel */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden bg-gradient-to-br from-primary-950 via-[#1e1238] to-[#0f0724] items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">加入 Diploma Mouse</h2>
            <p className="text-white/50 text-lg max-w-sm mx-auto leading-relaxed">
              编织想象，无界创生
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-10 bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2.5 mb-10"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md shadow-primary-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-neutral-800">Diploma Mouse</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">创建账号</h2>
            <p className="text-neutral-500 mt-2 text-sm">新一代图生图 · 图生视频，零门槛创作</p>
          </motion.div>

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 mb-8 justify-center"
          >
            {[0, 1].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    step >= s
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {s + 1}
                </div>
                {s === 0 && <div className={`w-8 h-0.5 transition-colors duration-300 ${step > 0 ? 'bg-primary-300' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={(e) => { e.preventDefault(); handleNext() }}
                noValidate
              >
                <div className="space-y-5">
                  <InputField
                    label="用户名"
                    icon={<User size={20} />}
                    value={form.name}
                    onChange={(v) => updateField('name', v)}
                    error={errors.name}
                    autoFocus
                  />
                  <InputField
                    label="邮箱地址"
                    type="email"
                    icon={<Mail size={20} />}
                    value={form.email}
                    onChange={(v) => updateField('email', v)}
                    error={errors.email}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 text-white font-semibold text-base shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    下一步
                  </button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="space-y-5">
                  <InputField
                    label="密码"
                    type="password"
                    icon={<Lock size={20} />}
                    value={form.password}
                    onChange={(v) => updateField('password', v)}
                    error={errors.password}
                    autoFocus
                  />
                  <InputField
                    label="确认密码"
                    type="password"
                    icon={<Lock size={20} />}
                    value={form.confirmPassword}
                    onChange={(v) => updateField('confirmPassword', v)}
                    error={errors.confirmPassword}
                  />
                </div>

                {/* Terms checkbox */}
                <div className="mt-5">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => updateField('agreeTerms', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 transition-all duration-150 ${
                          form.agreeTerms
                            ? 'bg-primary-500 border-primary-500'
                            : errors.agreeTerms
                              ? 'border-red-400'
                              : 'border-neutral-300 group-hover:border-neutral-400'
                        }`}
                      >
                        {form.agreeTerms && (
                          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M4 8l2.5 2.5L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm ${errors.agreeTerms ? 'text-red-500' : 'text-neutral-500 group-hover:text-neutral-700'} transition-colors`}>
                      我已阅读并同意{' '}
                      <button type="button" className="text-primary-500 hover:text-primary-600 underline underline-offset-2">
                        服务条款
                      </button>
                      {' '}和{' '}
                      <button type="button" className="text-primary-500 hover:text-primary-600 underline underline-offset-2">
                        隐私政策
                      </button>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.agreeTerms}</p>
                  )}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {registerError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center"
                    >
                      {registerError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex-1 py-3.5 rounded-xl border-2 border-neutral-200 text-neutral-600 font-semibold text-base transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    返回
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 text-white font-semibold text-base shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        注册中...
                      </span>
                    ) : '注册'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-neutral-500 mt-8"
          >
            已有账号？{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              立即登录
            </button>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
