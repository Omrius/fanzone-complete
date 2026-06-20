import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-fanzone-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-fanzone-accent" />
            <span className="font-bold gradient-text">FANZONE</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Made by <span className="font-semibold text-gray-900 dark:text-white">ITBABAR</span> company
          </p>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Confidentialite</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}