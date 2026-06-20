import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'

export default function PaymentCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Paiement annulé</h2>
        <p className="text-gray-400 mb-6">
          Vous avez annulé le paiement. Votre événement n'a pas été créé. Vous pouvez réessayer à tout moment.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/create-event')} className="btn-primary flex-1">
            Réessayer
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary flex-1">
            Accueil
          </button>
        </div>
      </motion.div>
    </div>
  )
}
