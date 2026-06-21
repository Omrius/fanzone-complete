import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50px', left: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(236,72,153,0.7) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '6s',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50px', right: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(147,51,234,0.9) 0%, rgba(79,70,229,0.7) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '8s',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '50px', left: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.9) 0%, rgba(20,184,166,0.7) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '50px', right: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(249,115,22,0.7) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '7s',
            animationDelay: '3s',
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
              width: '4px', height: '4px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.3) % 4}s`,
            }}
          />
        ))}
      </div>
      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}
