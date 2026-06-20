import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('')

  const type = searchParams.get('type')

  useEffect(() => {
    async function handleSuccess() {
      if (type === 'event_organizer') {
        const pending = localStorage.getItem('pending_event')
        if (pending) {
          try {
            const eventData = JSON.parse(pending)
            const { data, error } = await supabase.from('events').insert({
              creator_id: eventData.creator_id,
              title: eventData.title,
              description: eventData.description,
              category: eventData.category,
              country: eventData.country,
              city: eventData.city,
              event_date: eventData.event_date,
              cover_image: eventData.cover_image,
              ticket_price: eventData.ticket_price,
              organizer_fee_paid: true,
              status: 'upcoming',
            }).select().single()

            if (error) throw error

            localStorage.removeItem('pending_event')
            setStatus('success')
            setMessage('Votre événement a été créé avec succès !')
            setTimeout(() => navigate(`/event/${data.id}`), 3000)
            return
          } catch (err: any) {
            console.error('Error creating event:', err)
            setStatus('error')
            setMessage('Erreur lors de la création de l\'événement. Contactez le support.')
            return
          }
        }
      }

      setStatus('success')
      setMessage('Paiement confirmé avec succès !')
    }

    handleSuccess()
  }, [type, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-fanzone-accent mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Traitement en cours...</h2>
            <p className="text-gray-400">Veuillez patienter pendant que nous finalisons votre paiement.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{message}</h2>
            <p className="text-gray-400 mb-6">Redirection automatique...</p>
            <button onClick={() => navigate('/')} className="btn-primary w-full">
              Retour à l'accueil
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">!</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">Erreur</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <button onClick={() => navigate('/create-event')} className="btn-primary w-full">
              Réessayer
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
