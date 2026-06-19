import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Mail, Bell, Shield, Camera } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ username: user?.username || '', bio: user?.bio || '', email: user?.email || '' })

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.from('profiles').update({ username: formData.username, bio: formData.bio, updated_at: new Date().toISOString() }).eq('id', user!.id)
      if (error) throw error
      alert('Profil mis a jour')
    } catch (error: any) { alert(error.message) }
    finally { setIsLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Parametres</h1>
      <div className="space-y-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-fanzone-accent" />
            <h2 className="text-lg font-semibold">Profil public</h2>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" className="w-24 h-24 rounded-full bg-white/10" />
              <button className="absolute bottom-0 right-0 p-2 bg-fanzone-accent rounded-full hover:opacity-90 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="font-medium">Photo de profil</p>
              <p className="text-sm text-gray-400">JPG, PNG ou GIF. Max 2MB.</p>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} className="input-field resize-none" placeholder="Parlez-nous de vous..." />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-fanzone-purple" />
            <h2 className="text-lg font-semibold">Compte</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={formData.email} disabled className="input-field opacity-50" />
              <p className="text-xs text-gray-400 mt-1">Contactez le support pour changer d'email</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {['Nouveaux tips', 'Nouveaux abonnes', 'Nouveaux messages', 'Mises a jour de la plateforme'].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <button className="w-12 h-6 rounded-full bg-fanzone-accent relative">
                  <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">Securite</h2>
          </div>
          <button className="btn-secondary text-sm w-full mb-3">Changer le mot de passe</button>
          <button className="btn-secondary text-sm w-full text-red-400 border-red-400/20 hover:bg-red-400/10">Supprimer le compte</button>
        </div>
      </div>
    </div>
  )
}