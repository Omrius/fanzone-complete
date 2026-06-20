import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', username: '', role: 'fan' as 'fan' | 'creator' })
  const { signIn, signUp, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.username, formData.role)
        alert(t('auth.signUpSuccess'))
      } else {
        await signIn(formData.email, formData.password)
        navigate('/')
      }
    } catch (error: any) {
      alert(error.message || t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Zap className="w-12 h-12 text-fanzone-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{isSignUp ? t('auth.welcomeSignUp') : t('auth.welcomeSignIn')}</h1>
            <p className="text-gray-400">{isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => signInWithOAuth('google')} className="btn-secondary flex items-center justify-center gap-2 text-sm">{t('auth.google')}</button>
            <button onClick={() => signInWithOAuth('github')} className="btn-secondary flex items-center justify-center gap-2 text-sm">{t('auth.github')}</button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-fanzone-card text-gray-400">{t('auth.orWithEmail')}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.username')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field pl-10" placeholder="votre_pseudo" required />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field pl-10" placeholder="vous@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.iAmA')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, role: 'fan' })}
                    className={`p-3 rounded-xl border transition-all ${formData.role === 'fan' ? 'border-fanzone-accent bg-fanzone-accent/10' : 'border-white/10'}`}>
                    <div className="text-lg mb-1">{t('auth.fan')}</div><div className="font-medium text-sm">{t('auth.fan')}</div><div className="text-xs text-gray-400">{t('auth.fanDescription')}</div>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, role: 'creator' })}
                    className={`p-3 rounded-xl border transition-all ${formData.role === 'creator' ? 'border-fanzone-accent bg-fanzone-accent/10' : 'border-white/10'}`}>
                    <div className="text-lg mb-1">{t('auth.creator')}</div><div className="font-medium text-sm">{t('auth.creator')}</div><div className="text-xs text-gray-400">{t('auth.creatorDescription')}</div>
                  </button>
                </div>
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-fanzone-accent hover:underline font-medium">{isSignUp ? t('auth.signIn') : t('auth.signUp')}</button>
          </p>
        </div>
      </div>
    </div>
  )
}
