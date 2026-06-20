import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Floating orbs — visible behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-red-500/40 dark:bg-red-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute top-40 -right-20 w-[600px] h-[600px] rounded-full bg-purple-500/40 dark:bg-purple-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/30 dark:bg-cyan-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-amber-500/20 dark:bg-amber-500/15 blur-3xl animate-pulse"
          style={{ animationDuration: '9s', animationDelay: '1s' }}
        />
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60 dark:bg-white/40 animate-ping"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              animationDuration: `${2 + (i % 4)}s`,
              animationDelay: `${(i * 0.2) % 3}s`,
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
