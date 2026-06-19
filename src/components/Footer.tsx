import { Zap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-fanzone-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-fanzone-accent" />
            <span className="font-bold gradient-text">FANZONE</span>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-fanzone-accent fill-fanzone-accent" /> pour les createurs
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialite</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}