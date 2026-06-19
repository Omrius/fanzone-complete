import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import {
  Calendar, MapPin, Users, Heart, Star, ArrowLeft,
  Trophy, Music, Mic, Gamepad2, Palette, Globe, Utensils, Briefcase
} from 'lucide-react'
import type { Event } from '../types'

const CATEGORY_ICONS: Record<string, any> = {
  sport: Trophy, concert: Music, karaoke: Mic, gaming: Gamepad2,
  art: Palette, culture: Globe, food: Utensils, business: Briefcase, other: Star,
}

const STRIPE_PK = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const EDGE_URL = 'https://ibiuhcjzygitsqsjedgm.supabase.co/functions/v1/stripe-payment'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [supports, setSupports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [supportAmount, setSupportAmount] = useState(10)
  const [sponsorAmount, setSponsorAmount] = useState(100)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => { if (id) fetchEvent() }, [id])

  async function fetchEvent() {
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('events')
        .select('*, creator:profiles(id, username, avatar_url)')
        .eq('id', id)
        .single()
      if (data) setEvent(data as Event)

      const { data: supData } = await supabase
        .from('event_supports')
        .select('*, user:profiles(username, avatar_url)')
        .eq('event_id', id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
      setSupports(supData || [])
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  async function handlePayment(type: 'support' | 'sponsor', amountEUR: number) {
    if (!isAuthenticated || !user) { navigate('/auth'); return }
    setIsProcessing(true)
    try {
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountEUR * 100,
          currency: 'eur',
          event_id: id,
          user_id: user.id,
          type,
        }),
      })
      const { client_secret, payment_intent_id, error } = await res.json()
      if (error) throw new Error(error)

      const stripe = await loadStripe(STRIPE_PK)
      if (!stripe) throw new Error('Stripe not loaded')

      const { error: confirmError } = await stripe.confirmPayment({
        clientSecret: client_secret,
        confirmParams: { return_url: `${window.location.origin}/event/${id}` },
      })
      if (confirmError) throw new Error(confirmError.message)

      await supabase.from('event_supports').insert({
        event_id: id,
        user_id: user.id,
        amount: amountEUR,
        type,
        status: 'completed',
        stripe_payment_intent_id: payment_intent_id,
      })

      alert(`${type === 'support' ? 'Soutien' : 'Sponsoring'} effectue avec succes !`)
      fetchEvent()
    } catch (err: any) {
      alert(err.message || 'Erreur de paiement')
    } finally { setIsProcessing(false) }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!event) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">Evenement introuvable</p>
      <Link to="/events" className="text-fanzone-accent mt-4 inline-block">Retour aux evenements</Link>
    </div>
  )

  const CatIcon = CATEGORY_ICONS[event.category] || Star
  const totalSupported = supports.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="glass-card p-0 overflow-hidden mb-8">
          <div className="h-64 md:h-80 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative">
            {event.cover_image ? (
              <img src={event.cover_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <CatIcon className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-fanzone-dark via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-fanzone-accent text-sm font-semibold uppercase">{event.category}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {event.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.event_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.city}, {event.country}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {supports.length} soutiens</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-8">{event.description}</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-5 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{event.ticket_price > 0 ? `${event.ticket_price} EUR` : 'Gratuit'}</div>
                <div className="text-sm text-gray-400">Prix du billet</div>
              </div>
              <div className="glass-card p-5 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{totalSupported.toFixed(0)} EUR</div>
                <div className="text-sm text-gray-400">Soutiens recus</div>
              </div>
              <div className="glass-card p-5 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{supports.length}</div>
                <div className="text-sm text-gray-400">Contributeurs</div>
              </div>
            </div>

            {/* Support section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart className="w-5 h-5 text-fanzone-accent" /> Soutenir l'evenement</h3>
                <p className="text-sm text-gray-400 mb-4">Contribuez au financement de cet evenement</p>
                <div className="flex items-center gap-3 mb-4">
                  <input type="number" min="5" value={supportAmount} onChange={(e) => setSupportAmount(Math.max(5, Number(e.target.value)))} className="input-field w-24 text-center" />
                  <span className="text-gray-400">EUR</span>
                </div>
                <button onClick={() => handlePayment('support', supportAmount)} disabled={isProcessing} className="w-full btn-primary disabled:opacity-50">
                  {isProcessing ? 'Traitement...' : `Soutenir (${supportAmount} EUR)`}
                </button>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-fanzone-purple" /> Sponsoriser</h3>
                <p className="text-sm text-gray-400 mb-4">Devenez sponsor de cet evenement</p>
                <div className="flex items-center gap-3 mb-4">
                  <input type="number" min="50" value={sponsorAmount} onChange={(e) => setSponsorAmount(Math.max(50, Number(e.target.value)))} className="input-field w-24 text-center" />
                  <span className="text-gray-400">EUR</span>
                </div>
                <button onClick={() => handlePayment('sponsor', sponsorAmount)} disabled={isProcessing} className="w-full btn-primary bg-gradient-to-r from-fanzone-purple to-fanzone-blue disabled:opacity-50">
                  {isProcessing ? 'Traitement...' : `Sponsoriser (${sponsorAmount} EUR)`}
                </button>
              </div>
            </div>

            {/* Supporters list */}
            {supports.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Soutiens recents</h3>
                <div className="space-y-3">
                  {supports.slice(0, 10).map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple flex items-center justify-center text-sm font-bold">
                        {s.user?.username?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.user?.username || 'Anonyme'}</p>
                        <p className="text-xs text-gray-400">{s.type === 'sponsor' ? 'Sponsor' : 'Soutien'}</p>
                      </div>
                      <span className="font-bold text-fanzone-accent">{s.amount} EUR</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
