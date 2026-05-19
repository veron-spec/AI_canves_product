import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import LaunchPage from './pages/LaunchPage'
import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WorkspacePage from './pages/WorkspacePage'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
