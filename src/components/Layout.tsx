import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AnimatedBackground from './AnimatedBackground'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 text-gray-900 dark:text-white">
        <Navbar />
        <main className="pt-16 min-h-screen">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  )
}
