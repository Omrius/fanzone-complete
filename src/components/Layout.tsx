import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* MASSIVE visible floating orbs — no subtlety */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Giant red orb top-left */}
        <div 
          className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-60 dark:opacity-50 blur-[120px] animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        {/* Giant purple orb top-right */}
        <div 
          className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full opacity-50 dark:opacity-40 blur-[120px] animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '1s' }}
        />
        {/* Giant cyan orb bottom-left */}
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-50 dark:opacity-40 blur-[120px] animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        {/* Giant amber orb bottom-right */}
        <div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-40 dark:opacity-30 blur-[120px] animate-pulse"
          style={{ animationDuration: '7s', animationDelay: '3s' }}
        />
        {/* Center accent orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-fanzone-accent to-fanzone-purple rounded-full opacity-30 dark:opacity-25 blur-[100px] animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '0.5s' }}
        />
        {/* Floating dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/80 dark:bg-white/60 animate-ping"
            style={{
              left: `${(i * 13 + 5) % 95}%`,
              top: `${(i * 17 + 3) % 95}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.3) % 4}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 text-gray-900 dark:text-white">
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}
