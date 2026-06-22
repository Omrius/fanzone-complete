import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}