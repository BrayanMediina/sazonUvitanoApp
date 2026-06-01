import { useState } from 'react'
import { useAppStore } from '../../store'
import { Navigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function LoginPage() {
  const user = useAppStore((s) => s.user)
  const [tab, setTab] = useState<'login' | 'register'>('login')

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Header con logo */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <img
          src="/assets/logo.jpeg"
          alt="El Sazón Uvitano"
          className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-200 shadow-soft mb-4"
        />
        <h1 className="text-2xl font-bold text-brand-900 font-heading">El Sazón Uvitano</h1>
        <p className="text-sm text-stone-400 mt-1">Sistema de gestión operativa</p>
      </div>

      {/* Pill switcher */}
      <div className="mx-6 mb-6">
        <div className="flex bg-stone-100 rounded-2xl p-1 gap-1">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                tab === t
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-stone-400'
              }`}
            >
              {t === 'login' ? 'Acceder' : 'Registrarse'}
            </button>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 px-6 pb-10">
        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
