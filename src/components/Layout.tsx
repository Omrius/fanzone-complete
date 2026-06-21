import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* DEBUG: visible border + label to verify rendering */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, border: '4px solid lime' }}>
        <div className="absolute top-2 left-2 text-xs font-bold text-lime-500 bg-black/80 px-2 py-1 rounded">ORBES</div>
        {/* Red orb top-left */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50px', left: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(236,72,153,0.8) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '6s',
          }}
        />
        {/* Purple orb top-right */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50px', right: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(79,70,229,0.8) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '8s',
            animationDelay: '1s',
          }}
        />
        {/* Cyan orb bottom-left */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '50px', left: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(34,211,238,1) 0%, rgba(20,184,166,0.8) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        {/* Amber orb bottom-right */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '50px', right: '50px',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(249,115,22,0.8) 40%, transparent 70%)',
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
              width: '6px', height: '6px',
              backgroundColor: 'rgba(0,255,0,1)',
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.3) % 4}s`,
            }}
          />
        ))}
      </div>
      <div className="relative text-gray-900 dark:text-white" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}
