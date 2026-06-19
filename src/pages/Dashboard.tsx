import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Navigate } from 'react-router-dom'
import { DollarSign, Users, Heart, TrendingUp, CreditCard, Settings, BarChart3, Wallet } from 'lucide-react'
import type { Transaction } from '../types'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id && user.role === 'creator') fetchDashboardData()
  }, [user])

  async function fetchDashboardData() {
    try {
      const { data: earningsData } = await supabase.from('transactions').select('amount').eq('user_id', user!.id).eq('type', 'tip_received').eq('status', 'completed')
      const total = earningsData?.reduce((sum, t) => sum + t.amount, 0) || 0
      const { data: transactionsData } = await supabase.from('transactions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10)
      setTotalEarnings(total)
      setTransactions(transactionsData || [])
    } catch (error) { console.error('Error:', error) }
    finally { setIsLoading(false) }
  }

  if (authLoading || isLoading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  if (!isAuthenticated) return <Navigate to="/auth" />
  if (user?.role !== 'creator') return <Navigate to="/" />

  const statCards = [
    { label: 'Gains totaux', value: `${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Ce mois', value: `${(totalEarnings * 0.3).toFixed(2)}`, icon: TrendingUp, color: 'text-fanzone-accent' },
    { label: 'Tips recus', value: transactions.filter(t => t.type === 'tip_received').length.toString(), icon: Heart, color: 'text-pink-400' },
    { label: 'Abonnes', value: '0', icon: Users, color: 'text-blue-400' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold mb-2">Dashboard Createur</h1><p className="text-gray-400">Suivez vos performances et gerez votre contenu</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4"><stat.icon className={`w-8 h-8 ${stat.color}`} /><span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded">+12%</span></div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{icon: BarChart3, label: 'Analytics', color: 'text-fanzone-accent'}, {icon: CreditCard, label: 'Paiements', color: 'text-fanzone-purple'}, {icon: Wallet, label: 'Retirer', color: 'text-green-400'}, {icon: Settings, label: 'Parametres', color: 'text-gray-400'}].map((item) => (
                <button key={item.label} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} /><span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Transactions recentes</h2>
            {transactions.length === 0 ? <p className="text-gray-400 text-center py-8">Aucune transaction encore</p> : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'tip_received' ? 'bg-green-400/20' : 'bg-fanzone-accent/20'}`}>
                        {tx.type === 'tip_received' ? <DollarSign className="w-5 h-5 text-green-400" /> : <Heart className="w-5 h-5 text-fanzone-accent" />}
                      </div>
                      <div><p className="font-medium text-sm">{tx.description}</p><p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p></div>
                    </div>
                    <span className={`font-semibold ${tx.type === 'tip_received' ? 'text-green-400' : 'text-fanzone-accent'}`}>{tx.type === 'tip_received' ? '+' : '-'}{tx.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Paiements Stripe</h2>
            {(user as any)?.stripe_onboarding_complete ? (
              <div className="flex items-center gap-3 p-4 bg-green-400/10 rounded-xl border border-green-400/20">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div><p className="text-sm font-medium text-green-400">Connecte</p><p className="text-xs text-gray-400">Vous pouvez recevoir des paiements</p></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div><p className="text-sm font-medium text-yellow-400">En attente</p><p className="text-xs text-gray-400">Completez votre onboarding Stripe</p></div>
                </div>
                <button className="w-full btn-primary text-sm">Connecter Stripe</button>
              </div>
            )}
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Top supporters</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple flex items-center justify-center text-sm font-bold">{i}</div>
                  <div className="flex-1"><p className="text-sm font-medium">Fan Anonyme</p><p className="text-xs text-gray-400">{50 - i * 10} de tips</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}