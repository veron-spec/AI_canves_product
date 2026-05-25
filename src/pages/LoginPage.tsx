import ParticleBackground from '@/components/login/ParticleBackground'
import FormPanel from '@/components/login/FormPanel'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 lg:px-10">
        <FormPanel />
      </div>
    </div>
  )
}
