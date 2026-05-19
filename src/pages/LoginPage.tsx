import CanvasBackground from '@/components/login/CanvasBackground'
import FormPanel from '@/components/login/FormPanel'

export default function LoginPage() {
  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      {/* Left: Dynamic Canvas */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%]">
        <CanvasBackground />
      </div>

      {/* Right: Login Form — scrollable on small screens */}
      <div className="flex-1 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 overflow-y-auto">
        <FormPanel />
      </div>
    </div>
  )
}
