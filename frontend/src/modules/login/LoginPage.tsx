import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import { login, register } from '../../services/api'
import { useAppStore } from '../../store'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const navigate = useNavigate()
  const setUser = useAppStore((state) => state.setUser)

  const handleLogin = async (data: { document: string; password: string }) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await login(data)
      setUser(response.user, response.accessToken)
      localStorage.setItem('sazon-access', response.accessToken)
      localStorage.setItem('sazon-refresh', response.refreshToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: {
    name: string
    document: string
    email?: string
    phone?: string
    password: string
    role: string
  }) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await register(data as any)
      setUser(response.user, response.accessToken)
      localStorage.setItem('sazon-access', response.accessToken)
      localStorage.setItem('sazon-refresh', response.refreshToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-10">
      {/* Glow decorativo sutil */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-amber-200/50 blur-md" />
              <img
                src="/assets/logo.jpeg"
                alt="El Sazón Uvitano"
                className="relative h-24 w-24 rounded-full object-cover ring-2 ring-amber-300"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            El Sazón Uvitano
          </h1>
          <p className="mt-1 text-[10px] font-bold tracking-[0.22em] uppercase text-amber-600">
            Tradición en cada bocado
          </p>
          <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-amber-50">
          {/* Tabs */}
          <div className="mb-6 flex rounded-2xl bg-stone-100 p-1">
            <button
              onClick={() => { setIsLoginMode(true); setError(undefined) }}
              className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-95 ${
                isLoginMode
                  ? 'bg-amber-700 text-white shadow'
                  : 'text-stone-400'
              }`}
            >
              Acceder
            </button>
            <button
              onClick={() => { setIsLoginMode(false); setError(undefined) }}
              className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-95 ${
                !isLoginMode
                  ? 'bg-amber-700 text-white shadow'
                  : 'text-stone-400'
              }`}
            >
              Registrarse
            </button>
          </div>

          {isLoginMode ? (
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
          )}

          <p className="mt-6 text-center text-xs text-stone-400">
            {isLoginMode ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => { setIsLoginMode(!isLoginMode); setError(undefined) }}
              className="min-h-[44px] font-semibold text-amber-600 active:text-amber-800 transition-colors"
            >
              {isLoginMode ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Sistema de operaciones · El Sazón Uvitano
        </p>
      </div>
    </div>
  )
}