import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Animated background orbs — z-index: -1 to sit behind everything */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {/* Red orb top-left */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '-150px', left: '-150px',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(236,72,153,0.6) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '6s',
          }}
        />
        {/* Purple orb top-right */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '-100px', right: '-100px',
            width: '800px', height: '800px',
            background: 'radial-gradient(circle, rgba(147,51,234,0.7) 0%, rgba(79,70,229,0.5) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '8s',
            animationDelay: '1s',
          }}
        />
        {/* Cyan orb bottom-left */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '-100px', left: '-50px',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.7) 0%, rgba(20,184,166,0.5) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        {/* Amber orb bottom-right */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '-50px', right: '-50px',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(249,115,22,0.4) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '7s',
            animationDelay: '3s',
          }}
        />
        {/* Center accent orb */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(255,71,87,0.5) 0%, rgba(108,92,231,0.3) 50%, transparent 70%)',
            filter: 'blur(60px)',
            animationDuration: '5s',
            animationDelay: '0.5s',
          }}
        />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              left: `${(i * 37 + 13) % 95}%`,
              top: `${(i * 23 + 7) % 95}%`,
              width: '3px', height: '3px',
              backgroundColor: 'rgba(255,255,255,0.9)',
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
