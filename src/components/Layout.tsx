import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* TEST: orbes très visibles avec z-index 9999 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
        <div
          className="absolute rounded-full"
          style={{
            top: '100px', left: '100px',
            width: '200px', height: '200px',
            background: 'red',
            opacity: 1,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '100px', right: '100px',
            width: '200px', height: '200px',
            background: 'blue',
            opacity: 1,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '100px', left: '100px',
            width: '200px', height: '200px',
            background: 'green',
            opacity: 1,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '100px', right: '100px',
            width: '200px', height: '200px',
            background: 'yellow',
            opacity: 1,
          }}
        />
      </div>
      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}
