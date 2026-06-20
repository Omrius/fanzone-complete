import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-fanzone-dark dark:text-white">
      <Navbar />
      <main className="pt-16">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
