import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputFieldProps {
  label: string
  type?: string
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
  error?: string
  autoFocus?: boolean
}

export default function InputField({
  label,
  type = 'text',
  icon,
  value,
  onChange,
  error,
  autoFocus,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const isActive = focused || value.length > 0

  return (
    <div className="relative">
      <motion.div
        className={cn(
          'relative rounded-xl border-2 transition-colors duration-200',
          error
            ? 'border-red-400 bg-red-50/50'
            : focused
              ? 'border-primary-500 bg-primary-50/30'
              : 'border-neutral-200 bg-white hover:border-neutral-300',
        )}
        animate={{
          boxShadow: focused
            ? '0 0 0 4px rgba(99, 102, 241, 0.08)'
            : error
              ? '0 0 0 4px rgba(239, 68, 68, 0.08)'
              : '0 0 0 0px rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center px-4 py-3.5">
          <motion.span
            className={cn(
              'shrink-0 transition-colors duration-200',
              isActive ? 'text-primary-500' : error ? 'text-red-400' : 'text-neutral-400',
            )}
          >
            {icon}
          </motion.span>

          <div className="relative ml-3 flex-1">
            <motion.label
              className={cn(
                'absolute left-0 pointer-events-none text-base transition-all duration-200',
                isActive
                  ? '-top-5 text-xs text-primary-500'
                  : 'top-0 text-neutral-400 leading-[48px]',
                error && isActive && 'text-red-400',
              )}
              initial={false}
              animate={{
                y: isActive ? -8 : 0,
                scale: isActive ? 0.85 : 1,
              }}
            >
              {label}
            </motion.label>

            <input
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoFocus={autoFocus}
              className="w-full bg-transparent text-neutral-900 text-base outline-none placeholder:text-transparent autofill:bg-transparent"
              autoComplete={isPassword ? 'current-password' : 'email'}
            />
          </div>

          {isPassword && value && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="shrink-0 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </motion.div>

      {/* Error message */}
      <motion.p
        className="text-red-500 text-xs mt-1.5 ml-1"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: error ? 1 : 0, y: error ? 0 : -4 }}
        transition={{ duration: 0.15 }}
      >
        {error || ' '}
      </motion.p>
    </div>
  )
}
