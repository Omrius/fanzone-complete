import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import {
  Trophy, Music, Mic, Gamepad2,
  Palette, Globe, Utensils, Briefcase, ArrowLeft, Zap, Check
} from 'lucide-react'
import CloudinaryUploader from '../components/CloudinaryUploader'

const STRIPE_PK = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const EDGE_URL = 'https://ibiuhcjzygitsqsjedgm.supabase.co/functions/v1/stripe-payment'
const ORGANIZER_FEE_EUR = 100

const CATEGORIES = [
  { id: 'sport', label: 'Sport', icon: Trophy },
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'karaoke', label: 'Karaoke', icon: Mic },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'culture', label: 'Culture', icon: Globe },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'other', label: 'Autre', icon: Zap },
]

export default function CreateEvent() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [userCountry, setUserCountry] = useState('FR')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'sport',
    city: '',
    event_date: '',
    ticket_price: 0,
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth'); return }
    detectCountry()
  }, [isAuthenticated])

  async function detectCountry() {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      if (data?.country_code) setUserCountry(data.country_code)
    } catch { setUserCountry('FR') }
  }

  async function handlePayAndCreate() {
    if (!user) { navigate('/auth'); return }
    setIsProcessing(true)
    try {
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: ORGANIZER_FEE_EUR * 100,
          currency: 'eur',
          event_id: 'new',
          user_id: user.id,
          type: 'event_organizer',
        }),
      })
      const { client_secret, error } = await res.json()
      if (error) throw new Error(error)

      const stripe = await loadStripe(STRIPE_PK)
      if (!stripe) throw new Error('Stripe not loaded')

      const { error: confirmError } = await stripe.confirmPayment({
        clientSecret: client_secret,
        confirmParams: { return_url: `${window.location.origin}/events` },
      })
      if (confirmError) throw new Error(confirmError.message)

      const { data: newEvent, error: insertError } = await supabase.from('events').insert({
        creator_id: user.id,
        title: form.title,
        description: form.description,
        category: form.category,
        country: userCountry,
        city: form.city,
        event_date: form.event_date,
        cover_image: coverImage || null,
        ticket_price: form.ticket_price,
        organizer_fee_paid: true,
        status: 'upcoming',
      }).select().single()

      if (insertError) throw insertError

      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'event_organizer',
        amount: ORGANIZER_FEE_EUR,
        description: `Frais organisation: ${form.title}`,
        status: 'completed',
      })

      alert('Evenement cree avec succes !')
      navigate(`/event/${newEvent.id}`)
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la creation')
    } finally { setIsProcessing(false) }
  }

  const isStep1Valid = form.title && form.description && form.city && form.event_date

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/events')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fanzone-accent/10 border border-fanzone-accent/20 mb-4">
              <Zap className="w-4 h-4 text-fanzone-accent" />
              <span className="text-sm font-medium">Frais d'organisation: {ORGANIZER_FEE_EUR} EUR</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Creer un evenement</h1>
            <p className="text-gray-400">Publiez votre evenement et touchez votre audience</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`flex items-center gap-2 ${s === step ? 'text-fanzone-accent' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === step ? 'bg-fanzone-accent text-white' : s < step ? 'bg-green-500 text-white' : 'bg-white/10'}`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="text-sm">{s === 1 ? 'Details' : 'Paiement'}</span>
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Titre de l'evenement</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Mon super evenement" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[120px]" placeholder="Decrivez votre evenement..." required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categorie</label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setForm({ ...form, category: cat.id })}
                      className={`p-3 rounded-xl border transition-all text-sm ${form.category === cat.id ? 'border-fanzone-accent bg-fanzone-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
                      <cat.icon className="w-5 h-5 mx-auto mb-1" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date et heure</label>
                  <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" placeholder="Paris" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prix du billet (EUR)</label>
                <input type="number" min="0" step="0.01" value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: Number(e.target.value) })} className="input-field" placeholder="0 = gratuit" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image de couverture</label>
                <CloudinaryUploader onUpload={(url) => setCoverImage(url)} uploadPreset="fanzone_unsigned" folder="fanzone/events" maxFiles={1} />
                {coverImage && <img src={coverImage} alt="cover" className="mt-3 w-full h-40 object-cover rounded-xl" />}
              </div>

              <div className="glass-card p-4 bg-fanzone-accent/5 border-fanzone-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Frais d'organisation</p>
                    <p className="text-sm text-gray-400">Paiement unique par evenement</p>
                  </div>
                  <div className="text-2xl font-bold gradient-text">{ORGANIZER_FEE_EUR} EUR</div>
                </div>
              </div>

              <button onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid} className="w-full btn-primary disabled:opacity-50 py-4">
                Continuer vers le paiement
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass-card p-6 bg-white/5">
                <h3 className="font-bold mb-4">Recapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Titre</span><span>{form.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Categorie</span><span className="capitalize">{form.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{new Date(form.event_date).toLocaleString('fr-FR')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Lieu</span><span>{form.city}, {userCountry}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Billet</span><span>{form.ticket_price > 0 ? `${form.ticket_price} EUR` : 'Gratuit'}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                    <span>Frais d'organisation</span>
                    <span className="text-fanzone-accent">{ORGANIZER_FEE_EUR} EUR</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">Retour</button>
                <button onClick={handlePayAndCreate} disabled={isProcessing} className="btn-primary flex-1 py-4 disabled:opacity-50">
                  {isProcessing ? 'Traitement...' : `Payer ${ORGANIZER_FEE_EUR} EUR et publier`}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
